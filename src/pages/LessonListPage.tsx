/**
 * 课程列表页 - Modern Japanese "Zen Glass" Design
 * Game-Style Journey Map Layout
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Map, Sparkles, Target, Flame, TrendingUp } from 'lucide-react';

/**
 * 课程列表页面 - 旅程地图风格
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

  // Calculate stats
  const stats = useMemo(() => {
    const completed = lessons.filter(l => l.isCompleted).length;
    const unlocked = lessons.filter(l => l.isUnlocked).length;
    const inProgress = unlocked - completed;
    const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
    return { completed, unlocked, inProgress, progress, total: lessons.length };
  }, [lessons]);

  if (loading) {
    return (
      <div className="min-h-screen bg-washi-texture">
        {/* Hero Section Skeleton */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-ai-50/30 to-transparent" />
          <div className="absolute inset-0 bg-seigaiha-subtle opacity-60" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl space-y-6">
              {/* Breadcrumb Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-sumi-100 rounded w-16 animate-pulse" />
                <div className="h-4 bg-sumi-50 rounded w-4 animate-pulse" />
                <div className="h-4 bg-sumi-100 rounded w-20 animate-pulse" />
              </div>

              {/* Title Skeleton */}
              <div className="h-12 bg-sumi-100 rounded w-96 animate-pulse" />
              <div className="h-6 bg-sumi-50 rounded w-64 animate-pulse" />

              {/* Progress Ring Skeleton */}
              <div className="flex items-center gap-8 mt-8">
                <div className="w-32 h-32 rounded-full bg-sumi-50 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-sumi-100 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-sumi-50 rounded w-40 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-texture">
      {/* Hero Section - Journey Progress */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-ai-50/30 to-transparent" />
        <div className="absolute inset-0 bg-seigaiha-subtle opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left - Hero Text */}
            <div className="lg:col-span-7 animate-fade-in-up">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-sumi-400 mb-6 font-medium">
                <Link to="/" className="hover:text-ai-600 transition-colors">首页</Link>
                <span className="text-sumi-300">/</span>
                <span className="text-sumi-700">学习之旅</span>
              </div>

              {/* Title */}
              <h1 className="text-h1 font-display font-bold text-gradient mb-4">
                N2 学习之路
              </h1>
              <p className="text-xl text-sumi-600 leading-relaxed max-w-2xl mb-8">
                循序渐进，系统掌握 N2 语法。每一课都是通往流利日语的里程碑。
              </p>

              {/* Journey Stats Pills */}
              <div className="flex flex-wrap gap-3">
                {stats.inProgress > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-ai-50/80 backdrop-blur rounded-xl border border-ai-200/50 text-ai-800 text-sm font-semibold shadow-sm">
                    <Target className="w-4 h-4 text-ai-600" />
                    <span>进行中 <span className="font-bold">{stats.inProgress}</span> 课</span>
                  </div>
                )}
                {stats.completed > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-matcha-50/80 backdrop-blur rounded-xl border border-matcha-200/50 text-matcha-800 text-sm font-semibold shadow-sm">
                    <Sparkles size={16} className="fill-matcha-600" />
                    <span>已完成 <span className="font-bold">{stats.completed}</span> 课</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Progress Circle */}
            <div className="lg:col-span-5 animate-fade-in-up stagger-2">
              <div className="glass-card p-8 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ai-200 to-matcha-200 rounded-full blur-2xl opacity-30 animate-pulse-soft" />

                  {/* Progress Ring SVG */}
                  <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-sumi-100"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - stats.progress / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(42, 74, 122, 0.2))' }}
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#55721C" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center percentage */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-ai-700 font-display">
                      {stats.progress}%
                    </span>
                    <span className="text-xs text-sumi-400 uppercase tracking-wider mt-1">完成度</span>
                  </div>
                </div>

                {/* Quick stats below */}
                <div className="grid grid-cols-3 gap-6 w-full mt-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-matcha-600 font-display">{stats.completed}</div>
                    <div className="text-[10px] text-sumi-400 uppercase mt-1">已完成</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-ai-600 font-display">{stats.inProgress}</div>
                    <div className="text-[10px] text-sumi-400 uppercase mt-1">进行中</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sumi-600 font-display">{stats.total}</div>
                    <div className="text-[10px] text-sumi-400 uppercase mt-1">总计</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-100 to-ai-50 flex items-center justify-center">
              <Map className="w-5 h-5 text-ai-700" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-sumi-900">学习地图</h2>
              <p className="text-sm text-sumi-400">Learning Journey Map</p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="hidden md:flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-ai-50 text-ai-700 border border-ai-200">
              全部
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-sumi-500 hover:bg-sumi-50 transition-colors">
              未完成
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-sumi-500 hover:bg-sumi-50 transition-colors">
              已完成
            </button>
          </div>
        </div>

        {/* Lesson Map Grid */}
        <LessonMap lessons={lessons} />
      </section>

      {/* Motivational Section */}
      {stats.progress < 100 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-asanoha-pattern opacity-20 rounded-bl-full" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-kincha-100 to-kincha-50 flex items-center justify-center shadow-sm">
                  <Flame className="w-7 h-7 text-kincha-600 animate-float" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-sumi-900">
                    继续保持学习势头！
                  </h3>
                  <p className="text-sm text-sumi-500 mt-1">
                    还有 {stats.total - stats.completed} 课待完成，坚持就是胜利。
                  </p>
                </div>
              </div>

              <Link
                to={stats.unlocked > 0 ? `/lesson/${lessons.find(l => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}` : '#'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-ai-700 to-ai-600 hover:from-ai-800 hover:to-ai-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <TrendingUp size={18} />
                继续学习
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Decorative bottom pattern */}
      <div className="h-12 bg-asanoha-pattern opacity-40" />
    </div>
  );
}
