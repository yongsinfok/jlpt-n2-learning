/**
 * 课程列表页 - Modern Japanese Design
 * 玻璃态 + 黏土态风格
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
      <div className="min-h-screen washi-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载课程中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen washi-bg">
      {/* Hero Section - Modern */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full bg-seigaiha" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ai-50/80 via-white/60 to-matcha-50/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-sumi-400 mb-6 animate-fade-in">
              <Link to="/" className="hover:text-ai-DEFAULT transition-colors">首页</Link>
              <span>/</span>
              <span className="text-sumi-900">课程列表</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sumi-900 mb-4 tracking-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
              N2 学习之路
              <span className="text-ai-DEFAULT">。</span>
            </h1>
            <p className="text-xl text-sumi-600 mb-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
              循序渐进，系统掌握 N2 语法
            </p>
            <p className="text-sumi-400 animate-slide-up" style={{ animationDelay: '300ms' }}>
              一歩一歩、着実に日本語を身につけましょう
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stats - Modern Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-8">
          {/* Completed */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-matcha-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-matcha-100 to-matcha-50 rounded-2xl shadow-washi-sm">
                <CheckCircle2 className="w-6 h-6 text-matcha-DEFAULT" />
              </div>
              <span className="text-sm font-medium text-sumi-600">已完成</span>
            </div>
            <div className="text-4xl font-bold text-sumi-900">
              {lessons.filter(l => l.isCompleted).length}
            </div>
            <div className="text-xs text-sumi-400 mt-1">完了したレッスン</div>
          </div>

          {/* Unlocked */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-ai-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-ai-100 to-ai-50 rounded-2xl shadow-washi-sm">
                <BookOpen className="w-6 h-6 text-ai-DEFAULT" />
              </div>
              <span className="text-sm font-medium text-sumi-600">已解锁</span>
            </div>
            <div className="text-4xl font-bold text-sumi-900">
              {lessons.filter(l => l.isUnlocked).length}
            </div>
            <div className="text-xs text-sumi-400 mt-1">アンロック済み</div>
          </div>

          {/* Total */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-washi border border-sumi-100/50 p-6 hover:shadow-washi-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-sumi-100 to-sumi-50 rounded-2xl shadow-washi-sm">
                <Map className="w-6 h-6 text-sumi-DEFAULT" />
              </div>
              <span className="text-sm font-medium text-sumi-600">总课程</span>
            </div>
            <div className="text-4xl font-bold text-sumi-900">
              {lessons.length}
            </div>
            <div className="text-xs text-sumi-400 mt-1">全レッスン</div>
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
