import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConnectButton from "./ConnectButton";

describe("ConnectButton", () => {
  it("renders with correct text", () => {
    render(<ConnectButton />);
    expect(screen.getByText(/Connect wallet/i)).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<ConnectButton onClick={onClick} />);
    screen.getByText(/Connect wallet/i).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has correct styles from design tokens", () => {
    render(<ConnectButton />);
    const button = screen.getByRole("button");
    const style = window.getComputedStyle(button);
    expect(style.backgroundColor).toBe("var(--color-accent-primary)");
  });
});
