/**
 * Page Loading Component
 * Skeleton screen for lazy-loaded pages
 */

import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  message?: string;
}

/**
 * Page Loading Component
 * Displayed during lazy-loaded page transitions
 */
export function PageLoading({ message = '加载中...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen washi-bg flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated loading icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-ai-100 rounded-full animate-ping" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-ai-50 to-ai-100 rounded-full flex items-center justify-center shadow-washi">
              <Loader2 className="w-8 h-8 text-ai-DEFAULT animate-spin" />
            </div>
          </div>
        </div>

        {/* Loading message */}
        <p className="text-sumi-600 font-medium">{message}</p>
        <p className="text-sumi-400 text-sm mt-1">请稍候</p>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-ai-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-ai-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-ai-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Card Component
 * For content placeholder during loading
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-sumi-100 p-6 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-sumi-100 rounded-2xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-sumi-100 rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-sumi-50 rounded-lg w-2/3 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-sumi-50 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-sumi-50 rounded-lg w-5/6 animate-pulse" />
        <div className="h-4 bg-sumi-50 rounded-lg w-4/6 animate-pulse" />
      </div>

      {/* Action skeleton */}
      <div className="mt-6 flex gap-3">
        <div className="h-12 bg-sumi-100 rounded-2xl flex-1 animate-pulse" />
        <div className="h-12 bg-sumi-100 rounded-2xl flex-1 animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Skeleton List Component
 * For list placeholders during loading
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
