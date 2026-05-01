import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonCard } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Flame, Target, BookOpen, Brain, Zap } from 'lucide-react';
import { BentoGrid, BentoCard, BentoStat, BentoCardHeader, BentoCardTitle, BentoCardBody } from '@/components/common/BentoGrid';

type LessonFilter = 'all' | 'inProgress' | 'completed';

const FILTER_TABS: { key: LessonFilter; label: string; activeClass: string; hoverClass: string }[] = [
  { key: 'all',        label: '全部课程', activeClass: 'bg-ai text-washi shadow-lg',     hoverClass: 'hover:bg-ai/10' },
  { key: 'inProgress', label: '进行中',   activeClass: 'bg-sakura text-sumi shadow-lg', hoverClass: 'hover:bg-sakura/10' },
  { key: 'completed',  label: '已完成',   activeClass: 'bg-matcha text-washi shadow-lg', hoverClass: 'hover:bg-matcha/10' },
];

export function LessonListPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LessonFilter>('all');

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
    const completed = lessons.filter((l) => l.isCompleted).length;
    const unlocked = lessons.filter((l) => l.isUnlocked).length;
    const inProgress = unlocked - completed;
    const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
    return { completed, unlocked, inProgress, progress, total: lessons.length };
  }, [lessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    switch (filter) {
      case 'inProgress':
        return lessons.filter((l) => l.isUnlocked && !l.isCompleted);
      case 'completed':
        return lessons.filter((l) => l.isCompleted);
      default:
        return lessons;
    }
  }, [lessons, filter]);

  // ========================================
  // LOADING STATE
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
          <BentoGrid variant="lg" className="mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <BentoCard key={i} className="animate-spring-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-16 bg-sumi/10 rounded-lg mb-4 animate-pulse" />
                <div className="h-6 bg-sumi/10 rounded-lg w-20 animate-pulse" />
              </BentoCard>
            ))}
          </BentoGrid>

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
      {/* HERO SECTION - Bento Grid Layout */}
      {/* ======================================== */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <BentoGrid variant="lg" className="mb-8">
          {/* Page Title Card */}
          <BentoCard variant="ai" colSpan={3} rowSpan={2}>
            <div className="p-8 md:p-10">
              {/* Breadcrumb */}
              <div className="flex items-center gap-3 text-base mb-6 animate-fade-in-up">
                <Link to="/" className="text-sumi/60 hover:text-sakura transition-colors font-medium flex items-center gap-2">
                  <BookOpen size={18} />
                  首页
                </Link>
                <span className="text-sumi/40">/</span>
                <span className="text-sumi font-semibold">课程列表</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sumi mb-4 animate-fade-in-up animate-delay-100">
                N2 学习路径
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-sumi/70 animate-fade-in-up animate-delay-200 leading-relaxed max-w-2xl">
                系统化的语法学习。每一课都是迈向流利日语的关键一步。
              </p>
            </div>
          </BentoCard>

          {/* Progress Card */}
          <BentoCard variant="featured" colSpan={3} rowSpan={2}>
            <BentoCardHeader>
              <BentoCardTitle>学习进度</BentoCardTitle>
            </BentoCardHeader>
            <BentoCardBody className="flex items-center justify-center">
              <div className="text-center">
                {/* Main progress percentage */}
                <div className="text-6xl md:text-7xl font-bold text-sumi mb-3">
                  {stats.progress}%
                </div>

                {/* Progress bar */}
                <div className="progress-bar h-3 glass-card-subtle mb-4">
                  <div
                    className="progress-fill-gradient h-3"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>

                {/* Sub stats */}
                <p className="text-lg text-sumi/70 mb-4">
                  {stats.completed} / {stats.total} 课已完成
                </p>

                {/* Quick stats */}
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <span className="text-2xl font-bold text-ai">{stats.inProgress}</span>
                    <div className="text-sumi/60">进行中</div>
                  </div>
                  <div className="w-px bg-sumi/20"></div>
                  <div>
                    <span className="text-2xl font-bold text-matcha">{stats.completed}</span>
                    <div className="text-sumi/60">已完成</div>
                  </div>
                </div>
              </div>
            </BentoCardBody>
          </BentoCard>
        </BentoGrid>

        {/* ======================================== */}
        {/* STATS BENTO GRID */}
        {/* ======================================== */}
        <BentoGrid variant="lg" className="mb-8">
          <BentoStat
            value={stats.total}
            label="总课程数"
            icon={<BookOpen className="w-7 h-7" />}
            iconVariant="ai"
          />

          <BentoStat
            value={stats.completed}
            label="已完成"
            icon={<Target className="w-7 h-7" />}
            iconVariant="matcha"
          />

          <BentoStat
            value={stats.inProgress}
            label="进行中"
            icon={<Brain className="w-7 h-7" />}
            iconVariant="sakura"
          />

          <BentoStat
            value={`${stats.progress}%`}
            label="完成度"
            icon={<Flame className="w-7 h-7" />}
            iconVariant="gold"
          />
        </BentoGrid>

        <section className="mb-8">
          <div className="glass-card-subtle rounded-2xl p-2 inline-flex gap-2">
            {FILTER_TABS.map(({ key, label, activeClass, hoverClass }) => {
              const isActive = filter === key;
              const count = key === 'all' ? stats.total : stats[key];
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${isActive ? activeClass : `text-sumi/70 hover:text-sumi ${hoverClass}`}`}
                >
                  {label} <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ======================================== */}
        {/* LESSON GRID - Staggered Animations */}
        {/* ======================================== */}
        <section className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={lesson.isUnlocked ? `/lesson/${lesson.id}` : '#'}
                onClick={(e) => !lesson.isUnlocked && e.preventDefault()}
                className="animate-spring-bounce"
                style={{ animationDelay: `${index * 0.05}s` }}
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
        {/* MOTIVATIONAL SECTION */}
        {/* ======================================== */}
        {stats.progress < 100 && stats.inProgress > 0 && (
          <section className="pb-16">
            <BentoGrid>
              <BentoCard variant="featured" colSpan="full">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400 to-sakura-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sakura/30">
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
                    <Link
                      to={`/lesson/${lessons.find((l) => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}`}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-sakura hover:bg-sakura-dark text-sumi font-bold text-lg shadow-lg shadow-sakura/30 transition-all hover:scale-105"
                    >
                      <Zap size={24} />
                      继续学习
                    </Link>
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>
        )}
      </section>
    </div>
  );
}
