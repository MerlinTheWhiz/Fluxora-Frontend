import { useRef } from "react";
import type { MouseEvent } from "react";
import { useModalAccessibility } from "./useModalAccessibility";
import styles from "./ConnectWalletModal.module.css";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectFreighter?: () => void;
  onConnectAlbedo?: () => void;
  onConnectWalletConnect?: () => void;
}

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onConnectFreighter,
  onConnectAlbedo,
  onConnectWalletConnect,
}: ConnectWalletModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useModalAccessibility({
    isOpen,
    onClose,
    modalRef,
    initialFocusRef: firstFocusableRef,
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const walletOptions = [
    {
      id: "freighter",
      name: "Freighter",
      description: "Stellar browser extension wallet.",
      icon: "🚀",
      ariaLabel: "Connect Freighter wallet",
      onClick: onConnectFreighter || (() => console.log("Freighter clicked")),
    },
    {
      id: "albedo",
      name: "Albedo",
      description: "Web-based Stellar wallet.",
      icon: "⭐",
      ariaLabel: "Connect Albedo wallet",
      onClick: onConnectAlbedo || (() => console.log("Albedo clicked")),
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      description: "Connect with mobile wallets.",
      icon: "🔗",
      ariaLabel: "Connect WalletConnect wallet",
      onClick:
        onConnectWalletConnect || (() => console.log("WalletConnect clicked")),
    },
  ];

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-wallet-title"
        aria-describedby="connect-wallet-description"
        tabIndex={-1}
      >
        <button
          className={`${styles.closeButton} ${styles.focusable}`}
          onClick={onClose}
          aria-label="Close connect wallet modal"
          type="button"
        >
          ✕
        </button>

        <div className={styles.header}>
          <h2 id="connect-wallet-title" className={styles.title}>
            Connect wallet
          </h2>
          <p id="connect-wallet-description" className={styles.subtitle}>
            Connect your Stellar wallet to use Fluxora.
          </p>
        </div>

        <div className={styles.walletList}>
          {walletOptions.map((wallet, index) => (
            <button
              key={wallet.id}
              ref={index === 0 ? firstFocusableRef : undefined}
              className={`${styles.walletOption} ${styles.focusable}`}
              onClick={wallet.onClick}
              type="button"
              aria-label={wallet.ariaLabel}
            >
              <div className={styles.walletIcon}>{wallet.icon}</div>
              <div className={styles.walletInfo}>
                <div className={styles.walletName}>{wallet.name}</div>
                <div className={styles.walletDescription}>{wallet.description}</div>
              </div>
              <div className={styles.chevron} aria-hidden="true">→</div>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          By connecting, you agree to Fluxora's{" "}
          <a href="/legal/terms" className={`${styles.termsLink} ${styles.focusable}`}>
            Terms of Service
          </a>
          .
        </div>
      </div>
    </div>
  );
}
