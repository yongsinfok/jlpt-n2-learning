/**
 * LessonListPage - Spacious User-Friendly Design
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Map, Flame, Target, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

/**
 * LessonCard Component - MUCH LARGER
 */
interface LessonCardProps {
  lesson: Lesson;
}

function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link
      to={lesson.isUnlocked ? `/lesson/${lesson.id}` : '#'}
      className={`card group ${!lesson.isUnlocked ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* Card Image Area - Larger */}
      <div className="aspect-video bg-neutral relative overflow-hidden">
        {lesson.isCompleted ? (
          <div className="absolute inset-0 bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-20 h-20 text-success" />
          </div>
        ) : lesson.isUnlocked ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        ) : (
          <div className="absolute inset-0 bg-neutral-dark/5 flex items-center justify-center">
            <Lock className="w-16 h-16 text-neutral-dark" />
          </div>
        )}

        {/* Lesson Number Badge - Larger */}
        <div className="absolute top-6 left-6">
          <span className="badge badge-primary text-base px-5 py-2.5">第 {lesson.number} 课</span>
        </div>

        {/* Status Icon - Larger */}
        <div className="absolute top-6 right-6">
          {lesson.isCompleted ? (
            <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
          ) : lesson.isUnlocked ? (
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <Flame className="w-9 h-9 text-white" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-neutral flex items-center justify-center">
              <Lock className="w-9 h-9 text-neutral-dark" />
            </div>
          )}
        </div>
      </div>

      {/* Card Body - More padding */}
      <div className="card-body">
        {/* Title - Larger */}
        <h3 className="text-2xl font-bold text-primary mb-3 text-truncate-2">
          {lesson.title}
        </h3>

        {/* Description - Larger */}
        <p className="text-lg text-neutral-dark mb-6 line-clamp-2">
          {lesson.description || '掌握本课语法点，提升日语表达能力'}
        </p>

        {/* Stats - Larger */}
        <div className="flex items-center gap-6 text-lg text-neutral-dark mb-4">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {lesson.grammarPointCount || 4} 语法点
          </span>
          <span className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            {lesson.sentenceCount || 20} 例句
          </span>
        </div>

        {/* Progress Bar - Taller */}
        {lesson.isUnlocked && !lesson.isCompleted && (
          <div className="mt-4">
            <div className="progress-bar h-3">
              <div
                className="progress-fill h-3"
                style={{ width: `${lesson.progress || 0}%` }}
              />
            </div>
            <p className="text-base text-neutral-dark mt-2 font-semibold">
              完成 {lesson.progress || 0}%
            </p>
          </div>
        )}
      </div>

      {/* Card Footer - More padding */}
      <div className="card-footer">
        {/* Avatar - Already updated in CSS */}
        <div className={`avatar ${lesson.id % 2 === 0 ? 'avatar-2' : ''}`}>
          {lesson.title?.charAt(0) || `L${lesson.id}`}
        </div>

        {/* Action Text - Larger */}
        <span className="text-lg font-medium text-primary">
          {lesson.isCompleted ? '已完成' : lesson.isUnlocked ? '开始学习 →' : '待解锁'}
        </span>
      </div>
    </Link>
  );
}

/**
 * LessonListPage Component - Spacious & User-Friendly
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral">
        {/* Loading Skeleton - FULL WIDTH */}
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="max-w-4xl">
            <div className="h-12 bg-border rounded-lg w-80 mb-6 animate-pulse" />
            <div className="h-6 bg-border rounded-lg w-[500px] mb-12 animate-pulse" />
          </div>

          {/* Stats Skeleton - 2 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-8 animate-pulse">
                <div className="h-16 bg-border rounded-lg mb-4" />
                <div className="h-12 bg-border rounded-lg w-24 mb-3" />
                <div className="h-5 bg-border rounded-lg w-32" />
              </div>
            ))}
          </div>

          {/* Cards Skeleton - 2-3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-96 animate-pulse" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section - FULL WIDTH */}
      <section className="bg-white border-b border-border">
        <div className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl">
              {/* Breadcrumb - Larger */}
              <div className="flex items-center gap-3 text-base text-neutral-dark mb-5">
                <Link to="/" className="hover:text-primary transition-colors font-semibold">首页</Link>
                <span className="text-muted">/</span>
                <span className="text-primary font-semibold">课程列表</span>
              </div>

              {/* Title - Much Larger */}
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
                N2 学习路径
              </h1>
              <p className="text-xl text-neutral-dark">
                系统化的语法学习。每一课都是迈向流利日语的关键一步。
              </p>
            </div>

            {/* Progress Card - Larger */}
            <div className="card p-8 min-w-[300px]">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {stats.progress}%
                </div>
                <p className="text-lg text-neutral-dark mb-6">
                  {stats.completed} / {stats.total} 课已完成
                </p>
                <div className="flex justify-center gap-8">
                  <div>
                    <div className="text-3xl font-bold text-primary">{stats.inProgress}</div>
                    <div className="text-base text-neutral-dark">进行中</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{stats.completed}</div>
                    <div className="text-base text-neutral-dark">已完成</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards - FULL WIDTH, 2 columns on desktop */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.total}</div>
            <p className="text-lg text-neutral-dark">总课程数</p>
          </div>
          <div className="card p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.completed}</div>
            <p className="text-lg text-neutral-dark">已完成</p>
          </div>
          <div className="card p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.inProgress}</div>
            <p className="text-lg text-neutral-dark">进行中</p>
          </div>
          <div className="card p-6">
            <div className="text-4xl font-bold text-accent mb-2">{stats.progress}%</div>
            <p className="text-lg text-neutral-dark">完成进度</p>
          </div>
        </div>
      </section>

      {/* Filter Tabs - FULL WIDTH */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8 border-b-2 border-border">
          <button
            onClick={() => setFilter('all')}
            className={`nav-tab ${filter === 'all' ? 'active' : ''}`}
          >
            全部课程 ({stats.total})
          </button>
          <button
            onClick={() => setFilter('inProgress')}
            className={`nav-tab ${filter === 'inProgress' ? 'active' : ''}`}
          >
            进行中 ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`nav-tab ${filter === 'completed' ? 'active' : ''}`}
          >
            已完成 ({stats.completed})
          </button>
        </div>
      </section>

      {/* Lesson Grid - 2-3 COLUMNS FOR LARGER CARDS with entrance animations */}
      <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-24">
            <Target className="w-24 h-24 text-neutral-dark mx-auto mb-6 animate-bounce" />
            <h3 className="text-4xl font-bold text-primary mb-4">暂无课程</h3>
            <p className="text-xl text-neutral-dark">
              {filter === 'inProgress' && '开始学习第一课吧！'}
              {filter === 'completed' && '还没有完成的课程。'}
              {filter === 'all' && '课程即将推出。'}
            </p>
          </div>
        )}
      </section>

      {/* Motivational Section - FULL WIDTH */}
      {stats.progress < 100 && stats.inProgress > 0 && (
        <section className="w-full max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-primary mb-2">
                      继续保持学习势头！
                    </h3>
                    <p className="text-lg text-neutral-dark">
                      还有 {stats.total - stats.completed} 课待完成。坚持就是胜利。
                    </p>
                  </div>
                </div>

                <Button variant="primary" size="lg" asChild>
                  <Link to={`/lesson/${lessons.find(l => l.isUnlocked && !l.isCompleted)?.id || lessons[0]?.id}`}>
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
