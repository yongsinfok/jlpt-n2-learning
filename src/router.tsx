/**
 * 路由配置
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

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
]);

/**
 * 路由提供者组件
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}
