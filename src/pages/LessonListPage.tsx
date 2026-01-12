/**
 * 课程列表页 - Modern Japanese Editorial Style
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BookOpen, Lock, CheckCircle2, Circle } from 'lucide-react';

/**
 * 课程列表页面 - Japanese Style
 */
export function LessonListPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen washi-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载课程中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen washi-bg">
      {/* Hero Section - Modern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-ai-50 via-white to-matcha-50/30">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-ai-600 transition-colors">首页</Link>
              <span>/</span>
              <span className="text-gray-900">课程列表</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              N2 学习之路
              <span className="text-ai-600">。</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              循序渐进，系统掌握 N2 语法
            </p>
            <p className="text-gray-500">
              一歩一歩、着実に日本語を身につけましょう
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stats - Modern Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-8">
          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-matcha-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-matcha-600" />
              </div>
              <span className="text-sm text-gray-500">已完成</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {lessons.filter(l => l.isCompleted).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">完了したレッスン</div>
          </div>

          {/* Unlocked */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-ai-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-ai-600" />
              </div>
              <span className="text-sm text-gray-500">已解锁</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {lessons.filter(l => l.isUnlocked).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">アンロック済み</div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Circle className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm text-gray-500">总课程</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {lessons.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">全レッスン</div>
          </div>
        </div>
      </div>

      {/* Course Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <LessonMap lessons={lessons} />
      </div>
    </div>
  );
}
