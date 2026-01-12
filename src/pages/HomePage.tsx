/**
 * 首页 - Modern Japanese Design
 * 玻璃态 + 黏土态风格
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, ArrowRight, Clock, Award, Sparkles } from 'lucide-react';

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
      {/* Hero Section - Modern */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ai-50/80 via-white/60 to-matcha-50/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-2xl border border-ai-100 shadow-washi-sm text-sm text-ai-700 mb-8 animate-fade-in">
              <Sparkles size={16} className="text-kincha-500" />
              <span className="font-medium">JLPT N2 语法学习平台</span>
            </div>

            {/* Greeting */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-sumi-900 mb-6 tracking-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
              {userProgress ? (
                <>
                  おかえりなさい
                  <span className="text-ai-DEFAULT">。</span>
                </>
              ) : (
                <>
                  ようこそ
                  <span className="text-ai-DEFAULT">。</span>
                </>
              )}
            </h1>

            <p className="text-xl text-sumi-600 mb-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
              {userProgress ? '欢迎回来继续你的学习之旅' : '开始系统学习 N2 语法'}
            </p>

            <p className="text-sumi-500 mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
              一歩一歩、着実に日本語を身につけましょう
            </p>

            {/* Study streak */}
            {userProgress && userProgress.studyStreak > 0 && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-kincha-100 to-kincha-50 rounded-2xl border border-kincha-200 shadow-washi-sm mb-8 animate-scale-in" style={{ animationDelay: '400ms' }}>
                <Flame className="w-5 h-5 text-kincha-DEFAULT" />
                <span className="font-medium text-kincha-700">
                  连续学习 <span className="font-bold text-kincha-600">{userProgress.studyStreak}</span> 天
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <Link
                to={getContinueLearningLink()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-ai-600 to-ai-500 hover:from-ai-700 hover:to-ai-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <Play size={20} />
                继续学习
              </Link>
              {reviewItems.length > 0 && (
                <Link
                  to="/review"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur hover:bg-white text-sumi-700 font-semibold rounded-2xl border border-shu-200 hover:border-shu-300 shadow-washi hover:shadow-washi-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Target size={20} className="text-shu-DEFAULT" />
                  <span>复习 {reviewItems.length} 项</span>
                </Link>
              )}
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur hover:bg-white text-sumi-700 font-semibold rounded-2xl border border-ai-200 hover:border-ai-300 shadow-washi hover:shadow-washi-md transition-all duration-200 hover:-translate-y-0.5"
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
            {/* Daily Goal Card */}
            {dailyGoal && (
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-ai-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-matcha-100 to-matcha-50 rounded-2xl shadow-washi-sm">
                      <Target className="w-6 h-6 text-matcha-DEFAULT" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sumi-900">每日目标</h3>
                      <p className="text-sm text-sumi-400">今日の目標</p>
                    </div>
                  </div>
                  {dailyGoal.isCompleted && (
                    <span className="px-4 py-2 bg-matcha-100 text-matcha-700 text-sm font-semibold rounded-full">
                      ✓ 已完成
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sentences Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sumi-600 font-medium">例句</span>
                      <span className="font-bold text-sumi-900">
                        {dailyGoal.completedSentences} / {dailyGoal.targetSentences}
                      </span>
                    </div>
                    <div className="h-3 bg-sumi-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-ai-500 to-ai-400 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{
                          width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Grammar Points Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sumi-600 font-medium">语法点</span>
                      <span className="font-bold text-sumi-900">
                        {dailyGoal.completedGrammarPoints} / {dailyGoal.targetGrammarPoints}
                      </span>
                    </div>
                    <div className="h-3 bg-sumi-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-matcha-DEFAULT to-matcha-400 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{
                          width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Reminder */}
            {settings?.showReviewReminderOnHome && reviewItems.length > 0 && (
              <div className="bg-gradient-to-br from-shu-50 to-white/90 backdrop-blur rounded-3xl shadow-washi border border-shu-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-shu-100 rounded-2xl shadow-washi-sm">
                        <Clock className="w-6 h-6 text-shu-DEFAULT" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sumi-900">复习提醒</h3>
                        <p className="text-sm text-sumi-400">復習リマインダー</p>
                      </div>
                    </div>
                    <p className="text-sumi-600 mb-1">
                      有 <span className="font-bold text-shu-DEFAULT">{reviewItems.length}</span> 个语法点需要复习
                    </p>
                    <p className="text-sm text-sumi-400">
                      预计用时约 {Math.ceil(reviewItems.length * 3)} 分钟
                    </p>
                  </div>
                  <Link
                    to="/review"
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-shu-DEFAULT to-shu-600 hover:from-shu-600 hover:to-shu-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-washi hover:shadow-washi-md"
                  >
                    立即复习
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            {/* Overall Progress Card */}
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-ai-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-ai-100 to-ai-50 rounded-2xl shadow-washi-sm">
                  <TrendingUp className="w-6 h-6 text-ai-DEFAULT" />
                </div>
                <div>
                  <h3 className="font-bold text-sumi-900">总体进度</h3>
                  <p className="text-sm text-sumi-400">全体の進度</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Lessons Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600 font-medium">已完成课程</span>
                    <span className="font-bold text-ai-DEFAULT">{Math.round(overallProgress.lessons)}%</span>
                  </div>
                  <div className="h-3 bg-sumi-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ai-DEFAULT to-ai-400 rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600 font-medium">已学习语法点</span>
                    <span className="font-bold text-matcha-DEFAULT">{Math.round(overallProgress.grammar)}%</span>
                  </div>
                  <div className="h-3 bg-sumi-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-matcha-DEFAULT to-matcha-400 rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600 font-medium">已学习例句</span>
                    <span className="font-bold text-kincha-DEFAULT">{Math.round(overallProgress.sentences)}%</span>
                  </div>
                  <div className="h-3 bg-sumi-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-kincha-DEFAULT to-kincha-400 rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/progress"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-ai-50 hover:bg-ai-100 text-ai-DEFAULT font-semibold rounded-2xl transition-all duration-200"
              >
                查看详细统计
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column - Quick Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-ai-100/50 p-6 sticky top-24">
              <h3 className="font-bold text-sumi-900 mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-ai-DEFAULT" />
                快速开始
              </h3>

              <div className="space-y-3">
                <Link
                  to={getContinueLearningLink()}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-ai-50 to-white border border-ai-100 rounded-2xl hover:shadow-washi-md hover:border-ai-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-ai-DEFAULT" />
                    <span className="font-semibold text-sumi-900">继续学习</span>
                  </div>
                  <ArrowRight size={18} className="text-sumi-300 group-hover:text-ai-DEFAULT group-hover:translate-x-1 transition-all" />
                </Link>

                {reviewItems.length > 0 && (
                  <Link
                    to="/review"
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-shu-50 to-white border border-shu-100 rounded-2xl hover:shadow-washi-md hover:border-shu-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-shu-DEFAULT" />
                      <div>
                        <span className="font-semibold text-sumi-900">开始复习</span>
                        <span className="text-xs text-sumi-400 ml-2">({reviewItems.length})</span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-sumi-300 group-hover:text-shu-DEFAULT group-hover:translate-x-1 transition-all" />
                  </Link>
                )}

                <Link
                  to="/practice"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-matcha-50 to-white border border-matcha-100 rounded-2xl hover:shadow-washi-md hover:border-matcha-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-matcha-DEFAULT" />
                    <span className="font-semibold text-sumi-900">练习模式</span>
                  </div>
                  <ArrowRight size={18} className="text-sumi-300 group-hover:text-matcha-DEFAULT group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/lessons"
                  className="group flex items-center justify-between p-4 bg-sumi-50 border border-sumi-100 rounded-2xl hover:shadow-washi-md hover:border-sumi-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-sumi-DEFAULT" />
                    <span className="font-semibold text-sumi-900">课程列表</span>
                  </div>
                  <ArrowRight size={18} className="text-sumi-300 group-hover:text-sumi-DEFAULT group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
