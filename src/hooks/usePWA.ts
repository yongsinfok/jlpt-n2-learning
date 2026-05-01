import { useEffect, useState, useCallback } from 'react';
import { registerSW } from 'virtual:pwa-register';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;

const isInStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export interface PWAState {
  /** True when running as an installed PWA (any platform). */
  installed: boolean;
  /** True on iOS devices not yet running standalone — show iOS-specific install hint. */
  showIosHint: boolean;
  /** Browser-supplied install prompt (Chrome/Edge/Android); null until fired. */
  promptInstall: (() => Promise<void>) | null;
  /** A new SW version is ready; calling this reloads with updated assets. */
  updateReady: (() => Promise<void>) | null;
  /** True after first network reachable check found offline. */
  offline: boolean;
}

export function usePWA(): PWAState {
  const [installed, setInstalled] = useState(isInStandalone());
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateFn, setUpdateFn] = useState<(() => Promise<void>) | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const updater = registerSW({
      immediate: true,
      onNeedRefresh() {
        setUpdateFn(() => async () => { await updater(true); });
      },
    });
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }, [installEvent]);

  return {
    installed,
    showIosHint: !installed && isIOS() && !installEvent,
    promptInstall: installEvent ? promptInstall : null,
    updateReady: updateFn,
    offline,
  };
}
