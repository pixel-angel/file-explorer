import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function IconButton({
  children,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`icon-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}