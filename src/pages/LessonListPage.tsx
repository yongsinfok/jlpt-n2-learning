/**
 * 课程列表页 - 显示所有课程的地图式页面
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonMap } from '@/components/study';
import { getAllLessons } from '@/db/operations';
import type { Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * 课程列表页面
 */
export function LessonListPage() {
  const navigate = useNavigate();
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

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">N2 学习之路</h1>
        <p className="text-gray-600">循序渐进，系统掌握 N2 语法</p>
      </div>

      {/* 课程地图 */}
      <LessonMap lessons={lessons} onLessonClick={handleLessonClick} />
    </div>
  );
}
