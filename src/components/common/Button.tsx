/**
 * Button Component - Modern Clean Design with Animations
 */

import { ButtonHTMLAttributes, forwardRef, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'asChild'> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Is disabled */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Render as child element (e.g., Link) */
  asChild?: boolean;
  /** Show loading state */
  loading?: boolean;
}

/**
 * Button Component - Modern Clean Design
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    asChild = false,
    loading = false,
    className = '',
    children,
    ...rest
  } = props;

  // Base styles
  const baseStyles = 'btn font-display';

  // Variant styles
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
  };

  // Size styles
  const sizeStyles = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || '';
  const widthStyles = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${variantClass} ${sizeClass} ${widthStyles} ${className}`;

  // If asChild is true and children is a ReactElement (like Link), clone it with button styles
  if (asChild) {
    const child = children as ReactElement;
    return (
      <child.type
        {...child.props}
        {...rest}
        disabled={disabled || loading}
        className={`${combinedClassName} ${child.props.className || ''}`}
        ref={ref as any}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          child.props.children
        )}
      </child.type>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={combinedClassName}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * Icon Button Component
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display */
  icon: React.ReactNode;
  /** Is active */
  active?: boolean;
  /** Tooltip text */
  label?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, active = false, label, className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`btn-icon ${active ? 'text-accent' : ''} ${className}`}
      aria-label={label}
      aria-pressed={active}
      {...rest}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * Heart Button Component
 */
export interface HeartButtonProps {
  /** Is favorited */
  active?: boolean;
  /** On toggle */
  onToggle?: () => void;
  /** Label */
  label?: string;
}

export function HeartButton({ active = false, onToggle, label = 'Add to favorites' }: HeartButtonProps) {
  return (
    <button
      className={`heart-btn ${active ? 'active' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={active}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
