import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = '加载中...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center shadow-lg">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          </div>
        </div>

        <p className="text-ink font-medium">{message}</p>
        <p className="text-ink-mute text-sm mt-1">请稍候</p>

        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface/90 backdrop-blur rounded-3xl shadow-lg border border-border p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-surface-dim rounded-2xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-surface-dim rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-surface-dim/60 rounded-lg w-2/3 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-surface-dim/60 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-surface-dim/60 rounded-lg w-5/6 animate-pulse" />
        <div className="h-4 bg-surface-dim/60 rounded-lg w-4/6 animate-pulse" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-12 bg-surface-dim rounded-2xl flex-1 animate-pulse" />
        <div className="h-12 bg-surface-dim rounded-2xl flex-1 animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
