import { Metric } from "./Metric"; 

export default function MetricCard({ icon, label, value, desc }: Metric) {
  return (
    <div 
      className="rounded-xl p-5 transition-all duration-200"
      style={{
        backgroundColor: "var(--color-surface-default)",
        border: "1px solid var(--color-border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="text-3xl mb-3">{icon}</div>

      <div 
        className="font-medium uppercase tracking-wider mb-1"
        style={{
          color: "var(--color-text-muted)",
          fontSize: "12px",
        }}
      >
        {label}
      </div>

      <div 
        className="font-semibold mb-2"
        style={{
          color: "var(--color-text-primary)",
          fontSize: "24px",
        }}
      >
        {value}
      </div>

      <p 
        className="text-sm"
        style={{
          color: "var(--color-text-muted)",
        }}
      >
        {desc}
      </p>
    </div>
  );
}