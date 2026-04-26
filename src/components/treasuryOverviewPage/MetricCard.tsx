import { Metric } from "./Metric";

export default function MetricCard({ icon, label, value, desc }: Metric) {
  return (
    <div
      className="flex flex-col bg-gray-100 rounded-xl p-6 h-full"
      role="group"
      aria-label={label}
    >
      <div className="flex items-center justify-center w-10 h-10 text-3xl leading-none mb-4 shrink-0">
        {icon}
      </div>

      <div className="text-gray-800 font-medium text-sm leading-5 mb-2">
        {label}
      </div>

      <div className="text-2xl font-semibold leading-8 text-black mb-2">
        {value}
      </div>

      <p className="text-gray-600 text-sm leading-5 mt-auto">
        {desc}
      </p>
    </div>
  );
}
