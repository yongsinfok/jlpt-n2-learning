/**
 * 路由配置 - BRUTALIST DESIGN SYSTEM
 * Raw. Unpolished. High Contrast.
 */

import { createBrowserRouter, useNavigate, Outlet } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import { ROUTES } from '@/utils/constants';
import { useUserStore } from '@/stores/userStore';
import { initDatabase } from '@/db/schema';
import { loadCSVData } from '@/utils/csvParser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary, PageLoading } from '@/components/common';

// 布局组件
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// 懒加载页面组件 - 代码分割
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const LessonListPage = lazy(() => import('@/pages/LessonListPage').then(m => ({ default: m.LessonListPage })));
const LessonDetailPage = lazy(() => import('@/pages/LessonDetailPage').then(m => ({ default: m.LessonDetailPage })));
const StudyPage = lazy(() => import('@/pages/StudyPage').then(m => ({ default: m.StudyPage })));
const GrammarDetailPage = lazy(() => import('@/pages/GrammarDetailPage').then(m => ({ default: m.GrammarDetailPage })));
const PracticePage = lazy(() => import('@/pages/PracticePage').then(m => ({ default: m.PracticePage })));
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const ReviewPage = lazy(() => import('@/pages/ReviewPage').then(m => ({ default: m.ReviewPage })));
const ProgressPage = lazy(() => import('@/pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const WrongAnswersPage = lazy(() => import('@/pages/WrongAnswersPage').then(m => ({ default: m.WrongAnswersPage })));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

/**
 * 懒加载页面包装器
 */
interface LazyPageWrapperProps {
  children: React.ReactNode;
}

function LazyPageWrapper({ children }: LazyPageWrapperProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * 根布局组件 - 负责应用初始化
 */
function RootLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isFirstVisit, markVisited } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function initializeApp() {
      if (isInitialized) return;

      try {
        await initDatabase();
        await loadCSVData();

        if (isCancelled) return;

        if (isFirstVisit) {
          markVisited();
          setShouldRedirect(ROUTES.ONBOARDING);
        }

        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        if (isCancelled) return;
        console.error('Failed to initialize app:', error);
        setLoadError(error instanceof Error ? error.message : '未知错误');
        setIsLoading(false);
      }
    }

    initializeApp();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (shouldRedirect && isInitialized) {
      navigate(shouldRedirect);
      setShouldRedirect(null);
    }
  }, [shouldRedirect, isInitialized, navigate]);

  // Loading State - Brutalist
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="正在加载学习数据..." />
      </div>
    );
  }

  // Error State - Brutalist
  if (loadError) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 max-w-md w-full text-center">
            <div className="p-4 bg-black text-white w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-black uppercase mb-2">加载失败</h2>
            <p className="text-gray-700 mb-6">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-brutalist-primary"
            >
              重新加载
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return <>{children}</>;
}

/**
 * 布局包装器 - Brutalist
 */
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * 404 页面 - Brutalist
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 max-w-md w-full text-center">
        <div className="text-6xl font-display font-bold text-black mb-4">404</div>
        <h1 className="text-2xl font-bold text-black uppercase mb-2">页面未找到</h1>
        <p className="text-gray-700 mb-6">抱歉，您访问的页面不存在</p>
        <a
          href="/"
          className="btn-brutalist-primary"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}

/**
 * 路由配置 - Brutalist Design
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout><Outlet /></RootLayout>,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <HomePage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.ONBOARDING,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <OnboardingPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.LESSONS,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <LessonListPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.LESSON_DETAIL,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <LessonDetailPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.STUDY,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <StudyPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.GRAMMAR_DETAIL,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <GrammarDetailPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.PRACTICE,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <PracticePage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.QUIZ,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <QuizPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.REVIEW,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <ReviewPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.PROGRESS,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <ProgressPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.WRONG_ANSWERS,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <WrongAnswersPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.ACHIEVEMENTS,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <AchievementsPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <LazyPageWrapper>
            <LayoutWrapper>
              <SettingsPage />
            </LayoutWrapper>
          </LazyPageWrapper>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
