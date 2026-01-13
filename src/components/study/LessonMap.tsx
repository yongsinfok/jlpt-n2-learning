/**
 * 课程地图组件 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

import { Link } from 'react-router-dom';
import type { Lesson } from '@/types';
import { Lock, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';

export interface LessonMapProps {
  /** 课程列表 */
  lessons: Lesson[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 课程地图组件 - Modern Glassmorphism Design
 */
export function LessonMap({ lessons, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="glass-card-strong p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-text-primary font-semibold">暂无课程数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {lessons.map((lesson) => {
        const isLocked = !lesson.isUnlocked;
        const isCompleted = lesson.isCompleted;

        return (
          <Link
            key={lesson.id}
            to={isLocked ? '#' : `/lesson/${lesson.id}`}
            onClick={(e) => isLocked && e.preventDefault()}
            className={`
              group block relative glass-card hover:shadow-glow transition-all duration-300
              ${isLocked
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:-translate-y-1'
              }
            `}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isLocked ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm text-text-secondary text-xs font-medium rounded-full border border-gray-200">
                  <Lock size={12} />
                  <span>锁定</span>
                </div>
              ) : isCompleted ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-success to-success/80 text-white text-xs font-medium rounded-full shadow-sm">
                  <CheckCircle2 size={12} fill="white" />
                  <span>完成</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium rounded-full shadow-sm">
                  <span>进行中</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex items-start gap-4 mb-4">
              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isLocked
                  ? 'bg-gray-100 text-gray-400'
                  : isCompleted
                    ? 'bg-gradient-to-br from-success/20 to-success/10 text-success'
                    : 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary'
                }
              `}>
                {isLocked ? (
                  <Lock size={24} />
                ) : isCompleted ? (
                  <CheckCircle2 size={28} fill="currentColor" />
                ) : (
                  <BookOpen size={28} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className={`font-display font-semibold text-lg mb-1 ${isLocked ? 'text-gray-400' : 'text-text-primary'}`}>
                  课程 {lesson.id}
                </h3>
                <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-text-secondary'}`}>
                  {lesson.grammarPoints.length} 语法点 · {lesson.sentenceCount} 例句
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {!isLocked && (
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-text-secondary mb-2">
                  <span>进度</span>
                  <span className="font-mono">{Math.round(lesson.completionRate)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                    style={{ width: `${lesson.completionRate}%` }}
                  />
                </div>
              </div>
            )}

            {/* Arrow */}
            {!isLocked && (
              <div className="flex items-center justify-end">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
