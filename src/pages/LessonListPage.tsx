/**
 * LessonListPage - Glassmorphism Design with Japanese Colors
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonCard } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Flame, Target, CheckCircle2, BookOpen, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/common/Button';

/**
 * LessonListPage Component - Japanese Glassmorphism Design
 */
export function LessonListPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'inProgress' | 'completed'>('all');

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

  // Filter lessons
  const filteredLessons = useMemo(() => {
    switch (filter) {
      case 'inProgress':
        return lessons.filter(l => l.isUnlocked && !l.isCompleted);
      case 'completed':
        return lessons.filter(l => l.isCompleted);
      default:
        return lessons;
    }
  }, [lessons, filter]);

  // ========================================
  // LOADING STATE - Glassmorphism Design
  // ========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-washi bg-seigaiha">
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="max-w-4xl">
            {/* Title Skeleton */}
            <div className="glass-card-subtle rounded-2xl p-8 mb-12 animate-spring-bounce">
              <div className="h-8 bg-sumi/20 rounded-lg w-64 mb-4 animate-pulse" />
              <div className="h-5 bg-sumi/10 rounded-lg w-[400px] animate-pulse" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass-card-subtle rounded-2xl p-8 animate-spring-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-16 bg-sumi/10 rounded-lg mb-4 animate-pulse" />
                <div className="h-6 bg-sumi/10 rounded-lg w-20 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card-subtle rounded-2xl h-96 animate-spring-bounce"
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi bg-seigaiha">
      {/* ======================================== */}
      {/* HERO SECTION - Glassmorphism with Japanese Colors */}
      {/* ======================================== */}
      <section className="bg-washi bg-seigaiha border-b border-ai/10">
        <div className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            {/* Left: Title and breadcrumb */}
            <div className="max-w-3xl">
              {/* Breadcrumb - Glass style */}
              <div className="flex items-center gap-3 text-base mb-6 animate-fade-in-up">
                <Link
                  to="/"
                  className="text-sumi/60 hover:text-sakura transition-colors font-medium flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  首页
                </Link>
                <span className="text-sumi/40">/</span>
                <span className="text-sumi font-semibold">课程列表</span>
              </div>

              {/* Title - Large with Japanese accent */}
              <h1 className="text-5xl md:text-6xl font-bold text-sumi mb-5 animate-fade-in-up animate-delay-100">
                N2 学习路径
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-sumi/70 animate-fade-in-up animate-delay-200 leading-relaxed">
                系统化的语法学习。每一课都是迈向流利日语的关键一步。
              </p>
            </div>

            {/* Right: Progress Card - Glassmorphism */}
            <div className="glass-card-strong glass-glow rounded-2xl p-8 min-w-[320px] animate-spring-bounce animate-delay-300">
              <div className="text-center">
                {/* Main progress percentage */}
                <div className="text-6xl font-bold text-sumi mb-2">
                  {stats.progress}%
                </div>

                {/* Progress bar with Japanese gradient */}
                <div className="progress-bar h-3 glass-card-subtle mb-4">
                  <div
                    className="progress-fill-gradient h-3"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>

                {/* Sub stats */}
                <p className="text-lg text-sumi/70 mb-6">
                  {stats.completed} / {stats.total} 课已完成
                </p>

                {/* Quick stats */}
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-ai">{stats.inProgress}</div>
                    <div className="text-sm text-sumi/60 font-medium">进行中</div>
                  </div>
                  <div className="w-px bg-sumi/20"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-matcha">{stats.completed}</div>
                    <div className="text-sm text-sumi/60 font-medium">已完成</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================== */}
      {/* STATS CARDS - Glassmorphism with Bouncy Animations */}
      {/* ======================================== */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Lessons */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-ai flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">总课程数</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">{stats.total}</div>
            <div className="text-base text-sumi/60">50 课完整路径</div>
          </div>

          {/* Completed */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-matcha flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">已完成</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">{stats.completed}</div>
            <div className="text-base text-sumi/60">课程完成</div>
          </div>

          {/* In Progress */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-sakura flex items-center justify-center">
                <Brain className="w-7 h-7 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">进行中</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">{stats.inProgress}</div>
            <div className="text-base text-sumi/60">正在学习</div>
          </div>

          {/* Progress */}
          <div className="glass-card-strong p-8 animate-spring-bounce hover-lift" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gold flex items-center justify-center">
                <Target className="w-7 h-7 text-washi" />
              </div>
              <span className="text-lg font-semibold text-sumi">完成进度</span>
            </div>
            <div className="text-5xl font-bold text-sumi mb-2">{stats.progress}%</div>
            <div className="text-base text-sumi/60">总体进度</div>
          </div>
        </div>
      </section>

      {/* ======================================== */}
      {/* FILTER TABS - Glassmorphism */}
      {/* ======================================== */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="glass-card-subtle rounded-2xl p-2 inline-flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
              filter === 'all'
                ? 'bg-ai text-washi shadow-lg'
                : 'text-sumi/70 hover:text-sumi hover:bg-ai/10'
            }`}
          >
            全部课程 <span className="ml-1 opacity-70">({stats.total})</span>
          </button>
          <button
            onClick={() => setFilter('inProgress')}
            className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
              filter === 'inProgress'
                ? 'bg-sakura text-sumi shadow-lg'
                : 'text-sumi/70 hover:text-sumi hover:bg-sakura/10'
            }`}
          >
            进行中 <span className="ml-1 opacity-70">({stats.inProgress})</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
              filter === 'completed'
                ? 'bg-matcha text-washi shadow-lg'
                : 'text-sumi/70 hover:text-sumi hover:bg-matcha/10'
            }`}
          >
            已完成 <span className="ml-1 opacity-70">({stats.completed})</span>
          </button>
        </div>
      </section>

      {/* ======================================== */}
      {/* LESSON GRID - Staggered Animations */}
      {/* ======================================== */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={lesson.isUnlocked ? `/lesson/${lesson.id}` : '#'}
              onClick={(e) => !lesson.isUnlocked && e.preventDefault()}
            >
              <LessonCard lesson={lesson} />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="glass-card-strong rounded-2xl p-16 text-center animate-spring-bounce">
            <Target className="w-24 h-24 text-sumi/40 mx-auto mb-6 animate-pulse" />
            <h3 className="text-4xl font-bold text-sumi mb-4">暂无课程</h3>
            <p className="text-xl text-sumi/60">
              {filter === 'inProgress' && '开始学习第一课吧！'}
              {filter === 'completed' && '还没有完成的课程。'}
              {filter === 'all' && '课程即将推出。'}
            </p>
          </div>
        )}
      </section>

      {/* ======================================== */}
      {/* MOTIVATIONAL SECTION - Glassmorphism with Sakura Accent */}
      {/* ======================================== */}
      {stats.progress < 100 && stats.inProgress > 0 && (
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="glass-card-strong glass-glow rounded-2xl animate-spring-bounce">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left: Message */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-sakura-400 to-sakura-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sakura/30">
                    <Flame className="w-10 h-10 text-washi" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-sumi mb-3">
                      继续保持学习势头！
                    </h3>
                    <p className="text-lg text-sumi/70">
                      还有 <span className="text-sakura font-bold">{stats.total - stats.completed}</span> 课待完成。坚持就是胜利。
                    </p>
                  </div>
                </div>

                {/* Right: CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="!bg-sakura hover:!bg-sakura-dark shadow-lg shadow-sakura/30 px-8 py-4 text-lg"
                  asChild
                >
                  <Link
                    to={`/lesson/${lessons.find(l => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}`}
                    className="flex items-center gap-3"
                  >
                    <Zap size={24} />
                    继续学习
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
