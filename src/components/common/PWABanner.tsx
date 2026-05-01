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
        <div className="pwa-banner pwa-banner-update">
          <RefreshCw size={14} className="text-bengara" />
          <span>新版本已下载</span>
          <button onClick={() => updateReady()} className="pwa-banner-action">
            重启更新
          </button>
        </div>
      );
    }
    return null;
  }

  if (dismissed) return null;

  if (promptInstall) {
    return (
      <div className="pwa-banner">
        <Download size={14} className="text-sumi-soft" />
        <span className="pwa-banner-text">添加到主屏幕，离线学习</span>
        <button onClick={() => promptInstall()} className="pwa-banner-action">
          安装
        </button>
        <button
          onClick={() => { localStorage.setItem(DISMISS_KEY, String(Date.now())); setDismissed(true); }}
          className="pwa-banner-close"
          aria-label="关闭"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  if (showIosHint) {
    return (
      <div className="pwa-banner">
        <span className="pwa-banner-text inline-flex items-center gap-1.5">
          安装到主屏幕：点击 <Share size={13} className="inline" /> 分享，再选 <Plus size={13} className="inline" /> 添加到主屏幕
        </span>
        <button
          onClick={() => { localStorage.setItem(DISMISS_KEY, String(Date.now())); setDismissed(true); }}
          className="pwa-banner-close"
          aria-label="关闭"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return null;
}
