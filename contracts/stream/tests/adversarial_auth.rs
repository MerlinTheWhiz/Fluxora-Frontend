//! Adversarial authentication tests for admin override operations.
//!
//! Validates that admin_pause, admin_resume, and admin_cancel:
//!   - Enforce strict authentication (non-admin callers are rejected)
//!   - Behave correctly across all stream lifecycle states
//!   - Safely handle missing/invalid stream IDs
//!   - Produce semantically consistent state transitions with sender paths

#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation, Events},
    Address, Env, IntoVal,
};

use crate::{
    StreamContract, StreamContractClient,
    errors::ContractError,
    types::{StreamState, StreamId},
};

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/// Minimal environment + contract setup shared across tests.
struct TestEnv {
    env: Env,
    contract_id: Address,
    admin: Address,
    sender: Address,
    recipient: Address,
}

impl TestEnv {
    fn new() -> Self {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, StreamContract);
        let admin = Address::generate(&env);
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let client = StreamContractClient::new(&env, &contract_id);
        client.initialize(&admin);

        Self { env, contract_id, admin, sender, recipient }
    }

    fn client(&self) -> StreamContractClient {
        StreamContractClient::new(&self.env, &self.contract_id)
    }

    /// Create a stream and return its ID. Stream starts in Active state.
    fn create_active_stream(&self) -> StreamId {
        let client = self.client();
        client.create_stream(
            &self.sender,
            &self.recipient,
            &1_000_000_u64, // amount
            &100_u64,        // start_time
            &1_000_u64,      // end_time
        )
    }

    /// Create a stream and immediately pause it (Paused state).
    fn create_paused_stream(&self) -> StreamId {
        let id = self.create_active_stream();
        self.client().pause_stream(&self.sender, &id);
        id
    }

    /// Create a stream and immediately cancel it (Cancelled / terminal state).
    fn create_cancelled_stream(&self) -> StreamId {
        let id = self.create_active_stream();
        self.client().cancel_stream(&self.sender, &id);
        id
    }

    /// Create a stream whose end_time is in the past (time-terminal / expired).
    fn create_expired_stream(&self) -> StreamId {
        let client = self.client();
        // end_time = 1 means it expired immediately at ledger time > 1
        let id = client.create_stream(
            &self.sender,
            &self.recipient,
            &1_000_000_u64,
            &1_u64,  // start_time
            &2_u64,  // end_time — already in the past
        );
        // Advance ledger past end_time
        self.env.ledger().with_mut(|l| l.timestamp = 1_000);
        id
    }
}

/// Assert that a call fails with an auth / unauthorized error.
macro_rules! assert_auth_error {
    ($result:expr) => {
        match $result {
            Err(e) => {
                let is_auth_err = matches!(
                    e,
                    ContractError::Unauthorized | ContractError::NotAdmin
                );
                assert!(
                    is_auth_err,
                    "Expected auth error, got: {:?}",
                    e
                );
            }
            Ok(_) => panic!("Expected auth error but call succeeded"),
        }
    };
}

/// Assert that a call fails with a specific state-related error.
macro_rules! assert_state_error {
    ($result:expr, $expected:expr) => {
        match $result {
            Err(e) => assert_eq!(e, $expected, "Unexpected error variant"),
            Ok(_) => panic!("Expected error {:?} but call succeeded", $expected),
        }
    };
}

// ===========================================================================
// 1. AUTHORIZATION TESTS — non-admin callers must be rejected
// ===========================================================================

#[test]
fn test_non_admin_cannot_call_admin_pause() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    // sender is not the admin
    let result = t.client().try_admin_pause(&t.sender, &id);
    assert_auth_error!(result);
}

#[test]
fn test_non_admin_cannot_call_admin_resume() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();

    let result = t.client().try_admin_resume(&t.sender, &id);
    assert_auth_error!(result);
}

#[test]
fn test_non_admin_cannot_call_admin_cancel() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    let result = t.client().try_admin_cancel(&t.sender, &id);
    assert_auth_error!(result);
}

#[test]
fn test_spoofed_address_cannot_call_admin_pause() {
    let t = TestEnv::new();
    let id = t.create_active_stream();
    let spoofed = Address::generate(&t.env); // unrelated address

    let result = t.client().try_admin_pause(&spoofed, &id);
    assert_auth_error!(result);
}

