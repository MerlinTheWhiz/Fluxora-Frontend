import MetricCard from "./MetricCard";
import { metricsData } from "./sample-streams.tsx";
import { Metric } from "./Metric";

export default function Metrics() {
  return (
    <section
      aria-label="Treasury metrics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch"
    >
      {metricsData.map((m: Metric, i: number) => (
        <MetricCard key={i} {...m} />
      ))}
    </section>
  );
}
