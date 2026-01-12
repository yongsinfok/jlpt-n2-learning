/**
 * 课程地图组件 - Modern Japanese Design
 * Refined Washi Paper Aesthetic
 */

import { Link } from 'react-router-dom';
import type { Lesson } from '@/types';
import { Lock, CheckCircle2, BookOpen, ChevronRight, PlayCircle } from 'lucide-react';

export interface LessonMapProps {
  /** 课程列表 */
  lessons: Lesson[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 课程地图组件
 */
export function LessonMap({ lessons, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="card-paper p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4 text-sumi-300">📚</div>
          <p className="text-sumi-500 font-medium">暂无课程数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {lessons.map((lesson) => {
        const isLocked = !lesson.isUnlocked;
        const isCompleted = lesson.isCompleted;
        const isCurrent = !isLocked && !isCompleted && lesson.completionRate < 100;

        return (
          <Link
            key={lesson.id}
            to={isLocked ? '#' : `/lesson/${lesson.id}`}
            onClick={(e) => isLocked && e.preventDefault()}
            className={`
              group block relative p-5 rounded-xl border transition-all duration-300
              ${isLocked
                ? 'bg-sumi-50 border-sumi-100 cursor-not-allowed opacity-70'
                : isCompleted
                  ? 'bg-white border-matcha-200 hover:border-matcha-400 hover:shadow-paper-md'
                  : 'bg-white border-ai-200 hover:border-ai-400 hover:shadow-paper-lg transform hover:-translate-y-0.5'
              }
            `}
          >
            <div className="flex items-center justify-between">
              {/* Left: Icon and Info */}
              <div className="flex items-center gap-5">
                {/* Status Icon */}
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                  ${isLocked
                    ? 'bg-sumi-100 text-sumi-400'
                    : isCompleted
                      ? 'bg-matcha-50 text-matcha-600'
                      : 'bg-ai-50 text-ai-600 group-hover:bg-ai-600 group-hover:text-white'
                  }
                `}>
                  {isLocked ? (
                    <Lock size={20} />
                  ) : isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <BookOpen size={24} />
                  )}
                </div>

                {/* Lesson Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-bold text-lg ${isLocked ? 'text-sumi-500' : 'text-sumi-900'}`}>
                      课程 {lesson.id}
                    </h3>

                    {!isLocked && isCompleted && (
                      <span className="px-2 py-0.5 bg-matcha-100 text-matcha-700 text-xs font-semibold rounded">
                        已完成
                      </span>
                    )}
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-ai-100 text-ai-700 text-xs font-semibold rounded animate-pulse-soft">
                        进行中
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isLocked ? 'text-sumi-400' : 'text-sumi-500'}`}>
                    {lesson.grammarPoints.length} 个语法点 · {lesson.sentenceCount} 个例句
                  </p>
                </div>
              </div>

              {/* Right: Progress & Arrow */}
              <div className="flex items-center gap-6">
                {/* Progress */}
                {!isLocked && (
                  <div className="text-right hidden sm:block">
                    <div className="text-xl font-bold text-sumi-900 font-mono">
                      {Math.round(lesson.completionRate)}%
                    </div>
                  </div>
                )}

                {/* Arrow */}
                {!isLocked && (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'text-sumi-300' : 'text-ai-600 bg-ai-50 group-hover:bg-ai-600 group-hover:text-white'}
                  `}>
                    {isCurrent ? <PlayCircle size={20} /> : <ChevronRight size={20} />}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for active lessons */}
            {!isLocked && !isCompleted && lesson.completionRate > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-sumi-100 rounded-b-xl overflow-hidden">
                <div
                  className="h-full bg-ai-500 transition-all duration-500"
                  style={{ width: `${lesson.completionRate}%` }}
                />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
