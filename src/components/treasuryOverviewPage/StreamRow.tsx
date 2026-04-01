import { useNavigate } from "react-router-dom";
import StatusPill from "./StatusPill";
import { Stream } from "./Stream";

interface Props {
  stream: Stream;
}

export default function StreamRow({ stream }: Props) {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-gray-200">
      <td className="py-3">
        <div className="font-light text-black">{stream.name}</div>
        <div className="text-sm text-gray-500">{stream.id}</div>
      </td>

      <td className="py-3 text-black">{stream.recipient}</td>

      <td className="py-3 text-black">{stream.rate}</td>

      <td className="py-3">
        <StatusPill status={stream.status} />
      </td>

      <td className="py-3">
        <button
          onClick={() => navigate(`/app/streams/${stream.id}`)}
          className="text-teal-400  flex items-center gap-1"
        >
          View ↗
        </button>
      </td>
    </tr>
  );
}
