/**
 * 首页 - Modern Japanese Editorial Style
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, Award, ArrowRight, Zap, Clock } from 'lucide-react';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

export function HomePage() {
  const { userProgress, settings, setUserProgress, setDailyGoal, dailyGoal } = useUserStore();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);

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
          lessonNumber: 1,
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
  };

  // 获取继续学习的链接
  const getContinueLearningLink = () => {
    if (userProgress?.currentLessonId) {
      return `/lesson/${userProgress.currentLessonId}`;
    }
    return '/lessons';
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
    <div className="min-h-screen washi-bg">
      {/* Hero Section - Modern Japanese Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-ai-50 via-white to-matcha-50/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            {/* Greeting */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border border-ai-100 text-sm text-ai-700 mb-6">
                <Zap size={14} className="text-kincha-500" />
                <span className="font-medium">JLPT N2 语法学习</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                {userProgress ? (
                  <>
                    おかえりなさい<span className="text-ai-600">。</span>
                  </>
                ) : (
                  <>
                    ようこそ<span className="text-ai-600">。</span>
                  </>
                )}
              </h1>

              <p className="text-xl text-gray-600 mb-2">
                {userProgress ? '欢迎回来继续你的学习之旅' : '开始系统学习 N2 语法'}
              </p>

              {userProgress && userProgress.studyStreak > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-kincha-100 to-kincha-50 rounded-full border border-kincha-200 mt-4">
                  <Flame className="w-5 h-5 text-kincha-500" />
                  <span className="font-medium text-kincha-700">
                    连续学习 <span className="font-bold text-kincha-600">{userProgress.studyStreak}</span> 天
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={getContinueLearningLink()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ai-600 hover:bg-ai-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Play size={18} />
                继续学习
              </Link>
              {reviewItems.length > 0 && (
                <Link
                  to="/review"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Target size={18} className="text-shu-500" />
                  <span>复习 {reviewItems.length} 项</span>
                </Link>
              )}
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"
              >
                练习模式
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Daily Goal Card - Modern Design */}
            {dailyGoal && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-matcha-100 to-matcha-50 rounded-xl">
                      <Target className="w-5 h-5 text-matcha-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">每日目标</h3>
                      <p className="text-sm text-gray-500">今日の目標</p>
                    </div>
                  </div>
                  {dailyGoal.isCompleted && (
                    <span className="px-3 py-1.5 bg-matcha-100 text-matcha-700 text-sm font-medium rounded-full">
                      ✓ 已完成
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sentences Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">例句</span>
                      <span className="font-medium text-gray-900">
                        {dailyGoal.completedSentences} / {dailyGoal.targetSentences}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-ai-500 to-ai-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Grammar Points Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">语法点</span>
                      <span className="font-medium text-gray-900">
                        {dailyGoal.completedGrammarPoints} / {dailyGoal.targetGrammarPoints}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-matcha-500 to-matcha-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Reminder */}
            {settings?.showReviewReminderOnHome && reviewItems.length > 0 && (
              <div className="bg-gradient-to-br from-shu-50 to-white rounded-2xl shadow-sm border border-shu-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-shu-100 rounded-xl">
                        <Clock className="w-5 h-5 text-shu-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">复习提醒</h3>
                        <p className="text-sm text-gray-500">復習リマインダー</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      有 <span className="font-bold text-shu-600">{reviewItems.length}</span> 个语法点需要复习
                    </p>
                    <p className="text-sm text-gray-500">
                      预计用时约 {Math.ceil(reviewItems.length * 3)} 分钟
                    </p>
                  </div>
                  <Link
                    to="/review"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-shu-600 hover:bg-shu-700 text-white font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  >
                    立即复习
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Overall Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-ai-100 to-ai-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-ai-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">总体进度</h3>
                  <p className="text-sm text-gray-500">全体の進度</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Lessons Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">已完成课程</span>
                    <span className="font-semibold text-ai-600">{Math.round(overallProgress.lessons)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ai-500 to-ai-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">已学习语法点</span>
                    <span className="font-semibold text-matcha-600">{Math.round(overallProgress.grammar)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-matcha-500 to-matcha-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">已学习例句</span>
                    <span className="font-semibold text-kincha-600">{Math.round(overallProgress.sentences)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-kincha-500 to-kincha-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <Link
                to="/progress"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-200"
              >
                查看详细统计
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column - Quick Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">快速开始</h3>

              <div className="space-y-3">
                <Link
                  to={getContinueLearningLink()}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-ai-50 to-white border border-ai-100 rounded-xl hover:shadow-md hover:border-ai-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-ai-600" />
                    <span className="font-medium text-gray-900">继续学习</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-ai-600 group-hover:translate-x-1 transition-all" />
                </Link>

                {reviewItems.length > 0 && (
                  <Link
                    to="/review"
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-shu-50 to-white border border-shu-100 rounded-xl hover:shadow-md hover:border-shu-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-shu-600" />
                      <div>
                        <span className="font-medium text-gray-900">开始复习</span>
                        <span className="text-xs text-gray-500 ml-2">({reviewItems.length})</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-shu-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}

                <Link
                  to="/practice"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-matcha-50 to-white border border-matcha-100 rounded-xl hover:shadow-md hover:border-matcha-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-matcha-600" />
                    <span className="font-medium text-gray-900">练习模式</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-matcha-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/lessons"
                  className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">课程列表</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
