import { Link } from 'react-router-dom';
import type { Lesson } from '@/types';
import { Lock, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';

export interface LessonMapProps {
  lessons: Lesson[];
  className?: string;
}

export function LessonMap({ lessons, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-surface border border-border rounded-[10px] shadow-sm p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-ink font-semibold">暂无课程数据</p>
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
              group block relative bg-surface border border-border rounded-[10px] shadow-sm transition-all duration-300
              ${isLocked
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-md hover:-translate-y-1'
              }
            `}
          >
            <div className="absolute top-4 right-4">
              {isLocked ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dim/80 text-ink-soft text-xs font-medium rounded-full border border-border">
                  <Lock size={12} />
                  <span>锁定</span>
                </div>
              ) : isCompleted ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pine text-white text-xs font-medium rounded-full shadow-sm">
                  <CheckCircle2 size={12} fill="white" />
                  <span>完成</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-sm">
                  <span>进行中</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className={`
                w-14 h-14 rounded-[10px] flex items-center justify-center transition-all duration-300
                ${isLocked
                  ? 'bg-surface-dim text-ink-faint'
                  : isCompleted
                    ? 'bg-pine-pale text-pine'
                    : 'bg-accent-pale text-accent'
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

              <div className="flex-1">
                <h3 className={`font-display font-semibold text-lg mb-1 ${isLocked ? 'text-ink-faint' : 'text-ink'}`}>
                  课程 {lesson.id}
                </h3>
                <p className={`text-sm ${isLocked ? 'text-ink-faint' : 'text-ink-soft'}`}>
                  {lesson.grammarPoints.length} 语法点 · {lesson.sentenceCount} 例句
                </p>
              </div>
            </div>

            {!isLocked && (
              <div className="mb-4">
                <div className="flex justify-between text-xs font-medium text-ink-soft mb-2">
                  <span>进度</span>
                  <span className="font-mono">{Math.round(lesson.completionRate)}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-dim overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{ width: `${lesson.completionRate}%` }}
                  />
                </div>
              </div>
            )}

            {!isLocked && (
              <div className="flex items-center justify-end">
                <div className="w-10 h-10 rounded-[8px] bg-accent flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
