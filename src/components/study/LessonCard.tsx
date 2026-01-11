/**
 * 课程卡片组件 - Japanese Stamp Style
 */

import { Lock, CheckCircle2, Clock } from 'lucide-react';
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
 * 课程卡片组件 - Japanese Stamp Style
 * 显示课程的解锁状态、完成度和基本信息
 */
export function LessonCard({ lesson, onClick, className = '' }: LessonCardProps) {
  const { id, grammarPoints, sentenceCount, isUnlocked, isCompleted, completionRate } = lesson;

  // 状态样式 - Japanese Color Palette
  const getStatusStyles = () => {
    if (!isUnlocked) {
      return {
        bg: 'bg-sumi-50',
        border: 'border-sumi-200',
        text: 'text-sumi-500',
        icon: <Lock size={20} className="text-sumi-400" />,
        statusText: '未解锁',
        statusTextJa: 'ロック',
        accent: 'sumi',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-matcha-50',
        border: 'border-matcha-300',
        text: 'text-matcha-700',
        icon: <CheckCircle2 size={20} className="text-matcha-500" />,
        statusText: '已完成',
        statusTextJa: '完了',
        accent: 'matcha',
      };
    }
    return {
      bg: 'bg-ai-50',
      border: 'border-ai-300',
      text: 'text-ai-700',
      icon: <Clock size={20} className="text-ai-500" />,
      statusText: '学习中',
      statusTextJa: '学習中',
      accent: 'ai',
    };
  };

  const styles = getStatusStyles();
  const isClickable = isUnlocked;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-300 text-left
        ${styles.bg} ${styles.border}
        ${isClickable
          ? 'hover:shadow-washi-md hover:-translate-y-1 hover:border-opacity-100 cursor-pointer active:scale-[0.98]'
          : 'cursor-not-allowed opacity-70'
        }
        ${className}
      `}
    >
      {/* Decorative corner accents */}
      {isUnlocked && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-current opacity-20 rounded-tl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-current opacity-20 rounded-br-lg" />
        </>
      )}

      {/* Status icon with stamp effect */}
      <div className="absolute top-4 right-4">
        <div className={`p-1.5 rounded-lg bg-white/60 backdrop-blur-sm shadow-washi-sm ${styles.text}`}>
          {styles.icon}
        </div>
      </div>

      {/* Lesson number with Japanese style */}
      <div className={`text-xs font-medium ${styles.text} mb-1 flex items-center gap-2`}>
        <span className="font-serif">レッスン {id}</span>
        <span className="text-opacity-60">·</span>
        <span>课程 {id}</span>
      </div>

      {/* Status text */}
      <div className={`text-lg font-bold ${styles.text} mb-4 font-serif`}>
        {styles.statusText}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-sumi-400 text-xs mb-1">语法点</div>
          <div className={`font-semibold ${styles.text}`}>
            {grammarPoints.length} <span className="text-xs font-normal opacity-70">个</span>
          </div>
        </div>
        <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-sumi-400 text-xs mb-1">例句</div>
          <div className={`font-semibold ${styles.text}`}>
            {sentenceCount} <span className="text-xs font-normal opacity-70">个</span>
          </div>
        </div>
      </div>

      {/* Progress bar with brush effect */}
      {isUnlocked && (
        <div className="mt-3">
          <div className="brush-progress h-2">
            <div
              className={`brush-progress-bar ${
                styles.accent === 'matcha'
                  ? 'bg-gradient-to-r from-matcha-400 via-matcha-DEFAULT to-matcha-400'
                  : styles.accent === 'ai'
                    ? 'bg-gradient-to-r from-ai-400 via-ai-DEFAULT to-ai-400'
                    : 'bg-gradient-to-r from-sumi-400 via-sumi-DEFAULT to-sumi-400'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-sumi-400 font-maru">
              {styles.statusTextJa}
            </div>
            <div className={`text-xs font-semibold ${styles.text}`}>
              {completionRate.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Locked hint */}
      {!isUnlocked && (
        <div className="mt-3 text-xs text-sumi-400 text-center font-maru">
          前のレッスンを完了してください
        </div>
      )}
    </button>
  );
}
