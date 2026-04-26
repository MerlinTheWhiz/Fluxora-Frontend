import React from 'react';

export interface ValidationMessageProps {
  id: string;
  message: string;
  type: 'error' | 'hint' | 'success';
}

const ErrorIcon = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
    <path d="M6 3.5V6.5" stroke="currentColor" strokeLinecap="round" />
    <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
  </svg>
);

const SuccessIcon = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
    <path d="M3.5 6L5.5 8L8.5 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const roleMap: Record<ValidationMessageProps['type'], string | undefined> = {
  error: 'alert',
  hint: 'status',
  success: undefined,
};

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ id, message, type }) => {
  const role = roleMap[type];

  return (
    <span
      id={id}
      className={`validation-message validation-message--${type}`}
      {...(role ? { role } : {})}
      style={{ font: 'var(--font-body-sm)' }}
    >
      {type === 'error' && <ErrorIcon />}
      {type === 'success' && <SuccessIcon />}
      {message}
    </span>
  );
};

export default ValidationMessage;
