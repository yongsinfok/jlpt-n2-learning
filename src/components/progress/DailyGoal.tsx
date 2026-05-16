/**
 * 每日目标组件
 * 显示今日学习目标完成进度
 */

import { Target, CheckCircle2 } from 'lucide-react';

interface DailyGoalProps {
  /** 今日已学习例句数 */
  completedSentences: number;
  /** 今日目标例句数 */
  targetSentences: number;
  /** 今日已学习语法点数 */
  completedGrammarPoints: number;
  /** 今日目标语法点数 */
  targetGrammarPoints: number;
  /** 是否已完成 */
  isCompleted?: boolean;
}

export function DailyGoal({
  completedSentences,
  targetSentences,
  completedGrammarPoints,
  targetGrammarPoints,
}: DailyGoalProps) {
  const sentenceProgress = Math.min((completedSentences / targetSentences) * 100, 100);
  const grammarProgress = Math.min((completedGrammarPoints / targetGrammarPoints) * 100, 100);

  const overallProgress = (sentenceProgress + grammarProgress) / 2;

  const getRemaining = (completed: number, target: number): string => {
    const remaining = Math.max(target - completed, 0);
    if (remaining === 0) return '已完成';
    return `还需${remaining}个`;
  };

  const isAllCompleted = completedSentences >= targetSentences && completedGrammarPoints >= targetGrammarPoints;

  return (
    <div className={`rounded-xl p-6 border transition-all ${
      isAllCompleted
        ? 'bg-surface border-border'
        : 'bg-surface border-border'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className={isAllCompleted ? 'text-pine' : 'text-accent'} strokeWidth={2} />
          <h3 className="font-semibold text-ink">今日目标</h3>
        </div>
        {isAllCompleted && (
          <div className="flex items-center gap-1 text-pine">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">已完成</span>
          </div>
        )}
      </div>

      {/* 例句进度 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-soft">学习例句</span>
          <span className="font-medium text-ink">
            {completedSentences} / {targetSentences}
            <span className="text-ink-mute ml-1">({getRemaining(completedSentences, targetSentences)})</span>
          </span>
        </div>
        <div className="w-full bg-surface-dim rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              completedSentences >= targetSentences
                ? 'bg-pine'
                : 'bg-accent/70'
            }`}
            style={{ width: `${sentenceProgress}%` }}
          />
        </div>
      </div>

      {/* 语法点进度 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-soft">学习语法点</span>
          <span className="font-medium text-ink">
            {completedGrammarPoints} / {targetGrammarPoints}
            <span className="text-ink-mute ml-1">({getRemaining(completedGrammarPoints, targetGrammarPoints)})</span>
          </span>
        </div>
        <div className="w-full bg-surface-dim rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              completedGrammarPoints >= targetGrammarPoints
                ? 'bg-pine'
                : 'bg-accent/70'
            }`}
            style={{ width: `${grammarProgress}%` }}
          />
        </div>
      </div>

      {/* 总体进度 */}
      {!isAllCompleted && overallProgress > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-soft">总体完成</span>
            <span className="font-bold text-accent">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-surface-dim rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent/60 to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          {overallProgress >= 50 && overallProgress < 100 && (
            <p className="text-sm text-pine mt-2">
              继续加油，快要完成今日目标了！
            </p>
          )}
        </div>
      )}

      {completedSentences === 0 && completedGrammarPoints === 0 && (
        <p className="text-sm text-ink-mute mt-2">
          今天还没有开始学习，现在就开始吧！
        </p>
      )}
    </div>
  );
}
