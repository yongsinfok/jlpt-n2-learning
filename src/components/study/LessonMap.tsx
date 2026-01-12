/**
 * 课程地图组件 - Modern Japanese Design
 * 以游戏关卡式的视觉设计展示所有课程
 * 玻璃态 + 黏土态风格
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
 * 课程地图组件
 */
export function LessonMap({ lessons, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-sumi-100 p-8 max-w-md mx-auto">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-sumi-500">暂无课程数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 课程地图 */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isLocked = !lesson.isUnlocked;
          const isCompleted = lesson.isCompleted;

          return (
            <Link
              key={lesson.id}
              to={isLocked ? '#' : `/lesson/${lesson.id}`}
              onClick={(e) => isLocked && e.preventDefault()}
              className={`
                group block relative p-4 sm:p-5 rounded-2xl border transition-all duration-200
                ${isLocked
                  ? 'bg-sumi-50/50 border-sumi-100 cursor-not-allowed opacity-50'
                  : isCompleted
                    ? 'bg-gradient-to-r from-matcha-50 to-white/90 backdrop-blur border-matcha-200 hover:shadow-washi-md hover:border-matcha-300 hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-ai-50 to-white/90 backdrop-blur border-ai-200 hover:shadow-washi-md hover:border-ai-300 hover:-translate-y-0.5'
                }
              `}
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon and Info */}
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center shadow-washi-sm
                    ${isLocked
                      ? 'bg-sumi-100'
                      : isCompleted
                        ? 'bg-matcha-100'
                        : 'bg-ai-100'
                    }
                  `}>
                    {isLocked ? (
                      <Lock className="w-7 h-7 text-sumi-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-matcha-DEFAULT" />
                    ) : (
                      <BookOpen className="w-7 h-7 text-ai-DEFAULT" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sumi-900 text-lg">
                        课程 {lesson.id}
                      </h3>
                      {isLocked && (
                        <span className="px-2.5 py-1 bg-sumi-200 text-sumi-600 text-xs font-semibold rounded-full">
                          未解锁
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-1 bg-matcha-100 text-matcha-700 text-xs font-semibold rounded-full">
                          已完成
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-sumi-500">
                      {lesson.grammarPoints.length} 个语法点 · {lesson.sentenceCount} 个例句
                    </p>
                  </div>
                </div>

                {/* Right: Progress & Arrow */}
                <div className="flex items-center gap-4">
                  {/* Progress */}
                  {!isLocked && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-sumi-900">
                        {Math.round(lesson.completionRate)}%
                      </div>
                      <div className="text-xs text-sumi-400">完成度</div>
                    </div>
                  )}

                  {/* Arrow */}
                  {!isLocked && (
                    <div className="text-sumi-300 group-hover:text-ai-DEFAULT group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-6 h-6" />
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
