import React from "react";
import "./skeleton.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

/**
 * Single skeleton placeholder block
 * ──────────────────────────────────────
 * Implements DESIGN_SPEC.md skeleton loading specifications
 * 
 * Accessibility:
 * - aria-hidden="true" - not announced by screen readers
 * - Pulse animation respects prefers-reduced-motion
 * 
 * @param width - Block width (default: 100%)
 * @param height - Block height (default: 14px for text)
 * @param borderRadius - Corner radius (default: 6px)
 */
export function Skeleton({ width = "100%", height = 14, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

/**
 * Multiple skeleton lines (text placeholder)
 * ──────────────────────────────────────
 * Mimics a paragraph of text with variable widths
 * 
 * @param lines - Number of lines (default: 2)
 * @param lastLineWidth - Width of final line (default: 60%)
 */
export function SkeletonText({ lines = 2, lastLineWidth = "60%" }: SkeletonTextProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={13} width={i === lines - 1 ? lastLineWidth : "100%"} />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Skeleton card wrapper
 * ──────────────────────────────────────
 * Provides frame for skeleton content with surface styling
 * Matches actual card dimensions to prevent layout shift
 */
export function SkeletonCard({ children, style }: SkeletonCardProps) {
  return (
    <div
      style={{
        background: "var(--color-surface-default)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface LoadingStateProps {
  /** Whether content is currently loading */
  isLoading: boolean;
  
  /** Message to announce to screen readers */
  loadingMessage?: string;
}

/**
 * Loading state announcer
 * ──────────────────────────────────────
 * Announces loading state to screen readers via aria-live
 * Screen readers will announce: "Loading treasury data" (or custom message)
 */
export function LoadingStateAnnouncer({ isLoading, loadingMessage = "Loading data" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
      }}
    >
      {isLoading && loadingMessage}
    </div>
  );
}
