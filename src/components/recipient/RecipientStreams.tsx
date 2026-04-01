import { useState } from "react";

interface Stream {
  id: string;
  sender: string;
  senderName: string;
  amount: number;
  rate: number; // USDC per hour
  progress: number;
  status: "active" | "paused" | "completed";
  isPinned: boolean;
  startTime: string;
}

const mockStreams: Stream[] = [
  {
    id: "1",
    sender: "GD...3X4",
    senderName: "Stellar Dev Foundation",
    amount: 15000,
    rate: 20.5,
    progress: 75,
    status: "active",
    isPinned: true,
    startTime: "2024-03-01",
  },
  {
    id: "2",
    sender: "GC...9Y2",
    senderName: "Fluxora DAO",
    amount: 5000,
    rate: 5.25,
    progress: 45,
    status: "active",
    isPinned: false,
    startTime: "2024-03-15",
  },
  {
    id: "3",
    sender: "GB...1Z8",
    senderName: "Ecosystem Grant #42",
    amount: 2500,
    rate: 1.5,
    progress: 10,
    status: "active",
    isPinned: false,
    startTime: "2024-03-28",
  },
];

export default function RecipientStreams() {
  const [streams, setStreams] = useState<Stream[]>(mockStreams);

  const togglePin = (id: string) => {
    setStreams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  const sortedStreams = [...streams].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Incoming Streams</h2>
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Sort by:</span>
            <select className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                <option>Priority (Pinned)</option>
                <option>Newest First</option>
                <option>Highest Rate</option>
            </select>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedStreams.map((stream) => (
          <div
            key={stream.id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
              stream.isPinned
                ? "bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-cyan-500/30"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* Pinned Indicator Glow */}
            {stream.isPinned && (
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            )}

            <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
              {/* Sender Info */}
              <div className="flex items-center gap-4 min-w-[240px]">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg ${
                    stream.isPinned ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {stream.senderName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{stream.senderName}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{stream.sender}</span>
                </div>
              </div>

              {/* Progress & Amount */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{stream.amount.toLocaleString()}</span>
                    <span className="text-xs font-medium text-slate-500">USDC Total</span>
                  </div>
                  <span className={`text-xs font-bold ${stream.isPinned ? "text-cyan-400" : "text-slate-400"}`}>
                    {stream.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      stream.isPinned ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-slate-600"
                    }`}
                    style={{ width: `${stream.progress}%` }}
                  />
                </div>
              </div>

              {/* Rate & Actions */}
              <div className="flex items-center gap-8 min-w-[200px] justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rate</span>
                  <span className="text-sm font-bold text-white">{stream.rate} USDC/hr</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePin(stream.id)}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      stream.isPinned
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                    }`}
                    aria-label={stream.isPinned ? "Unpin stream" : "Pin stream"}
                    title={stream.isPinned ? "Unpin stream" : "Pin stream"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={stream.isPinned ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
