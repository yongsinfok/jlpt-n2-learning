import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonCard } from '@/components/study';
import { getAllLessons } from '@/services/lessonService';
import type { Lesson } from '@/types';
import { Flame, Target, BookOpen, Brain, Zap } from 'lucide-react';

type LessonFilter = 'all' | 'inProgress' | 'completed';

const FILTER_TABS: { key: LessonFilter; label: string }[] = [
  { key: 'all',        label: '全部课程' },
  { key: 'inProgress', label: '进行中' },
  { key: 'completed',  label: '已完成' },
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

  const stats = useMemo(() => {
    const completed = lessons.filter((l) => l.isCompleted).length;
    const unlocked = lessons.filter((l) => l.isUnlocked).length;
    const inProgress = unlocked - completed;
    const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
    return { completed, unlocked, inProgress, progress, total: lessons.length };
  }, [lessons]);

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

  // Stat card helper
  const StatCard = ({ value, label, icon, accent }: { value: number | string; label: string; icon: React.ReactNode; accent: string }) => (
    <div className="noren-card flex flex-col items-center justify-center p-6 text-center">
      <div className={`mb-3 ${accent}`}>{icon}</div>
      <div className="font-mincho text-3xl sm:text-4xl text-ink mb-1">{value}</div>
      <div className="font-sans text-xs tracking-wider text-ink-mute uppercase">{label}</div>
    </div>
  );

  // ========================================
  // LOADING STATE
  // ========================================
  if (loading) {
    return (
      <div className="bg-bg min-h-screen">
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="max-w-4xl">
            <div className="noren-card p-8 mb-12">
              <div className="h-8 bg-ink-faint/30 rounded w-64 mb-4 animate-pulse" />
              <div className="h-5 bg-ink-faint/20 rounded w-[400px] animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="noren-card p-6">
                <div className="h-12 bg-ink-faint/20 rounded w-12 mx-auto mb-4 animate-pulse" />
                <div className="h-6 bg-ink-faint/20 rounded w-20 mx-auto animate-pulse" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="noren-card h-72 animate-pulse" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* ── Page title ─────────────────────────────── */}
        <div className="noren-card p-8 sm:p-10 mb-8">
          <div className="flex items-center gap-3 text-sm mb-6">
            <Link to="/" className="text-ink-mute hover:text-accent transition-colors flex items-center gap-2">
              <BookOpen size={16} />
              首页
            </Link>
            <span className="text-ink-faint">/</span>
            <span className="text-ink font-medium">课程列表</span>
          </div>

          <h1 className="font-mincho text-4xl sm:text-5xl lg:text-6xl text-ink mb-4">
            N2 学习路径
          </h1>

          <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl">
            系统化的语法学习。每一课都是迈向流利日语的关键一步。
          </p>

          {/* Mini progress row inside title card */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 w-40 progress-track">
                <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
              </div>
              <span className="font-mincho text-lg text-ink">{stats.progress}%</span>
            </div>
            <span className="text-ink-soft">{stats.completed} / {stats.total} 课已完成</span>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={stats.total}
            label="总课程数"
            icon={<BookOpen className="w-6 h-6" />}
            accent="text-accent"
          />
          <StatCard
            value={stats.completed}
            label="已完成"
            icon={<Target className="w-6 h-6" />}
            accent="text-pine"
          />
          <StatCard
            value={stats.inProgress}
            label="进行中"
            icon={<Brain className="w-6 h-6" />}
            accent="text-amber"
          />
          <StatCard
            value={`${stats.progress}%`}
            label="完成度"
            icon={<Flame className="w-6 h-6" />}
            accent="text-accent"
          />
        </div>

        {/* ── Filter tabs ────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTER_TABS.map(({ key, label }) => {
            const isActive = filter === key;
            const count = key === 'all' ? stats.total : stats[key];
            const activeStyles =
              key === 'all' ? 'bg-accent text-surface' :
              key === 'inProgress' ? 'bg-amber text-surface' :
              'bg-pine text-surface';
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? activeStyles
                    : 'bg-surface text-ink-soft hover:text-ink hover:bg-surface-hover border border-border'
                }`}
              >
                {label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Lesson grid ────────────────────────────── */}
        <section className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={lesson.isUnlocked ? `/lesson/${lesson.id}` : '#'}
                onClick={(e) => !lesson.isUnlocked && e.preventDefault()}
                className="block transition-transform hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <LessonCard lesson={lesson} />
              </Link>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="noren-card p-16 text-center">
              <Target className="w-16 h-16 text-ink-faint mx-auto mb-6" />
              <h3 className="font-mincho text-2xl text-ink mb-3">暂无课程</h3>
              <p className="text-base text-ink-soft">
                {filter === 'inProgress' && '开始学习第一课吧！'}
                {filter === 'completed' && '还没有完成的课程。'}
                {filter === 'all' && '课程即将推出。'}
              </p>
            </div>
          )}
        </section>

        {/* ── Motivational card ──────────────────────── */}
        {stats.progress < 100 && stats.inProgress > 0 && (
          <section className="pb-16">
            <div className="noren-card p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-accent-pale flex items-center justify-center flex-shrink-0">
                    <Flame className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-mincho text-2xl text-ink mb-2">
                      继续保持学习势头！
                    </h3>
                    <p className="text-sm text-ink-soft">
                      还有 <span className="text-accent font-bold">{stats.total - stats.completed}</span> 课待完成。坚持就是胜利。
                    </p>
                  </div>
                </div>
                <Link
                  to={`/lesson/${lessons.find((l) => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-surface font-medium text-sm hover:bg-accent-hover transition-colors"
                >
                  <Zap size={18} />
                  继续学习
                </Link>
              </div>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
