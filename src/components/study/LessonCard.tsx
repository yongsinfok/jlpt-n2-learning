/**
 * 课程卡片组件 - Glassmorphism Design with Japanese Colors
 */

import { Lock, CheckCircle2, Clock, Target, Flame } from 'lucide-react';
import type { Lesson } from '@/types';

export interface LessonCardProps {
  /** 课程数据 */
  lesson: Lesson;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 课程卡片组件 - Glassmorphism with Japanese Colors
 * 显示课程的解锁状态、完成度和基本信息
 */
export function LessonCard({ lesson, onClick, className = '' }: LessonCardProps) {
  const { id, grammarPoints, sentenceCount, isUnlocked, isCompleted, completionRate } = lesson;

  // 状态样式 - Japanese Color Palette
  const getStatusStyles = () => {
    if (!isUnlocked) {
      return {
        bg: 'glass-card-strong',
        border: 'border-sumi/20',
        text: 'text-sumi',
        icon: <Lock size={24} className="text-sumi-500" />,
        statusText: '未解锁',
        statusTextJa: 'ロック',
        accent: 'bg-sumi-500/10',
        iconBg: 'bg-sumi-500/10',
        glow: 'shadow-sumi/20',
      };
    }
    if (isCompleted) {
      return {
        bg: 'glass-card-strong',
        border: 'border-matcha/20',
        text: 'text-matcha-700',
        icon: <CheckCircle2 size={24} className="text-matcha-500" />,
        statusText: '已完成',
        statusTextJa: '完了',
        accent: 'bg-matcha-500/10',
        iconBg: 'bg-matcha-500/10',
        glow: 'shadow-matcha/20',
      };
    }
    return {
      bg: 'glass-card-strong',
      border: 'border-ai/20',
      text: 'text-ai-700',
      icon: <Clock size={24} className="text-ai-500" />,
      statusText: '学习中',
      statusTextJa: '学習中',
      accent: 'bg-ai-500/10',
      iconBg: 'bg-ai-500/10',
      glow: 'shadow-ai/20',
    };
  };

  const styles = getStatusStyles();
  const isClickable = isUnlocked;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
        ${styles.border} ${styles.bg}
        ${isClickable
          ? `hover-lift hover:scale-[1.02] hover:${styles.glow} active:scale-[0.98] cursor-pointer`
          : 'cursor-not-allowed opacity-60'
        }
        animate-spring-bounce
        ${className}
      `}
      style={{ animationDelay: `${id * 0.05}s` }}
    >
      {/* Decorative corner accents - Japanese style */}
      {isUnlocked && (
        <>
          <div className={`absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 rounded-tl-xl ${styles.text} opacity-30`} />
          <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 rounded-br-xl ${styles.text} opacity-30`} />
        </>
      )}

      {/* Status icon with glass effect */}
      <div className="absolute top-5 right-5">
        <div className={`p-2.5 rounded-xl ${styles.iconBg} backdrop-blur-md shadow-lg ${styles.text}`}>
          {styles.icon}
        </div>
      </div>

      {/* Lesson number with Japanese style */}
      <div className={`text-sm font-semibold mb-2 flex items-center gap-2 ${styles.text}`}>
        <span className="font-serif text-base">レッスン {id}</span>
        <span className="text-opacity-40">·</span>
        <span>第 {id} 课</span>
      </div>

      {/* Status badge - Sakura pink accent for active */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-5 font-bold text-lg ${styles.accent} ${styles.text} backdrop-blur-sm`}>
        <span>{styles.icon}</span>
        <span>{styles.statusText}</span>
      </div>

      {/* Stats grid - Glass cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-card-subtle rounded-xl p-3 hover-lift">
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} className="text-sumi-400" />
            <span className="text-xs text-sumi-500 font-medium">语法点</span>
          </div>
          <div className={`text-2xl font-bold ${styles.text}`}>
            {grammarPoints.length}
          </div>
        </div>
        <div className="glass-card-subtle rounded-xl p-3 hover-lift">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-sumi-400" />
            <span className="text-xs text-sumi-500 font-medium">例句</span>
          </div>
          <div className={`text-2xl font-bold ${styles.text}`}>
            {sentenceCount}
          </div>
        </div>
      </div>

      {/* Progress bar - Japanese gradient */}
      {isUnlocked && (
        <div className="mt-4">
          <div className="progress-bar h-3 glass-card-subtle">
            <div
              className={`progress-fill h-3 ${
                isCompleted
                  ? 'bg-gradient-to-r from-matcha-400 via-matcha-DEFAULT to-matcha-500'
                  : 'bg-gradient-to-r from-ai-400 via-ai-DEFAULT to-sakura-400'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-sumi-500 font-maru bg-washi/60 px-2 py-1 rounded-lg">
              {styles.statusTextJa}
            </div>
            <div className={`text-sm font-bold ${styles.text}`}>
              {completionRate.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Locked hint */}
      {!isUnlocked && (
        <div className="mt-4 text-sm text-sumi-500 text-center py-2 glass-card-subtle rounded-lg font-maru">
          前のレッスンを完了してください
        </div>
      )}

      {/* Sakura accent for unlocked lessons */}
      {isUnlocked && !isCompleted && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sakura-400 blur-sm opacity-60"></div>
      )}
    </button>
  );
}
