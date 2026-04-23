import React from "react";
import Button from "./Button";

interface ConnectButtonProps {
  onClick?: () => void;
}

export default function ConnectButton({ onClick }: ConnectButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="Connect wallet"
      icon={
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      }
    >
      Connect wallet
    </Button>
  );
}
