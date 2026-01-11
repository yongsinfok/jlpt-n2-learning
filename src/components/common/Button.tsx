/**
 * 按钮组件 - Japanese Stamp Style
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'stamp';
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否全宽 */
  fullWidth?: boolean;
}

/**
 * 按钮组件 - Japanese Stamp Style
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    className = '',
    children,
    ...rest
  } = props;

  // Base styles
  const baseStyles = 'font-medium rounded-lg transition-all duration-300 relative overflow-hidden';

  // Variant styles - Japanese Color Palette
  const variantStyles = {
    primary: 'bg-ai-DEFAULT hover:bg-ai-600 text-white shadow-washi hover:shadow-washi-md hover:-translate-y-0.5',
    secondary: 'bg-matcha-DEFAULT hover:bg-matcha-600 text-white shadow-washi hover:shadow-washi-md hover:-translate-y-0.5',
    success: 'bg-matcha-DEFAULT hover:bg-matcha-600 text-white shadow-washi hover:shadow-washi-md hover:-translate-y-0.5',
    warning: 'bg-kincha-DEFAULT hover:bg-kincha-600 text-white shadow-washi hover:shadow-washi-md hover:-translate-y-0.5',
    error: 'bg-shu-DEFAULT hover:bg-shu-600 text-white shadow-washi hover:shadow-washi-md hover:-translate-y-0.5',
    ghost: 'bg-transparent hover:bg-ai-50 text-sumi-600 hover:text-ai-DEFAULT',
    stamp: 'bg-transparent border-2 border-shu-DEFAULT text-shu-DEFAULT hover:bg-shu-DEFAULT hover:text-white shadow-stamp',
  };

  const variantClass = variantStyles[variant] || variantStyles.primary;

  // Size styles
  const sizeStylesMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const sizeClass = sizeStylesMap[size] || sizeStylesMap.md;

  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'ink-drop-effect';

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthStyles} ${className} ${disabledClass}`}
      {...rest}
    >
      {/* Shimmer effect for primary variants */}
      {(variant === 'primary' || variant === 'secondary' || variant === 'success') && !disabled && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      )}

      {/* Stamp texture for stamp variant */}
      {variant === 'stamp' && (
        <span className="absolute inset-0 opacity-20 stamp-texture" />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
