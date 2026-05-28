/**
 * HomeHub — Simplified dashboard
 * Continue learning CTA + Review prompt + Goal progress + Stats summary
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, BookOpen, Target, Clock } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/services/progressService';
import { getAllLessons } from '@/services/lessonService';
import { getUnresolvedWrongAnswers } from '@/services/reviewService';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { DailyGoal, Lesson } from '@/types';

export function HomeHub() {
  const navigate = useNavigate();
  const { userProgress, setUserProgress, settings } = useUserStore();
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [progress, goal, allLessons, wrongAnswers] = await Promise.all([
        getUserProgress(),
        getTodayGoal(),
        getAllLessons(),
        getUnresolvedWrongAnswers(),
      ]);

      if (progress) setUserProgress(progress);
      if (goal) setDailyGoal(goal);
      setLessons(allLessons.sort((a, b) => a.id - b.id));
      setWrongCount(wrongAnswers.length);

      if (progress) {
        const due = getDueReviews(progress.learnedGrammar);
        setReviewCount(due.length);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载中..." />
      </div>
    );
  }

  // Find current lesson (first unlocked & incomplete)
  const currentLesson = lessons.find(l => l.isUnlocked && !l.isCompleted);
  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Goal progress
  const sentenceTarget = settings.targetSentences;
  const grammarTarget = settings.targetGrammarPoints;
  const sentencesDone = dailyGoal?.completedSentences ?? 0;
  const grammarsDone = dailyGoal?.completedGrammarPoints ?? 0;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Streak & Date row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-accent" />
            <span className="text-sm font-bold text-ink">
              {userProgress?.studyStreak ?? 0} 天连续
            </span>
          </div>
          <span className="text-xs text-ink-mute">
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
          </span>
        </div>

        {/* Primary CTA: Continue Learning */}
        {currentLesson && (
          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-surface border-2 border-accent/30 rounded-2xl p-5 mb-4 text-left hover:border-accent hover:shadow-lg transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-pale rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">继续学习</div>
                  <div className="text-xs text-ink-mute">Lesson {currentLesson.id} · {currentLesson.grammarPointCount} 个语法点</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-ink-mute group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
            <div className="h-2 bg-surface-dim rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${currentLesson.completionRate}%` }} />
            </div>
            <div className="text-right text-xs text-ink-mute mt-1">{currentLesson.completionRate.toFixed(0)}%</div>
          </button>
        )}

        {/* No current lesson (all done or no progress) */}
        {!currentLesson && (
          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-accent text-white rounded-2xl p-6 mb-4 text-center font-bold text-lg hover:bg-accent/90 transition-all active:scale-[0.98]"
          >
            开始学习
          </button>
        )}

        {/* Review prompt */}
        {reviewCount > 0 && (
          <button
            onClick={() => navigate('/learn?mode=review')}
            className="w-full bg-surface border border-amber/30 rounded-2xl p-4 mb-4 text-left hover:border-amber hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-pale rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-amber" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{reviewCount} 个语法点待复习</div>
                  <div className="text-xs text-ink-mute">点击开始复习</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-ink-mute group-hover:text-amber transition-all" />
            </div>
          </button>
        )}

        {/* Today's Goal */}
        <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-accent" />
            <span className="text-sm font-semibold text-ink">今日目标</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-ink-mute mb-1">
                <span>例句</span>
                <span>{sentencesDone}/{sentenceTarget}</span>
              </div>
              <div className="h-1.5 bg-surface-dim rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min((sentencesDone / sentenceTarget) * 100, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-ink-mute mb-1">
                <span>语法点</span>
                <span>{grammarsDone}/{grammarTarget}</span>
              </div>
              <div className="h-1.5 bg-surface-dim rounded-full overflow-hidden">
                <div className="h-full bg-pine rounded-full" style={{ width: `${Math.min((grammarsDone / grammarTarget) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-ink">{completedLessons}</div>
            <div className="text-[10px] text-ink-mute">已完成</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-ink">{userProgress?.learnedSentences.length ?? 0}</div>
            <div className="text-[10px] text-ink-mute">例句</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-ink">{overallProgress}%</div>
            <div className="text-[10px] text-ink-mute">总进度</div>
          </div>
        </div>

        {/* Wrong answers link */}
        {wrongCount > 0 && (
          <button
            onClick={() => navigate('/practice?tab=wrong')}
            className="w-full text-sm text-ink-mute hover:text-accent text-center py-2 transition-colors"
          >
            {wrongCount} 道错题待复习 →
          </button>
        )}
      </div>
    </div>
  );
}