#[test]
fn test_spoofed_address_cannot_call_admin_resume() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();
    let spoofed = Address::generate(&t.env);

    let result = t.client().try_admin_resume(&spoofed, &id);
    assert_auth_error!(result);
}

#[test]
fn test_spoofed_address_cannot_call_admin_cancel() {
    let t = TestEnv::new();
    let id = t.create_active_stream();
    let spoofed = Address::generate(&t.env);

    let result = t.client().try_admin_cancel(&spoofed, &id);
    assert_auth_error!(result);
}

// ===========================================================================
// 2. STATE COVERAGE — Active stream
// ===========================================================================

#[test]
fn test_admin_pause_active_stream_succeeds() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    t.client().admin_pause(&t.admin, &id);

    let stream = t.client().get_stream(&id);
    assert_eq!(stream.state, StreamState::Paused);
}

#[test]
fn test_admin_cancel_active_stream_succeeds() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    t.client().admin_cancel(&t.admin, &id);

    let stream = t.client().get_stream(&id);
    assert_eq!(stream.state, StreamState::Cancelled);
}

#[test]
fn test_admin_resume_active_stream_fails_already_active() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    // Resuming an already-active stream is invalid
    let result = t.client().try_admin_resume(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamNotPaused);
}

// ===========================================================================
// 3. STATE COVERAGE — Paused stream
// ===========================================================================

#[test]
fn test_admin_resume_paused_stream_succeeds() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();

    t.client().admin_resume(&t.admin, &id);

    let stream = t.client().get_stream(&id);
    assert_eq!(stream.state, StreamState::Active);
}

#[test]
fn test_admin_cancel_paused_stream_succeeds() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();

    t.client().admin_cancel(&t.admin, &id);

    let stream = t.client().get_stream(&id);
    assert_eq!(stream.state, StreamState::Cancelled);
}

#[test]
fn test_admin_pause_already_paused_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();

    // Double-pause: contract must reject or treat as no-op with an error
    let result = t.client().try_admin_pause(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamAlreadyPaused);
}

// ===========================================================================
// 4. STATE COVERAGE — Cancelled (terminal)
// ===========================================================================

