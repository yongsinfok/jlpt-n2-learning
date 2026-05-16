/**
 * 进度仪表盘组件
 * 汇总显示所有学习进度信息
 */

import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { useMemo } from 'react';
import { formatDuration } from '@/utils/dateHelper';

interface OverallProgress {
  lessons: number;
  grammar: number;
  sentences: number;
}

interface StudyTimeStats {
  total: number; // 秒
  averageDaily: number; // 秒
  thisWeek: number; // 秒
}

interface PracticeStats {
  totalQuestions: number;
  correctRate: number;
  fillBlankRate: number;
  choiceRate: number;
}

interface MasteryDistribution {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

interface WeakGrammarPoint {
  grammarId: string;
  grammarPoint: string;
  correctRate: number;
  totalCount: number;
}

interface ProgressDashboardProps {
  /** 总体进度 */
  overallProgress: OverallProgress;
  /** 学习时长统计 */
  studyTimeStats: StudyTimeStats;
  /** 练习统计 */
  practiceStats: PracticeStats;
  /** 掌握程度分布 */
  masteryDistribution: MasteryDistribution;
  /** 薄弱知识点 */
  weakGrammarPoints: WeakGrammarPoint[];
  /** 点击针对性练习按钮 */
  onPracticeWeakPoints?: () => void;
}

export function ProgressDashboard({
  overallProgress,
  studyTimeStats,
  practiceStats,
  masteryDistribution,
  weakGrammarPoints,
  onPracticeWeakPoints,
}: ProgressDashboardProps) {

  const totalMastery = useMemo(() => {
    return (
      masteryDistribution.level1 +
      masteryDistribution.level2 +
      masteryDistribution.level3 +
      masteryDistribution.level4 +
      masteryDistribution.level5
    );
  }, [masteryDistribution]);

  return (
    <div className="space-y-6">
      {/* 总体进度 */}
      <section className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          总体进度
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 课程进度 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-ink-soft">已完成课程</span>
              <span className="font-bold text-accent">{Math.round(overallProgress.lessons)}%</span>
            </div>
            <div className="w-full bg-surface-dim rounded-full h-3">
              <div
                className="bg-gradient-to-r from-accent/70 to-accent h-3 rounded-full transition-all"
                style={{ width: `${Math.min(overallProgress.lessons, 100)}%` }}
              />
            </div>
          </div>

          {/* 语法点进度 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-ink-soft">已学习语法点</span>
              <span className="font-bold text-accent">{Math.round(overallProgress.grammar)}%</span>
            </div>
            <div className="w-full bg-surface-dim rounded-full h-3">
              <div
                className="bg-gradient-to-r from-accent/50 to-accent h-3 rounded-full transition-all"
                style={{ width: `${Math.min(overallProgress.grammar, 100)}%` }}
              />
            </div>
          </div>

          {/* 例句进度 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-ink-soft">已学习例句</span>
              <span className="font-bold text-pine">{Math.round(overallProgress.sentences)}%</span>
            </div>
            <div className="w-full bg-surface-dim rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pine/60 to-pine h-3 rounded-full transition-all"
                style={{ width: `${Math.min(overallProgress.sentences, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 学习时长统计 */}
      <section className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pine" />
          学习时长
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-ink">{formatDuration(studyTimeStats.total)}</p>
            <p className="text-sm text-ink-soft mt-1">总学习时长</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-ink">{formatDuration(studyTimeStats.averageDaily)}</p>
            <p className="text-sm text-ink-soft mt-1">平均每天</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">{formatDuration(studyTimeStats.thisWeek)}</p>
            <p className="text-sm text-ink-soft mt-1">本周学习</p>
          </div>
        </div>
      </section>

      {/* 练习统计 */}
      <section className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          练习统计
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-dim rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-ink">{practiceStats.totalQuestions}</p>
            <p className="text-xs text-ink-soft mt-1">总练习题数</p>
          </div>
          <div className="bg-surface-dim rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">{Math.round(practiceStats.correctRate)}%</p>
            <p className="text-xs text-ink-soft mt-1">总正确率</p>
          </div>
          <div className="bg-surface-dim rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">{Math.round(practiceStats.fillBlankRate)}%</p>
            <p className="text-xs text-ink-soft mt-1">填空题正确率</p>
          </div>
          <div className="bg-surface-dim rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-pine">{Math.round(practiceStats.choiceRate)}%</p>
            <p className="text-xs text-ink-soft mt-1">选择题正确率</p>
          </div>
        </div>
      </section>

      {/* 掌握程度分布 */}
      {totalMastery > 0 && (
        <section className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber" />
            掌握程度分布
          </h2>
          <div className="space-y-3">
            {[
              { level: 5, label: '完全掌握', color: 'bg-pine', count: masteryDistribution.level5 },
              { level: 4, label: '熟练掌握', color: 'bg-accent', count: masteryDistribution.level4 },
              { level: 3, label: '基本掌握', color: 'bg-amber', count: masteryDistribution.level3 },
              { level: 2, label: '初步掌握', color: 'bg-accent/60', count: masteryDistribution.level2 },
              { level: 1, label: '刚学习', color: 'bg-ink-faint', count: masteryDistribution.level1 },
            ].map((item) => (
              <div key={item.level} className="flex items-center gap-3">
                <span className="text-sm text-ink-soft w-20">{item.label}</span>
                <div className="flex-1 bg-surface-dim rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all`}
                    style={{ width: `${totalMastery > 0 ? (item.count / totalMastery) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-ink w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 薄弱知识点 */}
      {weakGrammarPoints.length > 0 && (
        <section className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            薄弱知识点
          </h2>
          <div className="space-y-2 mb-4">
            {weakGrammarPoints.slice(0, 5).map((item) => (
              <div
                key={item.grammarId}
                className="flex items-center justify-between bg-surface-dim rounded-lg p-3 border border-border"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-ink">{item.grammarPoint}</span>
                  <span className="text-xs text-ink-mute ml-2">
                    ({item.totalCount} 题)
                  </span>
                </div>
                <div className="text-sm font-bold text-accent">
                  {Math.round(item.correctRate)}%
                </div>
              </div>
            ))}
          </div>
          {onPracticeWeakPoints && (
            <button
              onClick={onPracticeWeakPoints}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              针对性练习
            </button>
          )}
        </section>
      )}
    </div>
  );
}
