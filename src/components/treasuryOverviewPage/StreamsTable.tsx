import { streams } from "./sample-streams.tsx"; 
import StreamRow from "./StreamRow";
import { Stream } from "./Stream";

export default function StreamsTable() {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--color-border-default)" }}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr 
            style={{ 
              backgroundColor: "var(--color-surface-raised)",
              color: "var(--color-text-muted)",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.05em",
            }}
          >
            <th className="py-4 px-3">STREAM</th>
            <th className="py-4 px-3">RECIPIENT</th>
            <th className="py-4 px-3">RATE</th>
            <th className="py-4 px-3">STATUS</th>
            <th className="py-4 px-3">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {streams.map((s: Stream, i: number) => (
            <StreamRow key={i} stream={s} />
          ))}
        </tbody>
      </table>
    </div>
  );
}