#[test]
fn test_admin_pause_cancelled_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_cancelled_stream();

    let result = t.client().try_admin_pause(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_resume_cancelled_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_cancelled_stream();

    let result = t.client().try_admin_resume(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_cancel_cancelled_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_cancelled_stream();

    let result = t.client().try_admin_cancel(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

// ===========================================================================
// 5. STATE COVERAGE — Completed (terminal)
// ===========================================================================

/// Helper: create a stream and mark it completed (simulate full disbursement).
fn create_completed_stream(t: &TestEnv) -> StreamId {
    let id = t.create_active_stream();
    // Advance time past end_time so the contract considers it completed
    t.env.ledger().with_mut(|l| l.timestamp = 2_000);
    t.client().complete_stream(&id); // triggers completion logic
    id
}

#[test]
fn test_admin_pause_completed_stream_fails() {
    let t = TestEnv::new();
    let id = create_completed_stream(&t);

    let result = t.client().try_admin_pause(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_resume_completed_stream_fails() {
    let t = TestEnv::new();
    let id = create_completed_stream(&t);

    let result = t.client().try_admin_resume(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_cancel_completed_stream_fails() {
    let t = TestEnv::new();
    let id = create_completed_stream(&t);

    let result = t.client().try_admin_cancel(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

// ===========================================================================
// 6. STATE COVERAGE — Time-terminal (expired) streams
// ===========================================================================

#[test]
fn test_admin_pause_expired_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_expired_stream();

    let result = t.client().try_admin_pause(&t.admin, &id);
    assert!(result.is_err(), "Pause on expired stream must fail");
}

#[test]
fn test_admin_resume_expired_stream_fails() {
    let t = TestEnv::new();
    let id = t.create_expired_stream();

    let result = t.client().try_admin_resume(&t.admin, &id);
    assert!(result.is_err(), "Resume on expired stream must fail");
}

#[test]
fn test_admin_cancel_expired_stream_matches_contract_rules() {
    let t = TestEnv::new();
    let id = t.create_expired_stream();

    // Cancel on an expired-but-not-yet-settled stream: contract may allow or deny.
    // We assert the result is consistent with the sender cancel path.
    let sender_result = t.client().try_cancel_stream(&t.sender, &id);
    let admin_result = t.client().try_admin_cancel(&t.admin, &id);

    assert_eq!(
        sender_result.is_ok(),
        admin_result.is_ok(),
        "admin_cancel and sender cancel must agree on expired stream behavior"
    );
}

// ===========================================================================
// 7. MISSING / INVALID STREAM IDs
// ===========================================================================

#[test]
fn test_admin_pause_nonexistent_stream_fails_safely() {
    let t = TestEnv::new();
    let fake_id: StreamId = 999_999;

    let result = t.client().try_admin_pause(&t.admin, &fake_id);
    assert_state_error!(result, ContractError::StreamNotFound);
}

#[test]
fn test_admin_resume_nonexistent_stream_fails_safely() {
    let t = TestEnv::new();
    let fake_id: StreamId = 999_999;

    let result = t.client().try_admin_resume(&t.admin, &fake_id);
    assert_state_error!(result, ContractError::StreamNotFound);
}

#[test]
fn test_admin_cancel_nonexistent_stream_fails_safely() {
    let t = TestEnv::new();
    let fake_id: StreamId = 999_999;

    let result = t.client().try_admin_cancel(&t.admin, &fake_id);
    assert_state_error!(result, ContractError::StreamNotFound);
}

// ===========================================================================
// 8. SEMANTIC CONSISTENCY — admin path ≈ sender path
// ===========================================================================

#[test]
fn test_admin_pause_produces_same_state_as_sender_pause() {
    let t = TestEnv::new();

    let id_sender = t.create_active_stream();
    let id_admin = t.create_active_stream();

    t.client().pause_stream(&t.sender, &id_sender);
    t.client().admin_pause(&t.admin, &id_admin);

    let sender_stream = t.client().get_stream(&id_sender);
    let admin_stream = t.client().get_stream(&id_admin);

    assert_eq!(sender_stream.state, admin_stream.state);
}

#[test]
fn test_admin_resume_produces_same_state_as_sender_resume() {
    let t = TestEnv::new();

    let id_sender = t.create_paused_stream();
    let id_admin = t.create_paused_stream();

    t.client().resume_stream(&t.sender, &id_sender);
    t.client().admin_resume(&t.admin, &id_admin);

    let sender_stream = t.client().get_stream(&id_sender);
    let admin_stream = t.client().get_stream(&id_admin);

    assert_eq!(sender_stream.state, admin_stream.state);
}

#[test]
fn test_admin_cancel_produces_same_state_as_sender_cancel() {
    let t = TestEnv::new();

    let id_sender = t.create_active_stream();
    let id_admin = t.create_active_stream();

    t.client().cancel_stream(&t.sender, &id_sender);
    t.client().admin_cancel(&t.admin, &id_admin);

    let sender_stream = t.client().get_stream(&id_sender);
    let admin_stream = t.client().get_stream(&id_admin);

    assert_eq!(sender_stream.state, admin_stream.state);
}

// ===========================================================================
// 9. EDGE CASES
// ===========================================================================

#[test]
fn test_double_pause_via_admin_fails() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    t.client().admin_pause(&t.admin, &id);
    let result = t.client().try_admin_pause(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamAlreadyPaused);
}

#[test]
fn test_double_resume_via_admin_fails() {
    let t = TestEnv::new();
    let id = t.create_paused_stream();

    t.client().admin_resume(&t.admin, &id);
    // Stream is now Active; resuming again must fail
    let result = t.client().try_admin_resume(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamNotPaused);
}

#[test]
fn test_admin_resume_after_cancel_fails() {
    let t = TestEnv::new();
    let id = t.create_cancelled_stream();

    let result = t.client().try_admin_resume(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_cancel_after_completion_fails() {
    let t = TestEnv::new();
    let id = create_completed_stream(&t);

    let result = t.client().try_admin_cancel(&t.admin, &id);
    assert_state_error!(result, ContractError::StreamTerminated);
}

#[test]
fn test_admin_pause_then_cancel_succeeds() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    t.client().admin_pause(&t.admin, &id);
    t.client().admin_cancel(&t.admin, &id);

    let stream = t.client().get_stream(&id);
    assert_eq!(stream.state, StreamState::Cancelled);
}

#[test]
fn test_admin_pause_resume_cycle_returns_to_active() {
    let t = TestEnv::new();
    let id = t.create_active_stream();

    t.client().admin_pause(&t.admin, &id);
    assert_eq!(t.client().get_stream(&id).state, StreamState::Paused);

    t.client().admin_resume(&t.admin, &id);
    assert_eq!(t.client().get_stream(&id).state, StreamState::Active);
}
