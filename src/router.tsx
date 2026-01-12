/**
 * 路由配置
 */

import { createBrowserRouter, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/utils/constants';
import { useUserStore } from '@/stores/userStore';
import { initDatabase } from '@/db/schema';
import { loadCSVData } from '@/utils/csvParser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// 布局组件
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// 页面组件（占位）
import { HomePage } from '@/pages/HomePage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { LessonListPage } from '@/pages/LessonListPage';
import { LessonDetailPage } from '@/pages/LessonDetailPage';
import { StudyPage } from '@/pages/StudyPage';
import { GrammarDetailPage } from '@/pages/GrammarDetailPage';
import { PracticePage } from '@/pages/PracticePage';
import { QuizPage } from '@/pages/QuizPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { WrongAnswersPage } from '@/pages/WrongAnswersPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { SettingsPage } from '@/pages/SettingsPage';

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
      // 防止重复初始化
      if (isInitialized) return;

      try {
        // 1. 初始化数据库
        await initDatabase();

        // 2. 加载 CSV 数据（内部已有重复检查）
        await loadCSVData();

        // 检查是否被取消（组件卸载或重新渲染）
        if (isCancelled) return;

        // 3. 检查是否首次访问
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
    };

    initializeApp();

    // 清理函数：取消未完成的初始化
    return () => {
      isCancelled = true;
    };
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 处理首次访问重定向
  useEffect(() => {
    if (shouldRedirect && isInitialized) {
      navigate(shouldRedirect);
      setShouldRedirect(null);
    }
  }, [shouldRedirect, isInitialized, navigate]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="正在加载学习数据..." />
      </div>
    );
  }

  // 加载错误
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 应用就绪，渲染子组件
  return <>{children}</>;
}

/**
 * 布局包装器
 */
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * 路由配置
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout><Outlet /></RootLayout>,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <LayoutWrapper>
            <HomePage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.ONBOARDING,
        element: (
          <LayoutWrapper>
            <OnboardingPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.LESSONS,
        element: (
          <LayoutWrapper>
            <LessonListPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.LESSON_DETAIL,
        element: (
          <LayoutWrapper>
            <LessonDetailPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.STUDY,
        element: (
          <LayoutWrapper>
            <StudyPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.GRAMMAR_DETAIL,
        element: (
          <LayoutWrapper>
            <GrammarDetailPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.PRACTICE,
        element: (
          <LayoutWrapper>
            <PracticePage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.QUIZ,
        element: (
          <LayoutWrapper>
            <QuizPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.REVIEW,
        element: (
          <LayoutWrapper>
            <ReviewPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.PROGRESS,
        element: (
          <LayoutWrapper>
            <ProgressPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.WRONG_ANSWERS,
        element: (
          <LayoutWrapper>
            <WrongAnswersPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.ACHIEVEMENTS,
        element: (
          <LayoutWrapper>
            <AchievementsPage />
          </LayoutWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <LayoutWrapper>
            <SettingsPage />
          </LayoutWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <LayoutWrapper>
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600 mt-2">页面未找到</p>
            </div>
          </LayoutWrapper>
        ),
      },
    ],
  },
]);
