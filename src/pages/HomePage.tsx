/**
 * HomePage - Glassmorphism Design with Japanese Colors
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, Play, Flame, Target, ArrowRight, Clock, Award, Zap, BookCopy, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

/**
 * HomePage - Japanese-inspired Glassmorphism
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
    <div className="min-h-screen bg-washi">
      {/* Hero Section - Glassmorphism with Japanese Colors */}
      <section className="bg-washi bg-seigaiha border-b border-ai/20">
        <div className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Badge - Glassmorphism with Spring Animation */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-8 animate-spring-bounce">
              <div className="w-8 h-8 rounded-full bg-ai flex items-center justify-center">
                <Flame className="w-5 h-5 text-sakura" />
              </div>
              <span className="text-base font-semibold text-sumi">
                {userProgress?.studyStreak ? `连续学习 ${userProgress.studyStreak} 天` : '开始你的学习之旅'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-sumi mb-6 leading-tight">
              掌握日语 N2 语法系统
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-sumi/70 mb-10 max-w-3xl leading-relaxed">
              {userProgress
                ? '结构化学习。持续进步。通过重复掌握。'
                : '开启你的日语流利之旅，采用我们的系统学习方法。'}
            </p>

            {/* CTA Buttons - Sakura Pink Primary, Glass Secondary */}
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" className="!bg-sakura hover:!bg-sakura-dark" asChild>
                <Link to={getContinueLearningLink()} className="flex items-center gap-3">
                  <Play size={24} />
                  {userProgress ? '继续学习' : '立即开始'}
                </Link>
              </Button>
              {reviewItems.length > 0 && (
                <Button variant="secondary" size="lg" className="glass-card" asChild>
                  <Link to="/review" className="flex items-center gap-3">
                    <Clock size={24} />
                    复习 ({reviewItems.length})
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards - Glassmorphism with Bouncy Animations */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stat 1 - Glass card with bouncy animation */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-ai flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">已完成课程</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">
              {userProgress?.completedLessons.length || 0}
            </div>
            <div className="text-lg text-sumi/70">共 50 课</div>
            <div className="mt-4">
              <div className="progress-bar h-3 glass-card-subtle">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${overallProgress.lessons}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 2 - Glass card with bouncy animation */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-ai flex items-center justify-center">
                <Brain className="w-8 h-8 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">已学语法</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">
              {userProgress?.learnedGrammar.length || 0}
            </div>
            <div className="text-lg text-sumi/70">共 200 个</div>
            <div className="mt-4">
              <div className="progress-bar h-3 glass-card-subtle">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${overallProgress.grammar}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 3 - Glass card with bouncy animation */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-ai flex items-center justify-center">
                <BookCopy className="w-8 h-8 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">已学句子</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">
              {userProgress?.learnedSentences.length || 0}
            </div>
            <div className="text-lg text-sumi/70">共 1000 个</div>
            <div className="mt-4">
              <div className="progress-bar h-3 glass-card-subtle">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${overallProgress.sentences}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 4 - Glass card with bouncy animation */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-ai flex items-center justify-center">
                <Clock className="w-8 h-8 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">待复习</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">
              {reviewItems.length}
            </div>
            <div className="text-lg text-sumi/70">个语法点</div>
            {reviewItems.length > 0 && (
              <Button variant="accent" className="mt-4 !bg-matcha hover:!bg-matcha-dark" asChild>
                <Link to="/review">立即复习</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions - Glassmorphism with Hover Effects */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="glass-card-subtle animate-spring-bounce">
          <div className="card-header">
            <h2 className="text-3xl font-bold text-sumi">快捷操作</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Action 1 - Bouncy hover */}
              <Link
                to={getContinueLearningLink()}
                className="group flex items-center gap-6 p-8 rounded-xl border-2 border-ai/20 hover:border-ai hover:bg-ai/10 transition-all hover-lift"
              >
                <div className="w-20 h-20 rounded-xl bg-ai flex items-center justify-center flex-shrink-0">
                  <Play className="w-10 h-10 text-washi" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-sumi mb-2">继续学习</h4>
                  <p className="text-lg text-sumi/70">从你离开的地方继续</p>
                </div>
                <ArrowRight className="w-8 h-8 text-sumi/70 group-hover:text-sakura transition-all flex-shrink-0" />
              </Link>

              {/* Action 2 - Bouncy hover */}
              <Link
                to="/practice"
                className="group flex items-center gap-6 p-8 rounded-xl border-2 border-ai/20 hover:border-ai hover:bg-ai/10 transition-all hover-lift"
              >
                <div className="w-20 h-20 rounded-xl bg-ai flex items-center justify-center flex-shrink-0">
                  <Zap className="w-10 h-10 text-washi" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-sumi mb-2">练习模式</h4>
                  <p className="text-lg text-sumi/70">巩固你的知识</p>
                </div>
                <ArrowRight className="w-8 h-8 text-sumi/70 group-hover:text-sakura transition-all flex-shrink-0" />
              </Link>

              {/* Action 3 - Bouncy hover */}
              <Link
                to="/review"
                className="group flex items-center gap-6 p-8 rounded-xl border-2 border-ai/20 hover:border-ai hover:bg-ai/10 transition-all hover-lift"
              >
                <div className="w-20 h-20 rounded-xl bg-ai flex items-center justify-center flex-shrink-0">
                  <Clock className="w-10 h-10 text-washi" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-sumi mb-2">复习</h4>
                  <p className="text-lg text-sumi/70">{reviewItems.length} 项待复习</p>
                </div>
                <ArrowRight className="w-8 h-8 text-sumi/70 group-hover:text-sakura transition-all flex-shrink-0" />
              </Link>

              {/* Action 4 - Bouncy hover */}
              <Link
                to="/progress"
                className="group flex items-center gap-6 p-8 rounded-xl border-2 border-ai/20 hover:border-ai hover:bg-ai/10 transition-all hover-lift"
              >
                <div className="w-20 h-20 rounded-xl bg-ai flex items-center justify-center flex-shrink-0">
                  <Award className="w-10 h-10 text-washi" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-sumi mb-2">统计数据</h4>
                  <p className="text-lg text-sumi/70">查看详细进度</p>
                </div>
                <ArrowRight className="w-8 h-8 text-sumi/70 group-hover:text-sakura transition-all flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Goal Progress - Glassmorphism */}
      {dailyGoal && (
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12 pb-20">
          <div className="glass-card-strong">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-ai flex items-center justify-center">
                    <Target className="w-8 h-8 text-washi" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-sumi">今日目标</h3>
                    <p className="text-lg text-sumi/70">每日目标跟踪</p>
                  </div>
                </div>
                {dailyGoal.isCompleted && (
                  <span className="badge-glass flex items-center gap-3 text-base px-6 py-3">
                    <CheckCircle2 size={20} fill="currentColor" />
                    已完成
                  </span>
                )}
              </div>
            </div>
            <div className="card-body space-y-8">
              {/* Sentences Progress */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-sumi flex items-center gap-3">
                    <BookCopy className="w-6 h-6" />
                    句子
                  </span>
                  <span className="text-lg font-semibold px-4 py-2 rounded-lg bg-washi text-sumi">
                    {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                  </span>
                </div>
                <div className="progress-bar h-3 glass-card-subtle">
                  <div
                    className="progress-fill-gradient h-3"
                    style={{ width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Grammar Points Progress */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-sumi flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    语法点
                  </span>
                  <span className="text-lg font-semibold px-4 py-2 rounded-lg bg-washi text-sumi">
                    {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                  </span>
                </div>
                <div className="progress-bar h-3 glass-card-subtle">
                  <div
                    className="progress-fill-gradient h-3"
                    style={{ width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
        </div>
      </section>
      )}
    </div>
  );
}
