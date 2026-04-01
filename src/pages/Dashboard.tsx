import React, { useEffect, useState } from 'react';
import RecentStreams, { Stream } from '../components/RecentStreams';
import CreateStreamModal from '../components/CreateStreamModal';
import TreasuryOverviewLoading from '../components/TreasuryOverviewLoading';
import TreasuryEmptyState from '../components/TreasuryEmptyState';
import TreasuryOnboarding from '../components/TreasuryOnboarding';
import ConnectWalletModal from '../components/ConnectWalletModal';

const ONBOARDING_KEY = 'fluxora_onboarding_dismissed';

function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch {
    return false;
  }
}

function markOnboardingSeen(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {
    // storage unavailable — treat as transient
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [streams] = useState<Stream[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Resolve wallet connection state from Freighter (best-effort, no popup)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { isConnected, getAddress } = await import('@stellar/freighter-api');
        const conn = await isConnected();
        if (!conn.isConnected) return;
        const addr = await getAddress();
        if (!addr.error && addr.address) {
          setWalletConnected(true);
          setWalletAddress(addr.address);
        }
      } catch {
        // Freighter not installed or not approved — silent
      }
    })();
  }, []);

  useEffect(() => {
    // Demo: simulate async fetch — remove when wiring real fetch.
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Show onboarding on first-ever visit to an empty treasury
  useEffect(() => {
    if (!loading && streams.length === 0 && !hasSeenOnboarding()) {
      setShowOnboarding(true);
    }
  }, [loading, streams.length]);

  const handleDismissOnboarding = () => {
    markOnboardingSeen();
    setShowOnboarding(false);
  };

  const handleOnboardingCreateStream = () => {
    markOnboardingSeen();
    setShowOnboarding(false);
    setIsModalOpen(true);
  };

  if (loading) return <TreasuryOverviewLoading />;

  const hasStreams = streams.length > 0;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Treasury overview</h1>
      <p style={{ color: "var(--muted)" }}>
        Treasury overview and active stream summary. Connect your wallet to see
        real-time capital flow.
      </p>

      {/* Wallet connection banner — shown only when not connected and past onboarding */}
      {!walletConnected && !showOnboarding && (
        <div style={walletBannerStyle} role="alert" aria-live="polite">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ color: '#f59e0b', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
              Connect your Stellar wallet to see real balances and create streams.
            </span>
          </div>
          <button
            type="button"
            style={connectBannerBtnStyle}
            onClick={() => setIsWalletModalOpen(true)}
            aria-label="Connect Stellar wallet"
          >
            Connect wallet
          </button>
        </div>
      )}

      <div style={cardGrid}>
        <div style={card}>
          <div style={cardLabel}>Active Streams</div>
          <div style={cardValue}>{streams.length || "—"}</div>
        </div>
        <div style={card}>
          <div style={cardLabel}>Total Streaming</div>
          <div style={cardValue}>— USDC</div>
        </div>
        <div style={card}>
          <div style={cardLabel}>Withdrawable</div>
          <div style={cardValue}>— USDC</div>
        </div>
      </div>

      {hasStreams ? (
        <>
          <RecentStreams streams={streams} />
          <button
            type="button"
            style={createBtnStyle}
            onClick={() => setIsModalOpen(true)}
            aria-label="Create stream"
          >
            Create stream
          </button>
        </>
      ) : showOnboarding ? (
        <TreasuryOnboarding
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          onConnectWallet={() => setIsWalletModalOpen(true)}
          onCreateStream={handleOnboardingCreateStream}
          onDismiss={handleDismissOnboarding}
        />
      ) : (
        <TreasuryEmptyState onCreateStream={() => setIsModalOpen(true)} />
      )}

      <CreateStreamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}

const walletBannerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.75rem',
  background: 'rgba(245, 158, 11, 0.06)',
  border: '1px solid rgba(245, 158, 11, 0.25)',
  borderRadius: '10px',
  padding: '0.75rem 1rem',
  marginTop: '0.75rem',
  marginBottom: '0.25rem',
};

const connectBannerBtnStyle: React.CSSProperties = {
  background: 'var(--accent)',
  color: '#000',
  border: 'none',
  borderRadius: '6px',
  padding: '0.375rem 0.875rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const createBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "var(--accent)",
  color: "#ffffff",
  border: "none",
  padding: "0.625rem 1.25rem",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 4px 24px rgba(0, 212, 170, 0.4)",
};

const cardGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "1rem",
  marginTop: "1.5rem",
};

const card: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: "1.25rem",
};

const cardLabel: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--muted)",
  marginBottom: "0.25rem",
};

const cardValue: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
};
