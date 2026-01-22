/**
 * LoadingSpinner Component - Animated Loading Indicator
 */

import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Optional text to display */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Custom className */
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary`}
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-neutral-dark font-medium animate-fade-in`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
        {spinner}
      </div>
    );
  }

  return spinner;
}
