/**
 * 课程列表页 - Japanese Editorial Style
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * 课程列表页面 - Japanese Style
 */
export function LessonListPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await getAllLessons();
      setLessons(data);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen washi-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载课程中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen washi-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-ai-100">
        {/* Decorative seigaiha pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            {/* Vertical decoration */}
            <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 vertical-text text-sumi-200 text-sm">
              N2 文法の道
            </div>

            <h1 className="font-serif display-display-lg text-sumi-DEFAULT mb-4 animate-slide-up">
              N2 学习之路
            </h1>
            <p className="text-sumi-500 text-lg mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              循序渐进，系统掌握 N2 语法
            </p>
            <p className="text-sumi-400 text-sm font-maru animate-slide-up" style={{ animationDelay: '150ms' }}>
              一歩一歩、着実に日本語を身につけましょう
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="japanese-card p-6 mb-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-serif font-bold text-ai-DEFAULT mb-1">
                {lessons.filter(l => l.isCompleted).length}
              </div>
              <div className="text-sm text-sumi-500">已完成</div>
              <div className="text-xs text-sumi-400 font-maru">完了</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-matcha-DEFAULT mb-1">
                {lessons.filter(l => l.isUnlocked).length}
              </div>
              <div className="text-sm text-sumi-500">已解锁</div>
              <div className="text-xs text-sumi-400 font-maru">アンロック</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-sumi-400 mb-1">
                {lessons.length}
              </div>
              <div className="text-sm text-sumi-500">总课程</div>
              <div className="text-xs text-sumi-400 font-maru">全レッスン</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Map */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <LessonMap lessons={lessons} onLessonClick={handleLessonClick} />
      </div>
    </div>
  );
}
