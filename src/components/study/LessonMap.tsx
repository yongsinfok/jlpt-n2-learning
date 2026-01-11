/**
 * 课程地图组件
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
 * 课程地图组件
 * 以路径形式展示所有课程，类似游戏关卡
 */
export function LessonMap({ lessons, onLessonClick, className = '' }: LessonMapProps) {
  if (lessons.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">暂无课程数据</p>
      </div>
    );
  }

  // 统计进度
  const completedCount = lessons.filter(l => l.isCompleted).length;
  const unlockedCount = lessons.filter(l => l.isUnlocked).length;
  const totalCount = lessons.length;

  return (
    <div className={className}>
      {/* 进度概览 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">学习进度</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-500">{completedCount}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-500">{unlockedCount}</div>
            <div className="text-sm text-gray-600">已解锁</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-700">{totalCount}</div>
            <div className="text-sm text-gray-600">总课程</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>总体进度</span>
            <span>{((completedCount / totalCount) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 课程地图 */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="relative">
            {/* 课程卡片 */}
            <LessonCard
              lesson={lesson}
              onClick={() => onLessonClick?.(lesson.id)}
            />

            {/* 连接线 */}
            {index < lessons.length - 1 && (
              <div className="flex justify-center">
                <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-600">已完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-gray-600">学习中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300"></div>
            <span className="text-gray-600">未解锁</span>
          </div>
        </div>
      </div>
    </div>
  );
}
