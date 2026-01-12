/**
 * 首页 - Modern Japanese "Zen Glass" Design
 * Bento Grid Layout with Micro-interactions
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, ArrowRight, Clock, Award, Sparkles, Zap, BookCopy, Brain } from 'lucide-react';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

/**
 * HomePage - Bento grid layout with modern Japanese aesthetic
 */
export function HomePage() {
  const { userProgress, setUserProgress, setDailyGoal, dailyGoal } = useUserStore();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const progress = await getUserProgress();
    if (progress) {
      setUserProgress(progress);
      const dueGrammarIds = getDueReviews(progress.learnedGrammar);
      const items: ReviewItem[] = dueGrammarIds.map((id) => {
        const learnedGrammar = progress.learnedGrammar.find((g) => g.grammarId === id);
        if (!learnedGrammar) {
          return { grammarId: id, grammarPoint: id, lessonNumber: 1, daysSinceReview: 0 };
        }
        const daysSinceReview = Math.floor(
          (Date.now() - new Date(learnedGrammar.nextReviewDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return { grammarId: id, grammarPoint: id, lessonNumber: 1, daysSinceReview };
      });
      setReviewItems(items);
    }
    const todayGoal = await getTodayGoal();
    if (todayGoal) {
      setDailyGoal(todayGoal);
    }
  };

  const getContinueLearningLink = () => {
    if (userProgress?.currentLessonId) {
      return `/lesson/${userProgress.currentLessonId}`;
    }
    return '/lessons';
  };

  const getOverallProgress = () => {
    if (!userProgress) return { lessons: 0, grammar: 0, sentences: 0 };
    return {
      lessons: Math.round((userProgress.completedLessons.length / 50) * 100),
      grammar: Math.round((userProgress.learnedGrammar.length / 200) * 100),
      sentences: Math.round((userProgress.learnedSentences.length / 1000) * 100),
    };
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-washi-texture">
      {/* Hero Section - Modern Bento Style */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-ai-50/30 to-transparent" />
        <div className="absolute inset-0 bg-seigaiha-subtle opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Hero Card */}
            <div className="lg:col-span-8 animate-fade-in-up">
              <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-asanoha-pattern opacity-30 rounded-bl-full" />

                <div className="relative z-10">
                  {/* Greeting */}
                  <div className="mb-6">
                    {userProgress ? (
                      <h1 className="text-h1 font-display font-bold text-gradient mb-3">
                        おかえりなさい。
                      </h1>
                    ) : (
                      <h1 className="text-h1 font-display font-bold text-gradient mb-3">
                        ようこそ。
                      </h1>
                    )}
                    <p className="text-lg md:text-xl text-sumi-600 leading-relaxed max-w-2xl">
                      {userProgress
                        ? '坚持每天一点点的进步，终将汇聚成流利的日语能力。继续你的学习之旅吧！'
                        : '开启系统化的 N2 语法学习之旅，打下坚实的语言基础。'}
                    </p>
                  </div>

                  {/* Study Streak Badge */}
                  {userProgress && userProgress.studyStreak > 0 && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-kincha-50/80 backdrop-blur rounded-xl border border-kincha-200/50 text-kincha-800 text-sm font-semibold mb-8 shadow-sm">
                      <Flame className="w-5 h-5 text-kincha-500 fill-kincha-500 animate-float" />
                      <span>连续学习 <span className="font-bold text-kincha-600">{userProgress.studyStreak}</span> 天</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={getContinueLearningLink()}
                      className="btn-primary inline-flex items-center gap-2.5 text-base px-8 py-3.5 shadow-lg"
                    >
                      <Play size={20} className="fill-current" />
                      继续学习
                    </Link>
                    {reviewItems.length > 0 && (
                      <Link
                        to="/review"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white/80 backdrop-blur border border-shu-200 text-shu-700 rounded-xl font-semibold hover:bg-shu-50 hover:border-shu-300 transition-all duration-200 shadow-sm"
                      >
                        <Clock size={20} />
                        <span>复习 ({reviewItems.length})</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="lg:col-span-4 space-y-4">
              {/* Progress Overview Card */}
              <div className="glass-card p-6 animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-ai-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-ai-700" />
                    </div>
                    <span className="text-sm font-semibold text-sumi-500 uppercase tracking-wider">总进度</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress Ring */}
                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-sumi-100" />
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="text-ai-600"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress.lessons / 100)}`}
                          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-ai-700 font-display">
                          {Math.round(overallProgress.lessons)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-sumi-50/50 rounded-lg">
                      <div className="text-lg font-bold text-ai-700 font-display">{userProgress?.completedLessons.length || 0}</div>
                      <div className="text-[10px] text-sumi-400 uppercase">课程</div>
                    </div>
                    <div className="p-2 bg-sumi-50/50 rounded-lg">
                      <div className="text-lg font-bold text-matcha-600 font-display">{userProgress?.learnedGrammar.length || 0}</div>
                      <div className="text-[10px] text-sumi-400 uppercase">语法</div>
                    </div>
                    <div className="p-2 bg-sumi-50/50 rounded-lg">
                      <div className="text-lg font-bold text-kincha-600 font-display">{userProgress?.learnedSentences.length || 0}</div>
                      <div className="text-[10px] text-sumi-400 uppercase">例句</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Alert Card */}
              {reviewItems.length > 0 && (
                <div className="glass-card p-6 border-l-4 border-l-shu-500 animate-fade-in-up stagger-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock className="w-24 h-24 text-shu-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-shu-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-shu-600" />
                      </div>
                      <span className="text-sm font-semibold text-shu-700">复习提醒</span>
                    </div>
                    <p className="text-sumi-600 text-sm mb-4">
                      <span className="font-bold text-shu-600">{reviewItems.length}</span> 个语法点需要复习
                    </p>
                    <Link
                      to="/review"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-shu-600 hover:bg-shu-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm group-hover:shadow-md"
                    >
                      立即复习
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Daily Goal Card */}
          {dailyGoal && (
            <div className="lg:col-span-6 glass-card p-6 md:p-8 animate-fade-in-up stagger-3">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-matcha-100 to-matcha-50 flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6 text-matcha-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-sumi-900">今日目标</h3>
                    <p className="text-xs text-sumi-400 mt-0.5 uppercase tracking-wider">Daily Goal</p>
                  </div>
                </div>
                {dailyGoal.isCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-matcha-100 text-matcha-700 text-sm font-semibold rounded-full shadow-sm">
                    <Sparkles size={14} className="fill-current" />
                    已完成
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm text-sumi-600 font-medium flex items-center gap-2">
                      <BookCopy className="w-4 h-4" />
                      例句学习
                    </span>
                    <span className="text-sm font-bold text-sumi-900 font-mono bg-sumi-100 px-2 py-0.5 rounded">
                      {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                    </span>
                  </div>
                  <div className="h-2.5 bg-sumi-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ai-400 to-ai-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm text-sumi-600 font-medium flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      语法点
                    </span>
                    <span className="text-sm font-bold text-sumi-900 font-mono bg-sumi-100 px-2 py-0.5 rounded">
                      {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                    </span>
                  </div>
                  <div className="h-2.5 bg-sumi-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-matcha-400 to-matcha-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Navigation Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-sumi-500 uppercase tracking-widest pl-1">快速导航</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to={getContinueLearningLink()}
                className="group glass-card p-5 hover:border-ai-300 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-ai-50 flex items-center justify-center mb-3 group-hover:bg-ai-100 transition-colors group-hover:scale-110 transform duration-200">
                  <Play className="w-6 h-6 text-ai-600 ml-0.5" />
                </div>
                <span className="font-semibold text-sumi-900 group-hover:text-ai-700 transition-colors">继续学习</span>
              </Link>

              <Link
                to="/practice"
                className="group glass-card p-5 hover:border-matcha-300 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-matcha-50 flex items-center justify-center mb-3 group-hover:bg-matcha-100 transition-colors group-hover:scale-110 transform duration-200">
                  <Zap className="w-6 h-6 text-matcha-600" />
                </div>
                <span className="font-semibold text-sumi-900 group-hover:text-matcha-700 transition-colors">练习模式</span>
              </Link>

              <Link
                to="/lessons"
                className="group glass-card p-5 hover:border-sumi-300 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-sumi-50 flex items-center justify-center mb-3 group-hover:bg-sumi-100 transition-colors group-hover:scale-110 transform duration-200">
                  <BookOpen className="w-6 h-6 text-sumi-600" />
                </div>
                <span className="font-semibold text-sumi-900 group-hover:text-sumi-700 transition-colors">课程列表</span>
              </Link>

              <Link
                to="/progress"
                className="group glass-card p-5 hover:border-kincha-300 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-kincha-50 flex items-center justify-center mb-3 group-hover:bg-kincha-100 transition-colors group-hover:scale-110 transform duration-200">
                  <Award className="w-6 h-6 text-kincha-600" />
                </div>
                <span className="font-semibold text-sumi-900 group-hover:text-kincha-700 transition-colors">学习统计</span>
              </Link>
            </div>
          </div>

          {/* Detailed Progress Card - Full Width */}
          <div className="lg:col-span-12 glass-card p-6 md:p-8 animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-100 to-ai-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-ai-700" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-sumi-900">学习进度详情</h3>
                  <p className="text-xs text-sumi-400 uppercase tracking-wider">Learning Progress</p>
                </div>
              </div>
              <Link
                to="/progress"
                className="text-ai-600 hover:text-ai-800 text-sm font-medium transition-colors inline-flex items-center gap-1.5"
              >
                查看全部
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Courses */}
              <div className="bg-gradient-to-br from-ai-50 to-white p-5 rounded-2xl border border-ai-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-sumi-600 font-medium">课程完成度</span>
                  <span className="text-xl font-bold text-ai-700 font-display">{overallProgress.lessons}%</span>
                </div>
                <div className="h-2 bg-ai-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ai-400 to-ai-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${overallProgress.lessons}%` }}
                  />
                </div>
                <p className="text-xs text-sumi-400 mt-2">
                  {userProgress?.completedLessons.length || 0} / 50 课
                </p>
              </div>

              {/* Grammar */}
              <div className="bg-gradient-to-br from-matcha-50 to-white p-5 rounded-2xl border border-matcha-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-sumi-600 font-medium">语法掌握</span>
                  <span className="text-xl font-bold text-matcha-700 font-display">{overallProgress.grammar}%</span>
                </div>
                <div className="h-2 bg-matcha-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-matcha-400 to-matcha-600 rounded-full transition-all duration-1000 ease-out delay-100"
                    style={{ width: `${overallProgress.grammar}%` }}
                  />
                </div>
                <p className="text-xs text-sumi-400 mt-2">
                  {userProgress?.learnedGrammar.length || 0} / 200 个
                </p>
              </div>

              {/* Sentences */}
              <div className="bg-gradient-to-br from-kincha-50 to-white p-5 rounded-2xl border border-kincha-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-sumi-600 font-medium">例句积累</span>
                  <span className="text-xl font-bold text-kincha-700 font-display">{overallProgress.sentences}%</span>
                </div>
                <div className="h-2 bg-kincha-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-kincha-400 to-kincha-600 rounded-full transition-all duration-1000 ease-out delay-200"
                    style={{ width: `${overallProgress.sentences}%` }}
                  />
                </div>
                <p className="text-xs text-sumi-400 mt-2">
                  {userProgress?.learnedSentences.length || 0} / 1000 句
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative bottom pattern */}
      <div className="h-12 bg-asanoha-pattern opacity-40 mt-8" />
    </div>
  );
}
