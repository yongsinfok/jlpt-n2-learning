/**
 * 练习模式选择页面
 * Modern Japanese Design - Washi Aesthetic
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
  Target
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
  bgClass: string;
  borderClass: string;
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
      color: 'text-ai-600',
      bgClass: 'bg-ai-50 group-hover:bg-ai-100',
      borderClass: 'border-ai-200 group-hover:border-ai-300',
    },
    {
      id: 'choice',
      title: '选择题练习',
      description: '从多个选项中选择正确的语法点',
      icon: <HelpCircle className="w-8 h-8" />,
      type: 'choice',
      color: 'text-matcha-600',
      bgClass: 'bg-matcha-50 group-hover:bg-matcha-100',
      borderClass: 'border-matcha-200 group-hover:border-matcha-300',
    },
    {
      id: 'practice',
      title: '随机练习',
      description: '混合已学内容进行综合练习',
      icon: <Shuffle className="w-8 h-8" />,
      type: 'practice',
      color: 'text-kincha-600',
      bgClass: 'bg-kincha-50 group-hover:bg-kincha-100',
      borderClass: 'border-kincha-200 group-hover:border-kincha-300',
    },
    {
      id: 'wrong',
      title: '错题本复习',
      description: `复习做错的题目（当前 ${wrongAnswersCount} 道）`,
      icon: <BookX className="w-8 h-8" />,
      type: 'wrong',
      color: 'text-shu-600',
      bgClass: 'bg-shu-50 group-hover:bg-shu-100',
      borderClass: 'border-shu-200 group-hover:border-shu-300',
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
      <div className="min-h-screen flex items-center justify-center bg-washi-texture">
        <div className="text-center animate-pulse">
          <div className="text-ai-300 mb-2">● ● ●</div>
          <p className="text-sumi-500">正在准备练习数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-texture">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-full h-64 bg-seigaiha-faint opacity-50 -z-0 pointer-events-none fade-out-bottom" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-paper-sm mb-6 border border-sumi-100">
            <Target className="w-8 h-8 text-ai-600" />
          </div>
          <h1 className="text-4xl font-bold text-sumi-900 mb-4 tracking-tight">练习模式</h1>
          <p className="text-lg text-sumi-600">通过多样化的练习模式，巩固你的语法知识。</p>
        </div>

        {/* 筛选栏 - Paper Card Style */}
        <div className="card-paper p-6 mb-8 border-sumi-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${showFilter
                    ? 'bg-sumi-800 text-white shadow-lg'
                    : 'bg-white border border-sumi-200 text-sumi-700 hover:bg-sumi-50'
                  }`}
              >
                <Filter className="w-5 h-5" />
                筛选课程范围
              </button>

              {selectedLessons.length > 0 && (
                <span className="text-sm font-medium text-ai-600 bg-ai-50 px-3 py-1 rounded-full border border-ai-100">
                  已选 {selectedLessons.length} / {lessons.length} 门
                </span>
              )}
            </div>

            {selectedLessons.length > 0 && (
              <button
                onClick={() => setSelectedLessons([])}
                className="flex items-center gap-1.5 text-sm text-sumi-500 hover:text-shu-600 transition-colors px-2 py-1 rounded hover:bg-shu-50"
              >
                <X className="w-4 h-4" />
                清除选择
              </button>
            )}
          </div>

          {/* 课程选择面板 */}
          {showFilter && lessons.length > 0 && (
            <div className="mt-6 pt-6 border-t border-sumi-100 animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-sumi-800">选择练习范围：</span>
                <button
                  onClick={toggleAllLessons}
                  className="text-sm font-medium text-ai-600 hover:text-ai-800 hover:underline"
                >
                  {selectedLessons.length === lessons.length ? '取消全选' : '全选所有'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => toggleLesson(lesson.id)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${selectedLessons.includes(lesson.id)
                        ? 'bg-ai-600 text-white border-ai-600 shadow-md transform scale-105'
                        : 'bg-white text-sumi-600 border-sumi-200 hover:border-ai-300 hover:bg-ai-50'
                      }`}
                  >
                    课程 {lesson.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFilter && lessons.length === 0 && (
            <div className="mt-6 pt-6 border-t border-sumi-100 text-center py-4">
              <p className="text-sumi-500">
                尚未完成任何课程，请先学习课程内容。
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
              className={`
                group relative text-left p-6 sm:p-8 rounded-2xl transition-all duration-300
                border-2
                ${mode.type === 'wrong' && wrongAnswersCount === 0
                  ? 'bg-sumi-50 border-sumi-100 opacity-60 cursor-not-allowed grayscale'
                  : `bg-white hover:-translate-y-1 hover:shadow-paper-floating cursor-pointer ${mode.borderClass}`
                }
              `}
            >
              {/* Pattern Overlay on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl overflow-hidden">
                <div className={`w-full h-full bg-asanoha opacity-[0.03] ${mode.color.replace('text', 'bg')}`} />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-5">
                  <div className={`
                    p-4 rounded-xl transition-colors
                    ${mode.type === 'wrong' && wrongAnswersCount === 0 ? 'bg-sumi-200 text-sumi-400' : `${mode.bgClass} ${mode.color}`}
                  `}>
                    {mode.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-sumi-900 mb-2">{mode.title}</h3>
                    <p className="text-sumi-600 leading-relaxed max-w-xs">{mode.description}</p>
                  </div>
                </div>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all bg-sumi-50
                  ${mode.type === 'wrong' && wrongAnswersCount === 0 ? 'text-sumi-300' : 'group-hover:bg-sumi-900 group-hover:text-white text-sumi-400'}
                `}>
                  <ChevronRight size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 提示信息 */}
        {lessons.length === 0 && (
          <div className="mt-8 bg-kincha-50 border border-kincha-200 p-4 rounded-xl flex items-start gap-3">
            <div className="mt-0.5 text-kincha-600">
              <HelpCircle size={20} />
            </div>
            <p className="text-kincha-900 text-sm">
              <strong>提示：</strong>
              还没有已完成的课程。请先通过课程列表学习一些语法点，掌握基础后再来进行综合练习。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
