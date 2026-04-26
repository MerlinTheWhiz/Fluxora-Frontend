import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusPill from "./StatusPill";

describe("StatusPill", () => {
  it("renders status in uppercase", () => {
    render(<StatusPill status="Active" />);
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("applies correct styles for Active status", () => {
    const { container } = render(<StatusPill status="Active" />);
    const pill = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(pill);
    expect(style.color).toBe("rgb(0, 212, 170)");
    expect(style.backgroundColor).toBe("rgba(0, 212, 170, 0.1)");
  });

  it("applies correct styles for Paused status", () => {
    const { container } = render(<StatusPill status="Paused" />);
    const pill = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(pill);
    expect(style.color).toBe("rgb(255, 185, 0)");
    expect(style.backgroundColor).toBe("rgba(255, 185, 0, 0.1)");
  });

  it("applies correct styles for Completed status", () => {
    const { container } = render(<StatusPill status="Completed" />);
    const pill = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(pill);
    expect(style.color).toBe("rgb(0, 184, 212)");
    expect(style.backgroundColor).toBe("rgba(0, 184, 212, 0.1)");
  });
});
