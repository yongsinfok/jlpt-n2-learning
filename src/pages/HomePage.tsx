/**
 * HomePage - Modern Clean Design
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { BookOpen, TrendingUp, Play, Flame, Target, ArrowRight, Clock, Award, Zap, BookCopy, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

/**
 * HomePage - Modern Clean Design
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
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral mb-6">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-small font-medium text-primary">
                {userProgress?.studyStreak ? `连续学习 ${userProgress.studyStreak} 天` : '开始你的学习之旅'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-h1 md:text-4xl font-bold text-primary mb-4">
              掌握日语 N2 语法系统
            </h1>

            {/* Subheadline */}
            <p className="text-body text-neutral-dark mb-8 max-w-2xl leading-relaxed">
              {userProgress
                ? '结构化学习。持续进步。通过重复掌握。'
                : '开启你的日语流利之旅，采用我们的系统学习方法。'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" asChild>
                <Link to={getContinueLearningLink()} className="flex items-center gap-2">
                  <Play size={18} />
                  {userProgress ? '继续学习' : '立即开始'}
                </Link>
              </Button>
              {reviewItems.length > 0 && (
                <Button variant="secondary" asChild>
                  <Link to="/review" className="flex items-center gap-2">
                    <Clock size={18} />
                    复习 ({reviewItems.length})
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-small font-medium text-neutral-dark">已完成</span>
            </div>
            <div className="text-2xl font-semibold text-primary">
              {userProgress?.completedLessons.length || 0}
            </div>
            <div className="text-small text-neutral-dark mt-1">共 50 课</div>
          </div>

          {/* Stat 2 */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="text-small font-medium text-neutral-dark">语法</span>
            </div>
            <div className="text-2xl font-semibold text-primary">
              {userProgress?.learnedGrammar.length || 0}
            </div>
            <div className="text-small text-neutral-dark mt-1">共 200 个</div>
          </div>

          {/* Stat 3 */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center">
                <BookCopy className="w-5 h-5 text-primary" />
              </div>
              <span className="text-small font-medium text-neutral-dark">句子</span>
            </div>
            <div className="text-2xl font-semibold text-primary">
              {userProgress?.learnedSentences.length || 0}
            </div>
            <div className="text-small text-neutral-dark mt-1">共 1000 个</div>
          </div>

          {/* Stat 4 */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-small font-medium text-neutral-dark">待复习</span>
            </div>
            <div className="text-2xl font-semibold text-primary">
              {reviewItems.length}
            </div>
            <div className="text-small text-neutral-dark mt-1">个语法点</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-h1 text-primary">快捷操作</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action 1 */}
              <Link
                to={getContinueLearningLink()}
                className="group flex items-center gap-4 p-4 rounded-md border border-border hover:border-neutral-dark hover:bg-neutral transition-all"
              >
                <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-h3 text-primary">继续学习</h4>
                  <p className="text-small text-neutral-dark">从你离开的地方继续</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-dark group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 2 */}
              <Link
                to="/practice"
                className="group flex items-center gap-4 p-4 rounded-md border border-border hover:border-neutral-dark hover:bg-neutral transition-all"
              >
                <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-h3 text-primary">练习模式</h4>
                  <p className="text-small text-neutral-dark">巩固你的知识</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-dark group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 3 */}
              <Link
                to="/review"
                className="group flex items-center gap-4 p-4 rounded-md border border-border hover:border-neutral-dark hover:bg-neutral transition-all"
              >
                <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-h3 text-primary">复习</h4>
                  <p className="text-small text-neutral-dark">{reviewItems.length} 项待复习</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-dark group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Action 4 */}
              <Link
                to="/progress"
                className="group flex items-center gap-4 p-4 rounded-md border border-border hover:border-neutral-dark hover:bg-neutral transition-all"
              >
                <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-h3 text-primary">统计数据</h4>
                  <p className="text-small text-neutral-dark">查看详细进度</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-dark group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Goal Progress */}
      {dailyGoal && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-neutral flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-h1 text-primary">今日目标</h3>
                    <p className="text-small text-neutral-dark">每日目标跟踪</p>
                  </div>
                </div>
                {dailyGoal.isCompleted && (
                  <span className="badge badge-success flex items-center gap-2">
                    <CheckCircle2 size={14} fill="currentColor" />
                    已完成
                  </span>
                )}
              </div>
            </div>
            <div className="card-body space-y-6">
              {/* Sentences Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-small font-medium text-primary flex items-center gap-2">
                    <BookCopy className="w-4 h-4" />
                    句子
                  </span>
                  <span className="text-small font-medium px-2 py-1 rounded bg-neutral">
                    {dailyGoal.completedSentences}/{dailyGoal.targetSentences}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min((dailyGoal.completedSentences / dailyGoal.targetSentences) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Grammar Points Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-small font-medium text-primary flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    语法点
                  </span>
                  <span className="text-small font-medium px-2 py-1 rounded bg-neutral">
                    {dailyGoal.completedGrammarPoints}/{dailyGoal.targetGrammarPoints}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
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
