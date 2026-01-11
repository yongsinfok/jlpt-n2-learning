/**
 * 首页 - 学习建议和快速入口
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { getWeekDates } from '@/utils/dateHelper';
import { StudyStreak } from '@/components/progress/StudyStreak';
import { DailyGoal } from '@/components/progress/DailyGoal';
import { ReviewReminder } from '@/components/progress/ReviewReminder';
import { BookOpen, TrendingUp, Play } from 'lucide-react';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const { userProgress, settings, setUserProgress, setDailyGoal, dailyGoal } = useUserStore();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{ date: Date; grammarCount: number; isToday: boolean }>>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // 加载用户进度
    const progress = await getUserProgress();
    if (progress) {
      setUserProgress(progress);

      // 获取需要复习的项目
      const dueGrammarIds = getDueReviews(progress.learnedGrammar);
      const items: ReviewItem[] = dueGrammarIds.map((id) => {
        const learnedGrammar = progress.learnedGrammar.find((g) => g.grammarId === id);
        if (!learnedGrammar) {
          return {
            grammarId: id,
            grammarPoint: id,
            lessonNumber: 1,
            daysSinceReview: 0,
          };
        }

        const daysSinceReview = Math.floor(
          (Date.now() - new Date(learnedGrammar.nextReviewDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          grammarId: id,
          grammarPoint: id,
          lessonNumber: 1, // TODO: 从语法点表获取
          daysSinceReview,
        };
      });
      setReviewItems(items);
    }

    // 加载今日目标
    const todayGoal = await getTodayGoal();
    if (todayGoal) {
      setDailyGoal(todayGoal);
    }

    // 生成本周数据（占位，实际需要从数据库获取）
    const weekDates = getWeekDates();
    const today = new Date();
    setWeeklyData(
      weekDates.map((date) => ({
        date,
        grammarCount: 0, // TODO: 从数据库统计
        isToday: date.toDateString() === today.toDateString(),
      }))
    );
  };

  const handleContinueLearning = () => {
    if (userProgress?.currentLessonId) {
      navigate(`/lesson/${userProgress.currentLessonId}`);
    } else {
      navigate('/lessons');
    }
  };

  const handleStartReview = () => {
    navigate('/review');
  };

  const handleViewProgress = () => {
    navigate('/progress');
  };

  // 获取学习建议
  const getStudySuggestion = (): string | null => {
    if (!userProgress) return null;

    if (reviewItems.length > 0) {
      return `建议先复习 ${reviewItems.length} 个到期的语法点，巩固已学内容。`;
    }

    if (userProgress.currentLessonId) {
      return `继续学习课程 ${userProgress.currentLessonId}，每天进步一点点。`;
    }

    return '开始你的 N2 学习之旅吧！';
  };

  // 计算总体进度
  const getOverallProgress = () => {
    if (!userProgress) return { lessons: 0, grammar: 0, sentences: 0 };

    return {
      lessons: (userProgress.completedLessons.length / 50) * 100,
      grammar: (userProgress.learnedGrammar.length / 200) * 100,
      sentences: (userProgress.learnedSentences.length / 1000) * 100,
    };
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 欢迎标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {userProgress ? '欢迎回来！' : '欢迎来到 JLPT N2 学习平台'}
        </h1>
        <p className="text-gray-600">
          {userProgress ? '继续你的 N2 学习之旅' : '开始系统学习 N2 语法'}
        </p>
      </div>

      {/* 主要内容网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧列 - 占 2 列 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 连续学习天数 */}
          {userProgress && (
            <StudyStreak streak={userProgress.studyStreak} showDetails />
          )}

          {/* 今日学习建议 */}
          {getStudySuggestion() && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                今日学习建议
              </h2>
              <p className="text-gray-700">{getStudySuggestion()}</p>
              <button
                onClick={handleContinueLearning}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                开始学习
              </button>
            </div>
          )}

          {/* 复习提醒 */}
          {settings.showReviewReminderOnHome && reviewItems.length > 0 && (
            <ReviewReminder
              reviewItems={reviewItems}
              estimatedTime={Math.ceil(reviewItems.length * 3)}
              showDetails
            />
          )}

          {/* 今日目标 */}
          {dailyGoal && (
            <DailyGoal
              completedSentences={dailyGoal.completedSentences}
              targetSentences={dailyGoal.targetSentences}
              completedGrammarPoints={dailyGoal.completedGrammarPoints}
              targetGrammarPoints={dailyGoal.targetGrammarPoints}
              isCompleted={dailyGoal.isCompleted}
            />
          )}

          {/* 总体进度 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              总体进度
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">已完成课程</span>
                  <span className="font-medium text-gray-900">{Math.round(overallProgress.lessons)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">已学习语法点</span>
                  <span className="font-medium text-gray-900">{Math.round(overallProgress.grammar)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">已学习例句</span>
                  <span className="font-medium text-gray-900">{Math.round(overallProgress.sentences)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleViewProgress}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              查看详细统计
            </button>
          </div>
        </div>

        {/* 右侧列 - 快速操作 */}
        <div className="space-y-6">
          {/* 快速操作卡片 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">快速操作</h2>
            <div className="space-y-3">
              <button
                onClick={handleContinueLearning}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between group"
              >
                <span>继续学习</span>
                <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleStartReview}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between group"
              >
                <span>开始复习</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between group"
              >
                <span>练习模式</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => navigate('/lessons')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between group"
              >
                <span>课程列表</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* 待办提醒 */}
          {reviewItems.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">复习提醒</h3>
              <p className="text-sm text-amber-800">
                有 <strong>{reviewItems.length}</strong> 个语法点需要复习
              </p>
              <button
                onClick={handleStartReview}
                className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                立即复习
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
