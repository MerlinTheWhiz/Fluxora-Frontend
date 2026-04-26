import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MetricCard from "./MetricCard";

describe("MetricCard", () => {
  const mockMetric = {
    icon: "💰",
    label: "Total Balance",
    value: "$100,000",
    desc: "Available in treasury"
  };

  it("renders metric data correctly", () => {
    render(<MetricCard {...mockMetric} />);
    expect(screen.getByText("💰")).toBeInTheDocument();
    expect(screen.getByText("Total Balance")).toBeInTheDocument();
    expect(screen.getByText("$100,000")).toBeInTheDocument();
    expect(screen.getByText("Available in treasury")).toBeInTheDocument();
  });

  it("applies correct styles from design tokens", () => {
    const { container } = render(<MetricCard {...mockMetric} />);
    const card = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(card);
    expect(style.backgroundColor).toBe("var(--color-surface-default)");
    expect(style.border).toBe("1px solid var(--color-border-default)");
  });
});
