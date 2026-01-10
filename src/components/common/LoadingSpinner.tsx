/**
 * 加载动画组件
 */

import { cn } from '@/utils/cn';

export interface LoadingSpinnerProps {
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 颜色 */
  color?: 'primary' | 'white' | 'gray';
  /** 是否全屏显示 */
  fullScreen?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 加载文本 */
  text?: string;
}

/**
 * 大小样式映射
 */
const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
} as const;

/**
 * 颜色样式映射
 */
const colorStyles = {
  primary: 'border-primary border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
} as const;

/**
 * 加载动画组件
 */
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  className = '',
  text,
}: LoadingSpinnerProps) {
  const sizeClass = sizeStyles[size];
  const colorClass = colorStyles[color];

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClass,
          colorClass
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
