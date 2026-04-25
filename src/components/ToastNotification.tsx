import "./ToastNotification.css";

export type ToastVariant = "success" | "error";

interface ToastNotificationProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

const TOAST_COPY: Record<ToastVariant, { label: string; icon: string }> = {
  success: {
    label: "Success",
    icon: "✓",
  },
  error: {
    label: "Error",
    icon: "!",
  },
};

export default function ToastNotification({
  message,
  variant,
  onClose,
}: ToastNotificationProps) {
  const semantics =
    variant === "error"
      ? {
          role: "alert" as const,
          "aria-live": "assertive" as const,
        }
      : {
          role: "status" as const,
          "aria-live": "polite" as const,
        };

  const { label, icon } = TOAST_COPY[variant];

  return (
    <div
      className={`toast-notification toast-notification--${variant}`}
      aria-atomic="true"
      {...semantics}
    >
      <div className="toast-notification__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="toast-notification__content">
        <p className="toast-notification__eyebrow">{label}</p>
        <p className="toast-notification__message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-notification__close"
        onClick={onClose}
        aria-label={`Dismiss ${label.toLowerCase()} notification`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
