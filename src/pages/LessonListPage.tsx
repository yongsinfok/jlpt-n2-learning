/**
 * LessonListPage - Modern Clean Design
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { Map, Flame, Target, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

/**
 * LessonCard Component
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
      {/* Card Image Area */}
      <div className="aspect-video bg-neutral relative overflow-hidden">
        {lesson.isCompleted ? (
          <div className="absolute inset-0 bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
        ) : lesson.isUnlocked ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        ) : (
          <div className="absolute inset-0 bg-neutral-dark/5 flex items-center justify-center">
            <Lock className="w-8 h-8 text-neutral-dark" />
          </div>
        )}

        {/* Lesson Number Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary">第 {lesson.number} 课</span>
        </div>

        {/* Status Icon */}
        <div className="absolute top-3 right-3">
          {lesson.isCompleted ? (
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          ) : lesson.isUnlocked ? (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center">
              <Lock className="w-5 h-5 text-neutral-dark" />
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Title */}
        <h3 className="text-h1 text-primary mb-1 text-truncate-2">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-small text-neutral-dark mb-3 line-clamp-2">
          {lesson.description || '掌握本课语法点，提升日语表达能力'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-small text-neutral-dark">
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            {lesson.grammarPointCount || 4} 语法点
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {lesson.sentenceCount || 20} 例句
          </span>
        </div>

        {/* Progress Bar */}
        {lesson.isUnlocked && !lesson.isCompleted && (
          <div className="mt-3">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${lesson.progress || 0}%` }}
              />
            </div>
            <p className="text-xs text-neutral-dark mt-1">
              完成 {lesson.progress || 0}%
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        {/* Avatar */}
        <div className={`avatar ${lesson.id % 2 === 0 ? 'avatar-2' : ''}`}>
          {lesson.title?.charAt(0) || `L${lesson.id}`}
        </div>

        {/* Action Text */}
        <span className="text-small text-neutral-dark">
          {lesson.isCompleted ? '已完成' : lesson.isUnlocked ? '开始学习 →' : '待解锁'}
        </span>
      </div>
    </Link>
  );
}

/**
 * LessonListPage Component
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
        {/* Loading Skeleton */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <div className="h-8 bg-border rounded w-64 mb-4 animate-pulse" />
            <div className="h-4 bg-border rounded w-96 mb-8 animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-10 bg-border rounded mb-3" />
                <div className="h-8 bg-border rounded w-16 mb-2" />
                <div className="h-3 bg-border rounded w-20" />
              </div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-small text-neutral-dark mb-4">
                <Link to="/" className="hover:text-primary transition-colors">首页</Link>
                <span className="text-muted">/</span>
                <span className="text-primary">课程列表</span>
              </div>

              {/* Title */}
              <h1 className="text-h1 md:text-3xl font-bold text-primary mb-3">
                N2 学习路径
              </h1>
              <p className="text-body text-neutral-dark">
                系统化的语法学习。每一课都是迈向流利日语的关键一步。
              </p>
            </div>

            {/* Progress Card */}
            <div className="card p-6 min-w-[200px]">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {stats.progress}%
                </div>
                <p className="text-small text-neutral-dark mb-4">
                  {stats.completed} / {stats.total} 课已完成
                </p>
                <div className="flex justify-center gap-4">
                  <div>
                    <div className="text-lg font-semibold text-primary">{stats.inProgress}</div>
                    <div className="text-xs text-neutral-dark">进行中</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-primary">{stats.completed}</div>
                    <div className="text-xs text-neutral-dark">已完成</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
            <p className="text-small text-neutral-dark">总课程数</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">{stats.completed}</div>
            <p className="text-small text-neutral-dark">已完成</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">{stats.inProgress}</div>
            <p className="text-small text-neutral-dark">进行中</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-accent mb-1">{stats.progress}%</div>
            <p className="text-small text-neutral-dark">完成进度</p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 border-b border-border">
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

      {/* Lesson Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-neutral-dark mx-auto mb-4" />
            <h3 className="text-h1 text-primary mb-2">暂无课程</h3>
            <p className="text-body text-neutral-dark">
              {filter === 'inProgress' && '开始学习第一课吧！'}
              {filter === 'completed' && '还没有完成的课程。'}
              {filter === 'all' && '课程即将推出。'}
            </p>
          </div>
        )}
      </section>

      {/* Motivational Section */}
      {stats.progress < 100 && stats.inProgress > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-h1 text-primary">
                      继续保持学习势头！
                    </h3>
                    <p className="text-small text-neutral-dark mt-1">
                      还有 {stats.total - stats.completed} 课待完成。坚持就是胜利。
                    </p>
                  </div>
                </div>

                <Button variant="primary" asChild>
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
