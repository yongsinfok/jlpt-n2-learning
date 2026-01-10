/**
 * 应用根组件
 * 负责数据加载和全局状态初始化
 */

import { useEffect, useState } from 'react';
import { useUserStore } from './stores/userStore';
import { initDatabase } from './db/schema';
import { loadCSVData } from './utils/csvParser';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AppRouter } from './router';
import { ROUTES } from './utils/constants';
import { useNavigate } from 'react-router-dom';

/**
 * App 组件
 */
function App() {
  const navigate = useNavigate();
  const { isFirstVisit, markVisited } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        // 1. 初始化数据库
        await initDatabase();

        // 2. 加载 CSV 数据
        await loadCSVData();

        // 3. 检查是否首次访问
        if (isFirstVisit) {
          markVisited();
          navigate(ROUTES.ONBOARDING);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setLoadError(error instanceof Error ? error.message : '未知错误');
        setIsLoading(false);
      }
    }

    initializeApp();
  }, [isFirstVisit, markVisited, navigate]);

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

  // 应用就绪
  return <AppRouter />;
}

export default App;
