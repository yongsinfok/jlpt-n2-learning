import { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { X, Share, Plus, Download, RefreshCw } from 'lucide-react';

const DISMISS_KEY = 'n2_pwa_install_dismissed_at';
const DISMISS_TTL_DAYS = 14;

function wasRecentlyDismissed() {
  const ts = Number(localStorage.getItem(DISMISS_KEY));
  if (!ts) return false;
  return Date.now() - ts < DISMISS_TTL_DAYS * 24 * 60 * 60 * 1000;
}

export function PWABanner() {
  const { installed, showIosHint, promptInstall, updateReady } = usePWA();
  const [dismissed, setDismissed] = useState(wasRecentlyDismissed());

  useEffect(() => {
    if (updateReady) setDismissed(false);
  }, [updateReady]);

  if (installed) {
    if (updateReady) {
      return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-border text-sm text-ink-soft sticky top-0 z-50">
          <RefreshCw size={14} className="text-accent" />
          <span className="flex-1">新版本已下載</span>
          <button onClick={() => updateReady()} className="text-accent font-medium hover:text-accent-hover border-b border-accent">重啟更新</button>
        </div>
      );
    }
    return null;
  }

  if (dismissed) return null;

  if (promptInstall) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-border text-sm text-ink-soft sticky top-0 z-50">
        <Download size={14} className="text-ink-mute" />
        <span className="flex-1">添加到主屏幕，離線學習</span>
        <button onClick={() => promptInstall()} className="text-accent font-medium hover:text-accent-hover border-b border-accent">安裝</button>
        <button onClick={() => { localStorage.setItem(DISMISS_KEY, String(Date.now())); setDismissed(true); }} className="text-ink-faint hover:text-ink transition-colors" aria-label="關閉">
          <X size={14} />
        </button>
      </div>
    );
  }

  if (showIosHint) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-border text-sm text-ink-soft sticky top-0 z-50">
        <span className="flex-1">
          安裝到主屏幕：點擊 <Share size={13} className="inline" /> 分享，再選 <Plus size={13} className="inline" /> 添加到主屏幕
        </span>
        <button onClick={() => { localStorage.setItem(DISMISS_KEY, String(Date.now())); setDismissed(true); }} className="text-ink-faint hover:text-ink transition-colors" aria-label="關閉">
          <X size={14} />
        </button>
      </div>
    );
  }

  return null;
}
