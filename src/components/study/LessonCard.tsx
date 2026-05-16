import { Lock, CheckCircle2, Clock, Target, Flame } from 'lucide-react';
import type { Lesson } from '@/types';

export interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
  className?: string;
}

export function LessonCard({ lesson, onClick, className = '' }: LessonCardProps) {
  const { id, grammarPoints, sentenceCount, isUnlocked, isCompleted, completionRate } = lesson;

  const getStatusStyles = () => {
    if (!isUnlocked) {
      return {
        bg: 'bg-surface border border-border rounded-[10px] shadow-sm',
        border: 'border-border/50',
        text: 'text-ink',
        icon: <Lock size={24} className="text-ink-mute" />,
        statusText: '未解锁',
        statusTextJa: 'ロック',
        accent: 'bg-surface-dim',
        iconBg: 'bg-surface-dim',
        glow: 'shadow-sm',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-surface border border-border rounded-[10px] shadow-sm',
        border: 'border-pine/30',
        text: 'text-pine',
        icon: <CheckCircle2 size={24} className="text-pine" />,
        statusText: '已完成',
        statusTextJa: '完了',
        accent: 'bg-pine-pale',
        iconBg: 'bg-pine-pale',
        glow: 'shadow-sm',
      };
    }
    return {
      bg: 'bg-surface border border-border rounded-[10px] shadow-sm',
      border: 'border-accent/20',
      text: 'text-accent',
      icon: <Clock size={24} className="text-accent" />,
      statusText: '学习中',
      statusTextJa: '学習中',
      accent: 'bg-accent-pale',
      iconBg: 'bg-accent-pale',
      glow: 'shadow-sm',
    };
  };

  const styles = getStatusStyles();
  const isClickable = isUnlocked;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`
        relative p-6 rounded-[10px] border-2 transition-all duration-300 text-left
        ${styles.border} ${styles.bg}
        ${isClickable
          ? `hover:scale-[1.02] hover:${styles.glow} active:scale-[0.98] cursor-pointer`
          : 'cursor-not-allowed opacity-60'
        }
        ${className}
      `}
      style={{ animationDelay: `${id * 0.05}s` }}
    >
      {isUnlocked && (
        <>
          <div className={`absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 rounded-tl-[10px] ${styles.text} opacity-30`} />
          <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 rounded-br-[10px] ${styles.text} opacity-30`} />
        </>
      )}

      <div className="absolute top-5 right-5">
        <div className={`p-2.5 rounded-[10px] ${styles.iconBg} shadow-sm ${styles.text}`}>
          {styles.icon}
        </div>
      </div>

      <div className={`text-sm font-semibold mb-2 flex items-center gap-2 ${styles.text}`}>
        <span className="font-serif text-base">レッスン {id}</span>
        <span className="opacity-40">·</span>
        <span>第 {id} 课</span>
      </div>

      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-[8px] mb-5 font-bold text-lg ${styles.accent} ${styles.text}`}>
        <span>{styles.icon}</span>
        <span>{styles.statusText}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-dim border border-border rounded-[8px] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} className="text-ink-mute" />
            <span className="text-xs text-ink-soft font-medium">语法点</span>
          </div>
          <div className={`text-2xl font-bold ${styles.text}`}>
            {grammarPoints.length}
          </div>
        </div>
        <div className="bg-surface-dim border border-border rounded-[8px] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-ink-mute" />
            <span className="text-xs text-ink-soft font-medium">例句</span>
          </div>
          <div className={`text-2xl font-bold ${styles.text}`}>
            {sentenceCount}
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-4">
          <div className="h-3 bg-surface-dim rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full ${
                isCompleted
                  ? 'bg-pine'
                  : 'bg-accent'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-ink-mute bg-bg/60 px-2 py-1 rounded-[8px]">
              {styles.statusTextJa}
            </div>
            <div className={`text-sm font-bold ${styles.text}`}>
              {completionRate.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {!isUnlocked && (
        <div className="mt-4 text-sm text-ink-mute text-center py-2 bg-surface-dim border border-border rounded-[8px]">
          前のレッスンを完了してください
        </div>
      )}

      {isUnlocked && !isCompleted && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-soft blur-sm opacity-60"></div>
      )}
    </button>
  );
}
