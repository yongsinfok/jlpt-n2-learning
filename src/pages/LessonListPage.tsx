/**
 * 课程列表页 - Modern Japanese Design
 * Refined Washi Paper Aesthetic
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BookOpen, CheckCircle2, Map } from 'lucide-react';

/**
 * 课程列表页面
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
      <div className="min-h-screen bg-washi-texture flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载课程中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-texture">
      {/* Header Section */}
      <div className="bg-white border-b border-sumi-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-sumi-400 mb-6 font-medium">
              <Link to="/" className="hover:text-ai-600 transition-colors">首页</Link>
              <span>/</span>
              <span className="text-sumi-900">课程列表</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-sumi-900 mb-4 tracking-tight">
              N2 学习之路
            </h1>
            <p className="text-xl text-sumi-600">
              循序渐进，系统掌握 N2 语法。
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Completed */}
          <div className="card-paper p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-matcha-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-matcha-600" />
            </div>
            <div className="text-3xl font-bold text-sumi-900 mb-1">
              {lessons.filter(l => l.isCompleted).length}
            </div>
            <div className="text-sm font-medium text-sumi-500">已完成课程</div>
          </div>

          {/* Unlocked */}
          <div className="card-paper p-6 flex flex-col items-center text-center border-ai-200">
            <div className="w-12 h-12 rounded-full bg-ai-50 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-ai-600" />
            </div>
            <div className="text-3xl font-bold text-sumi-900 mb-1">
              {lessons.filter(l => l.isUnlocked).length}
            </div>
            <div className="text-sm font-medium text-sumi-500">进行中 / 已解锁</div>
          </div>

          {/* Total */}
          <div className="card-paper p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-sumi-50 flex items-center justify-center mb-3">
              <Map className="w-6 h-6 text-sumi-600" />
            </div>
            <div className="text-3xl font-bold text-sumi-900 mb-1">
              {lessons.length}
            </div>
            <div className="text-sm font-medium text-sumi-500">总课程数</div>
          </div>
        </div>
      </div>

      {/* Course Map List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LessonMap lessons={lessons} />
      </div>
    </div>
  );
}
