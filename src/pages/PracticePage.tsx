/**
 * 练习模式选择页面
 * 提供4种练习模式：填空练习、选择题练习、随机练习、错题本复习
 * 支持按课程范围筛选
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  Shuffle,
  BookX,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { db } from '@/db/schema';
import type { Lesson } from '@/types';

/** 练习模式 */
interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'fill' | 'choice' | 'practice' | 'wrong';
  color: string;
  bgLight: string;
}

export function PracticePage() {
  const navigate = useNavigate();

  // 状态
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 练习模式定义
  const practiceModes: PracticeMode[] = [
    {
      id: 'fill',
      title: '填空练习',
      description: '随机抽取例句，填写正确的语法点',
      icon: <FileText className="w-8 h-8" />,
      type: 'fill',
      color: 'text-primary',
      bgLight: 'bg-primary-light',
    },
    {
      id: 'choice',
      title: '选择题练习',
      description: '从多个选项中选择正确的语法点',
      icon: <HelpCircle className="w-8 h-8" />,
      type: 'choice',
      color: 'text-success',
      bgLight: 'bg-success-light',
    },
    {
      id: 'practice',
      title: '随机练习',
      description: '混合已学内容进行综合练习',
      icon: <Shuffle className="w-8 h-8" />,
      type: 'practice',
      color: 'text-warning',
      bgLight: 'bg-warning-light',
    },
    {
      id: 'wrong',
      title: '错题本复习',
      description: `复习做错的题目（当前 ${wrongAnswersCount} 道）`,
      icon: <BookX className="w-8 h-8" />,
      type: 'wrong',
      color: 'text-error',
      bgLight: 'bg-error-light',
    },
  ];

  // 加载课程列表和错题数量
  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取已完成的课程
        const progress = await db.userProgress.get('user_progress');
        const completedLessonIds = progress?.completedLessons || [];

        if (completedLessonIds.length > 0) {
          const lessonsData = await db.lessons
            .where('id')
            .anyOf(completedLessonIds)
            .toArray();
          setLessons(lessonsData);
        }

        // 获取错题数量
        const wrongAnswers = await db.wrongAnswers.where('resolved').equals(0).toArray();
        setWrongAnswersCount(wrongAnswers.length);

        setLoading(false);
      } catch (error) {
        console.error('加载数据失败:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 开始练习
  const handleStartPractice = (mode: PracticeMode) => {
    if (mode.type === 'wrong') {
      navigate('/wrong-answers');
      return;
    }

    // 构建查询参数
    const params = new URLSearchParams();
    params.set('type', mode.type);

    // 如果选择了特定课程，添加课程范围
    if (selectedLessons.length > 0) {
      // 对于练习模式，传递课程列表
      params.set('lessons', selectedLessons.join(','));
    }

    navigate(`/quiz?${params.toString()}`);
  };

  // 切换课程选择
  const toggleLesson = (lessonId: number) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  // 全选/取消全选
  const toggleAllLessons = () => {
    if (selectedLessons.length === lessons.length) {
      setSelectedLessons([]);
    } else {
      setSelectedLessons(lessons.map(l => l.id));
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">练习模式</h1>
          <p className="text-gray-600">选择一种练习模式来巩固你的学习成果</p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilter
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                筛选课程范围
              </button>

              {selectedLessons.length > 0 && (
                <span className="text-sm text-gray-600">
                  已选择 {selectedLessons.length} / {lessons.length} 门课程
                </span>
              )}
            </div>

            {selectedLessons.length > 0 && (
              <button
                onClick={() => setSelectedLessons([])}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
                清除筛选
              </button>
            )}
          </div>

          {/* 课程选择面板 */}
          {showFilter && lessons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">选择要练习的课程：</span>
                <button
                  onClick={toggleAllLessons}
                  className="text-sm text-primary hover:text-primary-hover"
                >
                  {selectedLessons.length === lessons.length ? '取消全选' : '全选'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => toggleLesson(lesson.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLessons.includes(lesson.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    课程 {lesson.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFilter && lessons.length === 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                暂无已完成的课程，请先完成一些课程后再进行练习。
              </p>
            </div>
          )}
        </div>

        {/* 练习模式卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practiceModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => handleStartPractice(mode)}
              disabled={mode.type === 'wrong' && wrongAnswersCount === 0}
              className={`bg-white rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg ${
                mode.type === 'wrong' && wrongAnswersCount === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${mode.bgLight} ${mode.color} p-3 rounded-lg`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.title}</h3>
                    <p className="text-gray-600 text-sm">{mode.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {/* 提示信息 */}
        {lessons.length === 0 && (
          <div className="mt-8 bg-warning-light border-l-4 border-warning p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>提示：</strong>
              还没有已完成的课程。请先通过课程列表学习一些语法点，然后再来练习吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
