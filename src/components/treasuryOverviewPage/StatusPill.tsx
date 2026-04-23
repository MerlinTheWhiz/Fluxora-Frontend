interface Props {
  status: "Active" | "Paused" | "Completed";
}

export default function StatusPill({ status }: Props) {
  const styles: Record<string, React.CSSProperties> = {
    Active: {
      backgroundColor: "rgba(0, 212, 170, 0.1)",
      color: "#00D4AA",
    },
    Paused: {
      backgroundColor: "rgba(255, 185, 0, 0.1)",
      color: "#FFB900",
    },
    Completed: {
      backgroundColor: "rgba(0, 184, 212, 0.1)",
      color: "#00B8D4",
    },
  };

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
      style={styles[status]}
    >
      {status.toUpperCase()}
    </span>
  );
}