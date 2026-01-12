/**
 * 课程地图组件 - Modern Japanese Style
 * 以游戏关卡式的视觉设计展示所有课程
 */

import { Link } from 'react-router-dom';
import type { Lesson } from '@/types';
import { Lock, CheckCircle2, BookOpen } from 'lucide-react';

export interface LessonMapProps {
  /** 课程列表 */
  lessons: Lesson[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 课程地图组件 - Modern Japanese Style
 * 以路径形式展示所有课程，类似游戏关卡
 */
export function LessonMap({ lessons, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-500">暂无课程数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 课程地图 */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isLocked = !lesson.isUnlocked;
          const isCompleted = lesson.isCompleted;

          return (
            <Link
              key={lesson.id}
              to={isLocked ? '#' : `/lesson/${lesson.id}`}
              onClick={(e) => isLocked && e.preventDefault()}
              className={`
                block relative p-4 sm:p-6 rounded-xl border transition-all duration-200
                ${isLocked
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                  : isCompleted
                    ? 'bg-gradient-to-r from-matcha-50 to-white border-matcha-200 hover:shadow-md hover:border-matcha-300'
                    : 'bg-gradient-to-r from-ai-50 to-white border-ai-200 hover:shadow-md hover:border-ai-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon and Info */}
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isLocked
                      ? 'bg-gray-200'
                      : isCompleted
                        ? 'bg-matcha-100'
                        : 'bg-ai-100'
                    }
                  `}>
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-matcha-600" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-ai-600" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        课程 {lesson.id}
                      </h3>
                      {isLocked && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                          未解锁
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 bg-matcha-100 text-matcha-700 text-xs rounded-full">
                          已完成
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {lesson.grammarPoints.length} 个语法点 · {lesson.sentenceCount} 个例句
                    </p>
                  </div>
                </div>

                {/* Right: Progress & Arrow */}
                <div className="flex items-center gap-4">
                  {/* Progress */}
                  {!isLocked && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {Math.round(lesson.completionRate)}%
                      </div>
                      <div className="text-xs text-gray-500">完成度</div>
                    </div>
                  )}

                  {/* Arrow */}
                  {!isLocked && (
                    <div className="text-gray-400">
                      →
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
