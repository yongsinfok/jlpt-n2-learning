/**
 * 首页 - Modern Japanese Design
 * Refined Washi Paper Aesthetic
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
    <div className="min-h-screen bg-washi-texture">
      {/* Hero Section - Clean & Trustworthy */}
      <div className="relative overflow-hidden border-b border-sumi-200 bg-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            {/* Greeting */}
            <h1 className="text-6xl font-bold text-sumi-900 mb-6 tracking-tight animate-fade-in text-ai-700">
              {userProgress ? (
                <>
                  おかえりなさい<span className="text-ai-400">。</span>
                </>
              ) : (
                <>
                  ようこそ<span className="text-ai-400">。</span>
                </>
              )}
            </h1>

            <p className="text-xl text-sumi-600 mb-6 animate-fade-in animate-delay-100 max-w-2xl leading-relaxed">
              {userProgress ? '坚持每天一点点的进步，终将汇聚成流利的日语能力。' : '开启系统化的 N2 语法学习之旅，打下坚实的语言基础。'}
            </p>

            {/* Study streak badge - Minimalist */}
            {userProgress && userProgress.studyStreak > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-kincha-50 rounded-lg border border-kincha-200 text-kincha-800 text-sm font-medium mb-8 animate-fade-in animate-delay-200">
                <Flame className="w-4 h-4 text-kincha-500 fill-kincha-500" />
                <span>连续学习 {userProgress.studyStreak} 天</span>
              </div>
            )}

            {/* Action buttons - Solid & Clear */}
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
              <Link
                to={getContinueLearningLink()}
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                <Play size={20} className="fill-current" />
                继续学习
              </Link>
              {reviewItems.length > 0 && (
                <Link
                  to="/review"
                  className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 border-shu-200 text-shu-700 hover:bg-shu-50"
                >
                  <Clock size={20} />
                  <span>复习 ({reviewItems.length})</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Review Reminder - High Priority */}
            {settings?.showReviewReminderOnHome && reviewItems.length > 0 && (
              <div className="card-paper p-8 border-l-4 border-l-shu-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock className="w-32 h-32 text-shu-500 transform rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-sumi-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-shu-500"></span>
                      需要复习
                    </h3>
                    <p className="text-sumi-600 mb-1">
                      根据记忆曲线，由于 <span className="font-bold text-shu-600">{reviewItems.length}</span> 个语法点即将遗忘。
                    </p>
                    <p className="text-sm text-sumi-400">
                      预计用时: {Math.ceil(reviewItems.length * 3)} 分钟
                    </p>
                  </div>
                  <Link
                    to="/review"
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-shu-600 hover:bg-shu-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    立即复习
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            {/* Daily Goal Card */}
            {dailyGoal && (
              <div className="card-paper p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-sumi-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-matcha-500" />
                      今日目标
                    </h3>
                    <p className="text-xs text-sumi-400 mt-1 pl-7 tracking-wider uppercase">Daily Goal</p>
                  </div>
                  {dailyGoal.isCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-matcha-100 text-matcha-700 text-sm font-medium rounded-full">
                      <Sparkles size={14} />
                      已完成
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Sentences Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-sumi-600">例句学习</span>
                      <span className="font-bold text-sumi-900 font-mono">
                        {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                      </span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <div
                        className="progress-bar-fill bg-ai-500"
                        style={{
                          width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Grammar Points Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-sumi-600">语法点</span>
                      <span className="font-bold text-sumi-900 font-mono">
                        {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                      </span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <div
                        className="progress-bar-fill bg-matcha-500"
                        style={{
                          width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Progress Card */}
            <div className="card-paper p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-sumi-100 pb-4">
                <TrendingUp className="w-5 h-5 text-ai-600" />
                <h3 className="font-bold text-sumi-900 text-lg">学习总览</h3>
              </div>

              <div className="space-y-8">
                {/* Lessons Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600 font-medium">课程进度</span>
                    <span className="font-bold text-ai-700">{Math.round(overallProgress.lessons)}%</span>
                  </div>
                  <div className="progress-bar-bg h-3">
                    <div
                      className="progress-bar-fill bg-ai-600"
                      style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-sumi-400 mt-2 text-right">已完成 {userProgress?.completedLessons.length || 0} / 50 课</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Grammar Points Progress */}
                  <div className="bg-sumi-50 p-4 rounded-lg border border-sumi-100">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-sumi-600">语法掌握</span>
                      <span className="font-bold text-sumi-900">{Math.round(overallProgress.grammar)}%</span>
                    </div>
                    <div className="progress-bar-bg h-1.5 bg-sumi-200">
                      <div
                        className="progress-bar-fill bg-matcha-500"
                        style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Sentences Progress */}
                  <div className="bg-sumi-50 p-4 rounded-lg border border-sumi-100">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-sumi-600">例句积累</span>
                      <span className="font-bold text-sumi-900">{Math.round(overallProgress.sentences)}%</span>
                    </div>
                    <div className="progress-bar-bg h-1.5 bg-sumi-200">
                      <div
                        className="progress-bar-fill bg-kincha-500"
                        style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/progress"
                className="mt-6 flex items-center justify-center gap-2 text-ai-600 hover:text-ai-800 text-sm font-medium py-2 transition-colors uppercase tracking-wide"
              >
                查看详细统计 <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column - Quick Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-semibold text-sumi-500 uppercase tracking-widest pl-1">快速导航</h3>

            <div className="grid gap-3">
              <Link
                to={getContinueLearningLink()}
                className="group card-paper p-4 flex items-center justify-between hover:border-ai-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ai-50 flex items-center justify-center group-hover:bg-ai-100 transition-colors">
                    <Play className="w-5 h-5 text-ai-600 ml-0.5" />
                  </div>
                  <span className="font-medium text-sumi-900">继续学习</span>
                </div>
                <ArrowRight size={16} className="text-sumi-300 group-hover:text-ai-600 transition-colors" />
              </Link>

              {reviewItems.length > 0 && (
                <Link
                  to="/review"
                  className="group card-paper p-4 flex items-center justify-between hover:border-shu-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-shu-50 flex items-center justify-center group-hover:bg-shu-100 transition-colors">
                      <Target className="w-5 h-5 text-shu-600" />
                    </div>
                    <div>
                      <span className="font-medium text-sumi-900 block">开始复习</span>
                      <span className="text-xs text-shu-500">{reviewItems.length} 个待复习</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-sumi-300 group-hover:text-shu-600 transition-colors" />
                </Link>
              )}

              <Link
                to="/practice"
                className="group card-paper p-4 flex items-center justify-between hover:border-matcha-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-matcha-50 flex items-center justify-center group-hover:bg-matcha-100 transition-colors">
                    <Award className="w-5 h-5 text-matcha-600" />
                  </div>
                  <span className="font-medium text-sumi-900">练习模式</span>
                </div>
                <ArrowRight size={16} className="text-sumi-300 group-hover:text-matcha-600 transition-colors" />
              </Link>

              <Link
                to="/lessons"
                className="group card-paper p-4 flex items-center justify-between hover:border-sumi-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sumi-50 flex items-center justify-center group-hover:bg-sumi-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-sumi-600" />
                  </div>
                  <span className="font-medium text-sumi-900">课程列表</span>
                </div>
                <ArrowRight size={16} className="text-sumi-300 group-hover:text-sumi-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
