/**
 * HomePage - Bento Grid 2.0 + Enhanced Glassmorphism
 * Japanese-inspired modern design
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import {
  BookOpen,
  Play,
  Flame,
  Target,
  Clock,
  Award,
  Zap,
  BookCopy,
  Brain,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  BentoGrid,
  BentoCard,
  QuickActionCard,
  ProgressCard,
  BentoCardHeader,
  BentoCardTitle,
  BentoCardBody,
} from '@/components/common/BentoGrid';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

/**
 * HomePage - Japanese Glassmorphism with Bento Grid Layout
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
    <div className="min-h-screen bg-washi bg-seigaiha">
      {/* ======================================== */}
      {/* HERO SECTION - Bento Grid Layout */}
      {/* ======================================== */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Hero Bento Grid */}
        <BentoGrid variant="lg" className="mb-8">
          {/* Hero Card - Main CTA (spans 4 columns) */}
          <BentoCard variant="ai" colSpan={3} rowSpan={2} className="!p-0 overflow-hidden">
            <div className="p-8 md:p-10 h-full flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-washi/50 backdrop-blur-sm mb-8 w-fit">
                <div className="w-8 h-8 rounded-full bg-ai flex items-center justify-center">
                  <Flame className="w-5 h-5 text-sakura" />
                </div>
                <span className="text-base font-semibold text-sumi">
                  {userProgress?.studyStreak ? `连续学习 ${userProgress.studyStreak} 天` : '开始你的学习之旅'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sumi mb-4 leading-tight">
                掌握日语 N2 语法系统
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-sumi/70 mb-8 max-w-2xl leading-relaxed">
                {userProgress
                  ? '结构化学习。持续进步。通过重复掌握。'
                  : '开启你的日语流利之旅，采用我们的系统学习方法。'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="!bg-sakura hover:!bg-sakura-dark !shadow-lg !shadow-sakura/30"
                  asChild
                >
                  <Link to={getContinueLearningLink()} className="flex items-center gap-3">
                    <Play size={24} />
                    {userProgress ? '继续学习' : '立即开始'}
                  </Link>
                </Button>
                {reviewItems.length > 0 && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="!bg-washi/80 !backdrop-blur-md hover:!bg-white"
                    asChild
                  >
                    <Link to="/review" className="flex items-center gap-3">
                      <Clock size={24} />
                      复习 ({reviewItems.length})
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </BentoCard>

          {/* Progress Overview Card */}
          <BentoCard variant="featured" colSpan={2} rowSpan={2}>
            <BentoCardHeader>
              <BentoCardTitle>总体进度</BentoCardTitle>
            </BentoCardHeader>
            <BentoCardBody className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Circular Progress */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(42, 63, 143, 0.1)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallProgress.lessons / 100) * 251} 251`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2A3F8F" />
                      <stop offset="50%" stopColor="#6B8E23" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-sumi">{overallProgress.lessons}%</span>
                  <span className="text-sm text-sumi/60 mt-1">完成度</span>
                </div>
              </div>
            </BentoCardBody>
            <div className="bento-card-footer justify-center gap-6 text-sm">
              <span className="text-sumi/70">
                <span className="font-bold text-ai">{userProgress?.completedLessons.length || 0}</span> 课
              </span>
              <span className="text-sumi/70">
                <span className="font-bold text-matcha">{userProgress?.learnedGrammar.length || 0}</span> 语法
              </span>
              <span className="text-sumi/70">
                <span className="font-bold text-sakura">{userProgress?.learnedSentences.length || 0}</span> 句子
              </span>
            </div>
          </BentoCard>

          {/* Quick Actions Card */}
          <BentoCard variant="matcha" colSpan={1}>
            <BentoCardHeader>
              <BentoCardTitle>快捷操作</BentoCardTitle>
            </BentoCardHeader>
            <BentoCardBody className="space-y-3">
              <Link
                to={getContinueLearningLink()}
                className="flex items-center gap-3 p-3 rounded-xl bg-ai/5 hover:bg-ai/10 transition-all group"
              >
                <Play className="w-5 h-5 text-ai" />
                <span className="font-semibold text-sumi text-sm">继续学习</span>
              </Link>
              <Link
                to="/practice"
                className="flex items-center gap-3 p-3 rounded-xl bg-matcha/5 hover:bg-matcha/10 transition-all group"
              >
                <Zap className="w-5 h-5 text-matcha" />
                <span className="font-semibold text-sumi text-sm">练习模式</span>
              </Link>
              <Link
                to="/review"
                className="flex items-center gap-3 p-3 rounded-xl bg-sakura/5 hover:bg-sakura/10 transition-all group"
              >
                <Clock className="w-5 h-5 text-sakura" />
                <span className="font-semibold text-sumi text-sm">复习</span>
              </Link>
            </BentoCardBody>
          </BentoCard>
        </BentoGrid>

        {/* ======================================== */}
        {/* STATS SECTION - Bento Grid */}
        {/* ======================================== */}
        <BentoGrid variant="lg" className="mb-8">
          <ProgressCard
            title="已完成课程"
            current={userProgress?.completedLessons.length || 0}
            total={50}
            icon={<BookOpen className="w-7 h-7" />}
            color="ai"
            delay={0.1}
          />

          <ProgressCard
            title="已学语法"
            current={userProgress?.learnedGrammar.length || 0}
            total={200}
            icon={<Brain className="w-7 h-7" />}
            color="matcha"
            delay={0.2}
          />

          <ProgressCard
            title="已学句子"
            current={userProgress?.learnedSentences.length || 0}
            total={1000}
            icon={<BookCopy className="w-7 h-7" />}
            color="sakura"
            delay={0.3}
          />

          <ProgressCard
            title="待复习"
            current={reviewItems.length}
            total={userProgress?.learnedGrammar.length || 0}
            icon={<Clock className="w-7 h-7" />}
            color="gold"
            delay={0.4}
          />
        </BentoGrid>

        {/* ======================================== */}
        {/* DAILY GOAL SECTION - Bento Grid */}
        {/* ======================================== */}
        {dailyGoal && (
          <BentoGrid variant="lg" className="mb-8">
            <BentoCard variant="ai" colSpan={2} rowSpan={2}>
              <BentoCardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ai to-ai-light flex items-center justify-center">
                      <Target className="w-7 h-7 text-washi" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-sumi">今日目标</h3>
                      <p className="text-base text-sumi/70">每日目标跟踪</p>
                    </div>
                  </div>
                  {dailyGoal.isCompleted && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-matcha/20 text-matcha font-semibold text-sm">
                      <CheckCircle2 size={18} fill="currentColor" />
                      已完成
                    </span>
                  )}
                </div>
              </BentoCardHeader>
              <BentoCardBody className="space-y-6">
                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-sumi flex items-center gap-3">
                      <BookCopy className="w-5 h-5 text-ai" />
                      句子
                    </span>
                    <span className="text-base font-semibold px-4 py-2 rounded-lg bg-washi text-sumi">
                      {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                    </span>
                  </div>
                  <div className="progress-bar h-2 glass-card-subtle">
                    <div
                      className="progress-fill-gradient h-2"
                      style={{
                        width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-sumi flex items-center gap-3">
                      <Brain className="w-5 h-5 text-ai" />
                      语法点
                    </span>
                    <span className="text-base font-semibold px-4 py-2 rounded-lg bg-washi text-sumi">
                      {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                    </span>
                  </div>
                  <div className="progress-bar h-2 glass-card-subtle">
                    <div
                      className="progress-fill-gradient h-2"
                      style={{
                        width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </BentoCardBody>
            </BentoCard>

            {/* Study Streak Card */}
            <BentoCard variant="sakura" colSpan={2}>
              <BentoCardHeader>
                <BentoCardTitle>学习连续</BentoCardTitle>
              </BentoCardHeader>
              <BentoCardBody className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-start justify-center gap-2 mb-3">
                    <span className="text-7xl font-bold text-sumi">
                      {userProgress?.studyStreak || 0}
                    </span>
                    <span className="text-3xl font-bold text-sumi/70 mt-2">天</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sakura/20 text-sakura text-sm font-semibold">
                    <Flame size={16} fill="currentColor" />
                    保持势头！
                  </div>
                </div>
              </BentoCardBody>
            </BentoCard>
          </BentoGrid>
        )}

        {/* ======================================== */}
        {/* NAVIGATION CARDS - Bento Grid */}
        {/* ======================================== */}
        <BentoGrid variant="lg">
          <QuickActionCard
            title="课程列表"
            description="查看所有 50 个课程"
            icon={<BookOpen className="w-10 h-10" />}
            href="/lessons"
            iconVariant="ai"
            delay={0.1}
          />

          <QuickActionCard
            title="练习模式"
            description="巩固你的知识"
            icon={<Zap className="w-10 h-10" />}
            href="/practice"
            iconVariant="matcha"
            delay={0.2}
          />

          <QuickActionCard
            title="复习系统"
            description={`${reviewItems.length} 项待复习`}
            icon={<Clock className="w-10 h-10" />}
            href="/review"
            iconVariant="sakura"
            delay={0.3}
          />

          <QuickActionCard
            title="统计分析"
            description="查看详细进度"
            icon={<TrendingUp className="w-10 h-10" />}
            href="/progress"
            iconVariant="gold"
            delay={0.4}
          />

          <QuickActionCard
            title="成就系统"
            description="解锁你的成就"
            icon={<Award className="w-10 h-10" />}
            href="/achievements"
            iconVariant="ai"
            delay={0.5}
          />

          <QuickActionCard
            title="学习日历"
            description="查看学习历史"
            icon={<Calendar className="w-10 h-10" />}
            href="/progress"
            iconVariant="matcha"
            delay={0.6}
          />
        </BentoGrid>
      </section>

      {/* ======================================== */}
      {/* MOTIVATIONAL SECTION */}
      {/* ======================================== */}
      {userProgress && userProgress.completedLessons.length > 0 && userProgress.completedLessons.length < 50 && (
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
          <BentoGrid>
            <BentoCard variant="featured" colSpan="full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400 to-sakura-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sakura/30">
                    <Flame className="w-10 h-10 text-washi" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-sumi mb-3">
                      继续保持学习势头！
                    </h3>
                    <p className="text-lg text-sumi/70">
                      还有 <span className="text-sakura font-bold">{50 - userProgress.completedLessons.length}</span> 课待完成。坚持就是胜利。
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="!bg-sakura hover:!bg-sakura-dark shadow-lg shadow-sakura/30 px-8 py-4 text-lg"
                  asChild
                >
                  <Link to={getContinueLearningLink()} className="flex items-center gap-3">
                    <Zap size={24} />
                    继续学习
                  </Link>
                </Button>
              </div>
            </BentoCard>
          </BentoGrid>
        </section>
      )}
    </div>
  );
}
