/**
 * 课程卡片组件
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
 * 课程卡片组件
 * 显示课程的解锁状态、完成度和基本信息
 */
export function LessonCard({ lesson, onClick, className = '' }: LessonCardProps) {
  const { id, grammarPoints, sentenceCount, isUnlocked, isCompleted, completionRate } = lesson;

  // 状态样式
  const getStatusStyles = () => {
    if (!isUnlocked) {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-500',
        icon: <Lock size={20} className="text-gray-400" />,
        statusText: '未解锁',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-700',
        icon: <CheckCircle2 size={20} className="text-green-500" />,
        statusText: '已完成',
      };
    }
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      icon: <Clock size={20} className="text-blue-500" />,
      statusText: '学习中',
    };
  };

  const styles = getStatusStyles();
  const isClickable = isUnlocked;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${styles.bg} ${styles.border}
        ${isClickable
          ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
          : 'cursor-not-allowed opacity-70'
        }
        ${className}
      `}
    >
      {/* 状态图标 */}
      <div className="absolute top-4 right-4">
        {styles.icon}
      </div>

      {/* 课程号 */}
      <div className={`text-sm font-medium ${styles.text} mb-2`}>
        课程 {id}
      </div>

      {/* 状态文本 */}
      <div className={`text-lg font-bold ${styles.text} mb-4`}>
        {styles.statusText}
      </div>

      {/* 统计信息 */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>语法点数量</span>
          <span className="font-medium">{grammarPoints.length} 个</span>
        </div>
        <div className="flex justify-between">
          <span>例句数量</span>
          <span className="font-medium">{sentenceCount} 个</span>
        </div>
      </div>

      {/* 进度条 */}
      {isUnlocked && completionRate > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {completionRate.toFixed(0)}%
          </div>
        </div>
      )}

      {/* 锁定提示 */}
      {!isUnlocked && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          请先完成前一课
        </div>
      )}
    </button>
  );
}
