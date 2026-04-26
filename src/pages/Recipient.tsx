import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import RecipientStreams from "../components/recipient/RecipientStreams";
import RecipientLoading from "../components/RecipientLoading";

export default function Recipient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const balance: number = 22600.0;
  const activeStreams = 2;
  const totalAccrued = 43250.0;
  const totalWithdrawn = 20650.0;
  const walletConnected = true;
  // Replace with real stream data
  const hasStreams = activeStreams > 0;

  const disabled = !walletConnected || balance === 0;

  if (loading) return <RecipientLoading />;

  if (!walletConnected || !hasStreams) {
    return (
      <div>
        <h1 style={{ marginTop: 0, fontSize: "2rem", fontWeight: 700 }}>Your streams</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          View your incoming streams and withdraw accrued USDC at any time.
        </p>
        <EmptyState
          variant="recipient"
          walletConnected={walletConnected}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header & Overview Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Recipient Portal</h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your incoming streams, track accrued balances, and withdraw USDC in real-time.
          </p>
        </div>

        {/* Global Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Streams</span>
            <span className="text-xl font-black text-white">{activeStreams}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Accrued</span>
            <span className="text-xl font-black text-emerald-500">{totalAccrued.toLocaleString()} USDC</span>
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Withdrawn</span>
            <span className="text-xl font-black text-slate-400">{totalWithdrawn.toLocaleString()} USDC</span>
          </div>
        </div>
      </div>

      {/* Main Action Card: Withdrawable Balance */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Animated Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 self-center md:self-start rounded-full bg-cyan-500/10 px-4 py-1.5 border border-cyan-500/20">
               <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Available to Claim</span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter">
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-2xl font-bold text-slate-500 tracking-tight uppercase">USDC</span>
            </div>
            
            <p className="text-slate-400 font-medium max-w-sm">
                Your accumulated balance from all active streams across all DAOs.
                Funds are available for instant withdrawal to your connected wallet.
            </p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <button
              disabled={disabled}
              className={`
                group relative w-full md:w-[280px] py-6 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-black text-lg uppercase tracking-wider
                ${
                  disabled
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed border-slate-700"
                    : "bg-cyan-500 text-white hover:scale-[1.03] hover:bg-cyan-400 shadow-[0_20px_40px_-10px_rgba(6,182,212,0.5)] active:scale-95 border-none"
                }
              `}
            >
              <span>Withdraw USDC</span>
              {!disabled && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="m11 5 7 7-7 7" />
                  <path d="M4 12h14" />
                </svg>
              )}
            </button>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure On-Chain Transaction
            </span>
          </div>
        </div>
      </div>

      {/* Streams Overview Section */}
      <div className="mt-4">
        <RecipientStreams />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
