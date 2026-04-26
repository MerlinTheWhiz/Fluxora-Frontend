import { useNavigate } from "react-router-dom";
import StatusPill from "./StatusPill";
import { Stream } from "./Stream";

interface Props {
  stream: Stream;
}

export default function StreamRow({ stream }: Props) {
  const navigate = useNavigate();

  return (
    <tr 
      className="transition-colors duration-150"
      style={{ 
        borderBottom: "1px solid var(--color-border-default)",
        backgroundColor: "var(--color-surface-default)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-default)")}
    >
      <td className="py-4 px-3">
        <div 
          className="font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {stream.name}
        </div>
        <div 
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {stream.id}
        </div>
      </td>

      <td className="py-4 px-3" style={{ color: "var(--color-text-primary)" }}>
        {stream.recipient}
      </td>

      <td className="py-4 px-3" style={{ color: "var(--color-text-primary)" }}>
        {stream.rate}
      </td>

      <td className="py-4 px-3">
        <StatusPill status={stream.status} />
      </td>

      <td className="py-4 px-3">
        <button
          onClick={() => navigate(`/app/streams/${stream.id}`)}
          className="font-medium flex items-center gap-1 transition-colors duration-200"
          style={{ color: "var(--color-accent-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-primary-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-accent-primary)")}
        >
          View ↗
        </button>
      </td>
    </tr>
  );
}
