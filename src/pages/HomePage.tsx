/**
 * 首页 - Japanese Editorial Style
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, Award } from 'lucide-react';

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
    <div className="min-h-screen washi-bg">
      {/* Hero Section - Japanese Editorial Style */}
      <div className="relative overflow-hidden">
        {/* Decorative seigaiha pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Greeting with vertical text decoration */}
          <div className="relative">
            <div className="hidden md:block absolute -right-8 top-0 vertical-text text-sumi-300 text-sm">
              N2学習の旅へ
            </div>

            <h1 className="font-serif display-display-md text-sumi-DEFAULT mb-3 animate-slide-up">
              {userProgress ? 'おかえりなさい' : 'ようこそ'}
            </h1>
            <p className="text-sumi-500 text-lg mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {userProgress ? '欢迎回来继续你的学习之旅' : '开始系统学习 N2 语法'}
            </p>
            <p className="text-sumi-400 text-sm font-maru animate-slide-up" style={{ animationDelay: '150ms' }}>
              {userProgress ? '学習を続けましょう' : 'JLPT N2 文法をマスターしよう'}
            </p>
          </div>

          {/* Study Streak Badge */}
          {userProgress && userProgress.studyStreak > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-kincha-100 to-kincha-50 rounded-full border border-kincha-200 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <Flame className="w-5 h-5 text-kincha-DEFAULT" />
              <span className="font-maru font-medium text-kincha-700">
                连续学习 <span className="font-bold text-kincha-DEFAULT">{userProgress.studyStreak}</span> 天
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Editorial Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Suggestion Card */}
            {getStudySuggestion() && (
              <div className="japanese-card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-ai-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-ai-DEFAULT" />
                    </div>
                    <h2 className="font-serif text-xl text-sumi-DEFAULT">今日学习建议</h2>
                  </div>
                  <div className="hidden md:block vertical-text text-sumi-300 text-xs">
                    今日の勉強
                  </div>
                </div>
                <p className="text-sumi-600 mb-6 leading-relaxed">{getStudySuggestion()}</p>
                <button
                  onClick={handleContinueLearning}
                  className="w-full sm:w-auto px-8 py-3 bg-ai-DEFAULT hover:bg-ai-600 text-white font-medium rounded-lg transition-all duration-300 shadow-washi hover:shadow-washi-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  开始学习
                </button>
              </div>
            )}

            {/* Review Reminder */}
            {settings?.showReviewReminderOnHome && reviewItems.length > 0 && (
              <div className="japanese-card p-6 border-shu-200 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-shu-100 rounded-lg">
                        <Target className="w-5 h-5 text-shu-DEFAULT" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-sumi-DEFAULT">复习提醒</h3>
                        <p className="text-sm text-sumi-400 font-maru">
                          復習リマインダー
                        </p>
                      </div>
                    </div>
                    <p className="text-sumi-600 mb-4">
                      有 <span className="font-bold text-shu-DEFAULT">{reviewItems.length}</span> 个语法点需要复习
                    </p>
                    <p className="text-sm text-sumi-400 mb-4">
                      预计用时约 {Math.ceil(reviewItems.length * 3)} 分钟
                    </p>
                  </div>
                  <button
                    onClick={handleStartReview}
                    className="px-6 py-3 bg-shu-DEFAULT hover:bg-shu-600 text-white font-medium rounded-lg transition-all duration-300 shadow-washi hover:shadow-washi-md hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    立即复习
                  </button>
                </div>
              </div>
            )}

            {/* Daily Goal Card */}
            {dailyGoal && (
              <div className="japanese-card p-6 animate-slide-up" style={{ animationDelay: '350ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-matcha-100 rounded-lg">
                    <Award className="w-5 h-5 text-matcha-DEFAULT" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-sumi-DEFAULT">每日目标</h3>
                    <p className="text-sm text-sumi-400 font-maru">
                      今日の目標
                    </p>
                  </div>
                  {dailyGoal.isCompleted && (
                    <span className="ml-auto px-3 py-1 bg-matcha-100 text-matcha-700 text-sm font-medium rounded-full">
                      已完成
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Sentences Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sumi-600">例句</span>
                      <span className="font-medium text-sumi-DEFAULT">
                        {dailyGoal.completedSentences} / {dailyGoal.targetSentences}
                      </span>
                    </div>
                    <div className="brush-progress">
                      <div
                        className="brush-progress-bar"
                        style={{
                          width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Grammar Points Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sumi-600">语法点</span>
                      <span className="font-medium text-sumi-DEFAULT">
                        {dailyGoal.completedGrammarPoints} / {dailyGoal.targetGrammarPoints}
                      </span>
                    </div>
                    <div className="brush-progress">
                      <div
                        className="brush-progress-bar"
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
            <div className="japanese-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-ai-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-ai-DEFAULT" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-sumi-DEFAULT">总体进度</h3>
                  <p className="text-sm text-sumi-400 font-maru">
                    全体の進度
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Lessons Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600">已完成课程</span>
                    <span className="font-medium text-ai-DEFAULT">{Math.round(overallProgress.lessons)}%</span>
                  </div>
                  <div className="brush-progress">
                    <div
                      className="brush-progress-bar"
                      style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600">已学习语法点</span>
                    <span className="font-medium text-matcha-DEFAULT">{Math.round(overallProgress.grammar)}%</span>
                  </div>
                  <div className="brush-progress">
                    <div
                      className="brush-progress-bar bg-gradient-to-r from-matcha-400 via-matcha-DEFAULT to-matcha-400"
                      style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sumi-600">已学习例句</span>
                    <span className="font-medium text-kincha-DEFAULT">{Math.round(overallProgress.sentences)}%</span>
                  </div>
                  <div className="brush-progress">
                    <div
                      className="brush-progress-bar bg-gradient-to-r from-kincha-400 via-kincha-DEFAULT to-kincha-400"
                      style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleViewProgress}
                className="mt-6 w-full px-6 py-3 bg-sumi-100 hover:bg-sumi-200 text-sumi-700 font-medium rounded-lg transition-all duration-300"
              >
                查看详细统计
              </button>
            </div>
          </div>

          {/* Right Column - Quick Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="japanese-card p-6 animate-slide-up sticky top-24" style={{ animationDelay: '450ms' }}>
              <h3 className="font-serif text-lg text-sumi-DEFAULT mb-4">快速操作</h3>

              <div className="space-y-3">
                <button
                  onClick={handleContinueLearning}
                  className="w-full px-4 py-3 bg-ai-DEFAULT hover:bg-ai-600 text-white font-medium rounded-lg transition-all duration-300 shadow-washi hover:shadow-washi-md hover:-translate-y-0.5 flex items-center justify-between group"
                >
                  <span>继续学习</span>
                  <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleStartReview}
                  className="w-full px-4 py-3 bg-kincha-DEFAULT hover:bg-kincha-600 text-white font-medium rounded-lg transition-all duration-300 shadow-washi hover:shadow-washi-md hover:-translate-y-0.5 flex items-center justify-between group"
                >
                  <span>开始复习</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => navigate('/practice')}
                  className="w-full px-4 py-3 bg-matcha-DEFAULT hover:bg-matcha-600 text-white font-medium rounded-lg transition-all duration-300 shadow-washi hover:shadow-washi-md hover:-translate-y-0.5 flex items-center justify-between group"
                >
                  <span>练习模式</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => navigate('/lessons')}
                  className="w-full px-4 py-3 bg-sumi-100 hover:bg-sumi-200 text-sumi-700 font-medium rounded-lg transition-all duration-300 flex items-center justify-between group"
                >
                  <span>课程列表</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
