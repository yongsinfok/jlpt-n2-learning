/**
 * 进度条组件
 */

import { cn } from '@/utils/cn';

export interface ProgressBarProps {
  /** 进度值 (0-100) */
  progress: number;
  /** 是否显示百分比文本 */
  showLabel?: boolean;
  /** 进度条高度 */
  size?: 'sm' | 'md' | 'lg';
  /** 颜色变体 */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** 自定义类名 */
  className?: string;
}

/**
 * 进度条样式映射
 */
const sizeStyles = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
} as const;

const variantStyles = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
} as const;

/**
 * 进度条组件
 */
export function ProgressBar({
  progress,
  showLabel = false,
  size = 'md',
  variant = 'primary',
  className = '',
}: ProgressBarProps) {
  // 确保进度值在 0-100 之间
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const sizeClass = sizeStyles[size];
  const variantClass = variantStyles[variant];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2">
        <div className={cn('flex-1 bg-gray-200 rounded-full overflow-hidden', sizeClass)}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantClass
            )}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
    </div>
  );
}
