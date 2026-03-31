import React, { useEffect, useState } from 'react';
import CreateStreamModal from "../components/CreateStreamModal";
import StreamCreatedModal from "../components/Streams/StreamCreatedModal";
import EmptyState from "../components/EmptyState";
import StreamsLoading from "../components/StreamsLoading";

// ── Types ────────────────────────────────────────────────────────────────────
interface Stream {
  id: string;
  recipient: string;
  rate: string;
  status: string;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Streams() {
  const [loading, setLoading] = useState(true);
  // Replace with real stream data from API/wallet
  const [streams] = useState<Stream[]>([]);
  // Replace with real wallet connection state
  const walletConnected = true;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <StreamsLoading />;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdStream] = useState({ id: "529", url: "https://fluxora.io/stream/529" });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Streams</h1>
      <p style={{ color: 'var(--muted)' }}>
        Create and manage USDC streams. Set rate, duration, and cliff from the treasury.
      </p>

      {streams.length === 0 ? (
        <EmptyState
          variant="streams"
          walletConnected={walletConnected}
          onPrimaryAction={walletConnected ? () => setIsCreateModalOpen(true) : undefined}
        />
      ) : (
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th>Stream</th>
                <th>Recipient</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((stream) => (
                <tr key={stream.id}>
                  <td>{stream.id}</td>
                  <td>{stream.recipient}</td>
                  <td>{stream.rate}</td>
                  <td>{stream.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateStreamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStreamCreated={() => {
          setIsCreateModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
      <StreamCreatedModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        streamId={createdStream.id}
        streamUrl={createdStream.url}
        onCreateAnother={() => {
          setIsSuccessModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const tableWrap: React.CSSProperties = {
  marginTop: "1.5rem",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  overflow: "hidden",
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};
