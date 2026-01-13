/**
 * 首页 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, ArrowRight, Clock, Award, Zap, BookCopy, Brain, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

/**
 * HomePage - Modern Glassmorphism Design with gradient backgrounds
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
    <div className="min-h-screen">
      {/* Hero Section - Modern Style */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card-strong mb-8 animate-modern-fade">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold">
              {userProgress?.studyStreak ? `连续学习 ${userProgress.studyStreak} 天` : '开始你的学习之旅'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-display mb-6 animate-modern-fade stagger-1 text-white drop-shadow-lg">
            掌握日语 N2
            <br />
            <span className="text-white/90">语法系统</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed animate-modern-fade stagger-2">
            {userProgress
              ? '结构化学习。持续进步。通过重复掌握。'
              : '开启你的日语流利之旅，采用我们的系统学习方法。'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-modern-fade stagger-3">
            <Link
              to={getContinueLearningLink()}
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              <Play size={20} className="fill-current" />
              {userProgress ? '继续学习' : '立即开始'}
            </Link>
            {reviewItems.length > 0 && (
              <Link to="/review" className="glass-card-strong hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Clock size={20} />
                复习 ({reviewItems.length})
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards - Modern Grid */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Daily Goal */}
            <div className="glass-card animate-modern-fade">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Target size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-text-primary">每日目标</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
              <p className="text-text-secondary text-center mb-4">
                {dailyGoal ? `${dailyGoal.completedSentences}/${dailyGoal.targetSentences} 个句子` : '加载中...'}
              </p>
              <Link to="/lessons" className="btn-modern-secondary btn-modern-small w-full justify-center">
                查看目标 <ArrowRight size={14} />
              </Link>
            </div>

            {/* Card 2 - Progress (Center, Larger) */}
            <div className="glass-card-strong animate-modern-fade stagger-1 md:-mt-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-glow">
                  <TrendingUp size={40} className="text-primary" />
                </div>
              </div>
              <div className="text-center mb-2">
                <span className="modern-badge">总体进度</span>
              </div>
              <div className="text-5xl font-display font-bold text-center mb-2 gradient-text">
                {overallProgress.lessons}%
              </div>
              <p className="text-text-secondary text-center mb-6">
                {userProgress?.completedLessons.length || 0} / 50 课已完成
              </p>
              <Link to="/progress" className="btn-modern-primary w-full justify-center">
                查看进度 <ArrowRight size={14} />
              </Link>
            </div>

            {/* Card 3 - Grammar */}
            <div className="glass-card animate-modern-fade stagger-2">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-text-primary">语法点</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
              <p className="text-text-secondary text-center mb-4">
                {userProgress?.learnedGrammar.length || 0} / 200 个已掌握
              </p>
              <Link to="/lessons" className="btn-modern-secondary btn-modern-small w-full justify-center">
                继续学习 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Grid */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="glass-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-secondary">已完成</span>
              </div>
              <div className="text-4xl font-display font-bold text-text-primary">
                {userProgress?.completedLessons.length || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">共 50 课</div>
            </div>

            {/* Stat 2 */}
            <div className="glass-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-secondary">语法</span>
              </div>
              <div className="text-4xl font-display font-bold text-text-primary">
                {userProgress?.learnedGrammar.length || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">共 200 个</div>
            </div>

            {/* Stat 3 */}
            <div className="glass-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookCopy className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-secondary">句子</span>
              </div>
              <div className="text-4xl font-display font-bold text-text-primary">
                {userProgress?.learnedSentences.length || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">共 1000 个</div>
            </div>

            {/* Stat 4 */}
            <div className="glass-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-secondary">待复习</span>
              </div>
              <div className="text-4xl font-display font-bold text-text-primary">
                {reviewItems.length}
              </div>
              <div className="text-sm text-text-secondary mt-1">个语法点</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card-strong p-8 md:p-10">
            <h2 className="text-2xl font-semibold mb-8 text-text-primary">快捷操作</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Action 1 */}
              <Link
                to={getContinueLearningLink()}
                className="group flex items-center gap-4 p-6 rounded-xl hover:bg-white/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-0.5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary">继续学习</h4>
                  <p className="text-sm text-text-secondary">从你离开的地方继续</p>
                </div>
                <ArrowRight className="w-6 h-6 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 2 */}
              <Link
                to="/practice"
                className="group flex items-center gap-4 p-6 rounded-xl hover:bg-white/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary">练习模式</h4>
                  <p className="text-sm text-text-secondary">巩固你的知识</p>
                </div>
                <ArrowRight className="w-6 h-6 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 3 */}
              <Link
                to="/review"
                className="group flex items-center gap-4 p-6 rounded-xl hover:bg-white/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary">复习</h4>
                  <p className="text-sm text-text-secondary">{reviewItems.length} 项待复习</p>
                </div>
                <ArrowRight className="w-6 h-6 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 4 */}
              <Link
                to="/progress"
                className="group flex items-center gap-4 p-6 rounded-xl hover:bg-white/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary">统计数据</h4>
                  <p className="text-sm text-text-secondary">查看详细进度</p>
                </div>
                <ArrowRight className="w-6 h-6 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Goal Progress */}
      {dailyGoal && (
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">今日目标</h3>
                    <p className="text-sm text-text-secondary">每日目标跟踪</p>
                  </div>
                </div>
                {dailyGoal.isCompleted && (
                  <span className="modern-badge flex items-center gap-2">
                    <CheckCircle2 size={16} fill="currentColor" />
                    已完成
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Sentences Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <BookCopy className="w-4 h-4" />
                      句子
                    </span>
                    <span className="text-sm font-medium font-mono px-3 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                      {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Grammar Points Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      语法点
                    </span>
                    <span className="text-sm font-medium font-mono px-3 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                      {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min((dailyGoal.completedGrammarPoints / dailyGoal.targetGrammarPoints) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
