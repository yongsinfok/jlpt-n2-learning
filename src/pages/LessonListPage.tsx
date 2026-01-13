/**
 * 课程列表页 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Map, Flame, Target } from 'lucide-react';

/**
 * 课程列表页面 - Modern Journey Map
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
      <div>
        {/* Loading Skeleton */}
        <section className="px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              {/* Title Skeleton */}
              <div className="h-12 bg-white/40 backdrop-blur-sm rounded-xl w-96 mx-auto mb-4 animate-pulse" />
              <div className="h-6 bg-white/30 backdrop-blur-sm rounded-xl w-64 mx-auto mb-8 animate-pulse" />

              {/* Stats Skeleton */}
              <div className="flex justify-center gap-8">
                <div className="w-32 h-32 rounded-2xl bg-white/30 backdrop-blur-sm animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded-lg w-48 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded-lg w-40 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Grid Skeleton */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass-card h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Modern Style */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left - Hero Text */}
            <div className="lg:col-span-7 animate-modern-fade">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-6 font-medium">
                <Link to="/" className="hover:text-primary transition-colors">首页</Link>
                <span className="text-text-muted">/</span>
                <span className="text-text-primary">学习之旅</span>
              </div>

              {/* Title */}
              <h1 className="text-display mb-6">
                N2 学习路径
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-8">
                系统化的语法学习。每一课都是迈向流利日语的关键一步。
              </p>

              {/* Stats Pills - Modern Badges */}
              <div className="flex flex-wrap gap-3">
                {stats.inProgress > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 glass-card-strong text-sm font-medium">
                    <Target className="w-4 h-4 text-primary" />
                    <span>进行中 <span className="font-mono">{stats.inProgress}</span> 课</span>
                  </div>
                )}
                {stats.completed > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 glass-card-strong text-sm font-medium">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>已完成 <span className="font-mono">{stats.completed}</span> 课</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Progress Display */}
            <div className="lg:col-span-5 animate-modern-fade stagger-1">
              <div className="glass-card-strong p-8 flex flex-col items-center justify-center">
                <div className="relative">
                  {/* Progress circle */}
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm shadow-glow">
                    <div className="text-center">
                      <span className="text-5xl font-display font-bold gradient-text">
                        {stats.progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-6 w-full mt-8 text-center">
                  <div>
                    <div className="text-2xl font-display font-semibold text-text-primary">{stats.completed}</div>
                    <div className="text-xs uppercase text-text-secondary mt-1">已完成</div>
                  </div>
                  <div>
                    <div className="text-2xl font-display font-semibold text-text-primary">{stats.inProgress}</div>
                    <div className="text-xs uppercase text-text-secondary mt-1">进行中</div>
                  </div>
                  <div>
                    <div className="text-2xl font-display font-semibold text-text-primary">{stats.total}</div>
                    <div className="text-xs uppercase text-text-secondary mt-1">总计</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">学习地图</h2>
              <p className="text-sm text-text-secondary">Learning Journey Map</p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="hidden md:flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md">
              全部
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-xl glass-card hover:bg-white/60 transition-all">
              未完成
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-xl glass-card hover:bg-white/60 transition-all">
              已完成
            </button>
          </div>
        </div>

        {/* Lesson Map Grid */}
        <LessonMap lessons={lessons} />
      </section>

      {/* Motivational Section */}
      {stats.progress < 100 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="glass-card-strong p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    继续保持学习势头！
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    还有 {stats.total - stats.completed} 课待完成。坚持就是胜利。
                  </p>
                </div>
              </div>

              <Link
                to={stats.unlocked > 0 ? `/lesson/${lessons.find(l => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}` : '#'}
                className="btn-modern-primary"
              >
                继续学习
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
