import type { StreamStatus } from "./Stream";

interface Props {
  status: StreamStatus;
}

const statusStyles: Record<StreamStatus, { background: string; color: string }> = {
  Active: {
    background: "var(--color-success-bg)",
    color: "var(--color-success)",
  },
  Paused: {
    background: "var(--color-warning-bg)",
    color: "var(--color-warning)",
  },
  Completed: {
    background: "var(--color-info-bg)",
    color: "var(--color-info)",
  },
};

export default function StatusPill({ status }: Props) {
  const { background, color } = statusStyles[status];

  return (
    <span
      style={{ backgroundColor: background, color }}
      className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium"
    >
      {status.toUpperCase()}
    </span>
  );
}