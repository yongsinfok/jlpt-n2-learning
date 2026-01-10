/**
 * 按钮组件
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否全宽 */
  fullWidth?: boolean;
}

/**
 * 按钮样式映射
 */
const variantStyles = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  success: 'bg-success hover:bg-emerald-600 text-white shadow-md hover:shadow-lg',
  warning: 'bg-warning hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
  error: 'bg-error hover:bg-red-600 text-white shadow-md hover:shadow-lg',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

/**
 * 按钮组件
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      fullWidth = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-medium rounded-lg transition-colors duration-200';
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${widthStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
