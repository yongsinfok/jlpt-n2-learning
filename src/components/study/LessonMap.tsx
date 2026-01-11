/**
 * 课程地图组件 - Japanese Style
 * 以游戏关卡式的视觉设计展示所有课程
 */

import { LessonCard } from './LessonCard';
import type { Lesson } from '@/types';

export interface LessonMapProps {
  /** 课程列表 */
  lessons: Lesson[];
  /** 点击课程回调 */
  onLessonClick?: (lessonId: number) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 课程地图组件 - Japanese Style
 * 以路径形式展示所有课程，类似游戏关卡
 */
export function LessonMap({ lessons, onLessonClick, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="japanese-card p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-sumi-500 font-maru">暂无课程数据</p>
        </div>
      </div>
    );
  }

  // 统计进度
  const completedCount = lessons.filter(l => l.isCompleted).length;
  const unlockedCount = lessons.filter(l => l.isUnlocked).length;
  const totalCount = lessons.length;

  return (
    <div className={className}>
      {/* 课程地图 */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
            {/* 课程卡片 */}
            <LessonCard
              lesson={lesson}
              onClick={() => onLessonClick?.(lesson.id)}
            />

            {/* 连接线 - Japanese style */}
            {index < lessons.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-ai-300 via-ai-200 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 图例 - Japanese style */}
      <div className="mt-8 japanese-card p-6">
        <h3 className="font-serif text-lg text-sumi-DEFAULT mb-4 text-center">课程状态</h3>
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-matcha-DEFAULT shadow-stamp"></div>
            <span className="text-sumi-600">已完成</span>
            <span className="text-sumi-400 text-xs font-maru ml-1">完了</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-ai-DEFAULT shadow-stamp"></div>
            <span className="text-sumi-600">学习中</span>
            <span className="text-sumi-400 text-xs font-maru ml-1">学習中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sumi-200 shadow-stamp"></div>
            <span className="text-sumi-600">未解锁</span>
            <span className="text-sumi-400 text-xs font-maru ml-1">ロック</span>
          </div>
        </div>
      </div>
    </div>
  );
}
