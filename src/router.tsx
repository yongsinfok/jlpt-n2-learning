import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import { ROUTES } from '@/utils/constants';
import { initDatabase } from '@/db/schema';
import { loadCSVData } from '@/utils/csvParser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary, PageLoading } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { PWABanner } from '@/components/common/PWABanner';

const HomeHub = lazy(() => import('@/pages/HomeHub').then(m => ({ default: m.HomeHub })));
const LearnSession = lazy(() => import('@/pages/LearnSession').then(m => ({ default: m.LearnSession })));
const PracticeHub = lazy(() => import('@/pages/PracticeHub').then(m => ({ default: m.PracticeHub })));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

function LazyPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (isInitialized) return;
      try {
        await initDatabase();
        await loadCSVData();
        if (cancelled) return;
        // Skip onboarding for now — go straight to home
        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : '未知错误');
        setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" text="正在加载..." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surface border-4 border-border p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-ink mb-2">加载失败</h2>
          <p className="text-ink-soft mb-6">{loadError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-accent text-white rounded-lg">
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <PWABanner />
      <Header />
      <main className="flex-1 has-tab-bar">{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-ink mb-4">404</div>
        <p className="text-ink-soft mb-6">页面未找到</p>
        <a href="/" className="px-6 py-2 bg-accent text-white rounded-lg">返回首页</a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout><Outlet /></RootLayout>,
    children: [
      {
        path: ROUTES.HOME,
        element: <LazyPageWrapper><LayoutWrapper><HomeHub /></LayoutWrapper></LazyPageWrapper>,
      },
      {
        path: ROUTES.LEARN,
        element: <LazyPageWrapper><LayoutWrapper><LearnSession /></LayoutWrapper></LazyPageWrapper>,
      },
      {
        path: ROUTES.PRACTICE,
        element: <LazyPageWrapper><LayoutWrapper><PracticeHub /></LayoutWrapper></LazyPageWrapper>,
      },
      {
        path: ROUTES.ACHIEVEMENTS,
        element: <LazyPageWrapper><LayoutWrapper><AchievementsPage /></LayoutWrapper></LazyPageWrapper>,
      },
      {
        path: ROUTES.SETTINGS,
        element: <LazyPageWrapper><LayoutWrapper><SettingsPage /></LayoutWrapper></LazyPageWrapper>,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
