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

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'fill' | 'choice' | 'practice' | 'wrong';
}

export function PracticePage() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const practiceModes: PracticeMode[] = [
    {
      id: 'fill',
      title: '填空练习',
      description: '随机抽取例句，填写正确的语法点',
      icon: <FileText className="w-8 h-8" />,
      type: 'fill',
    },
    {
      id: 'choice',
      title: '选择题练习',
      description: '从多个选项中选择正确的语法点',
      icon: <HelpCircle className="w-8 h-8" />,
      type: 'choice',
    },
    {
      id: 'practice',
      title: '随机练习',
      description: '混合已学内容进行综合练习',
      icon: <Shuffle className="w-8 h-8" />,
      type: 'practice',
    },
    {
      id: 'wrong',
      title: '错题本复习',
      description: `复习做错的题目（当前 ${wrongAnswersCount} 道）`,
      icon: <BookX className="w-8 h-8" />,
      type: 'wrong',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const progress = await db.userProgress.get('user_progress');
        const completedLessonIds = progress?.completedLessons || [];

        if (completedLessonIds.length > 0) {
          const lessonsData = await db.lessons
            .where('id')
            .anyOf(completedLessonIds)
            .toArray();
          setLessons(lessonsData);
        }

        const wrongAnswers = await db.wrongAnswers.where('resolved').equals(0).toArray();
        setWrongAnswersCount(wrongAnswers.length);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStartPractice = (mode: PracticeMode) => {
    if (mode.type === 'wrong') {
      navigate('/wrong-answers');
      return;
    }

    const params = new URLSearchParams();
    params.set('type', mode.type);

    if (selectedLessons.length > 0) {
      params.set('lessons', selectedLessons.join(','));
    }

    navigate(`/quiz?${params.toString()}`);
  };

  const toggleLesson = (lessonId: number) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const toggleAllLessons = () => {
    if (selectedLessons.length === lessons.length) {
      setSelectedLessons([]);
    } else {
      setSelectedLessons(lessons.map(l => l.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto rounded-md bg-border/30 animate-pulse mb-6" />
            <div className="h-10 bg-border/30 rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-border/30 rounded w-80 mx-auto animate-pulse" />
          </div>

          <div className="noren-card p-6 mb-8">
            <div className="h-10 bg-border/30 rounded-lg w-32 animate-pulse mb-4" />
            <div className="h-10 bg-border/30 rounded-lg w-24 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="noren-card h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-surface shadow-sm mb-6">
            <Target className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-mincho text-ink mb-4">练习模式</h1>
          <p className="text-base text-ink-soft">通过多样化的练习模式，巩固你的语法知识。</p>
        </div>

        <div className="noren-card p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all ${
                  showFilter
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border text-ink hover:bg-bg-warm'
                }`}
              >
                <Filter className="w-5 h-5" />
                筛选课程范围
              </button>

              {selectedLessons.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-pale text-accent">
                  已选 {selectedLessons.length} / {lessons.length} 门
                </span>
              )}
            </div>

            {selectedLessons.length > 0 && (
              <button
                onClick={() => setSelectedLessons([])}
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/10"
              >
                <X className="w-4 h-4" />
                清除选择
              </button>
            )}
          </div>

          {showFilter && lessons.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold font-mincho text-ink">选择练习范围：</span>
                <button
                  onClick={toggleAllLessons}
                  className="text-sm font-medium text-ink hover:underline"
                >
                  {selectedLessons.length === lessons.length ? '取消全选' : '全选所有'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => toggleLesson(lesson.id)}
                    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all border ${
                      selectedLessons.includes(lesson.id)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface text-ink-soft border-border hover:border-ink-soft hover:bg-bg-warm'
                    }`}
                  >
                    课程 {lesson.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFilter && lessons.length === 0 && (
            <div className="mt-6 pt-6 border-t border-border text-center py-4">
              <p className="text-ink-soft">
                尚未完成任何课程，请先学习课程内容。
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practiceModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => handleStartPractice(mode)}
              disabled={mode.type === 'wrong' && wrongAnswersCount === 0}
              className={`noren-card text-left p-5 sm:p-6 transition-all ${
                mode.type === 'wrong' && wrongAnswersCount === 0
                  ? 'opacity-60 cursor-not-allowed grayscale'
                  : 'hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-md ${mode.type === 'wrong' && wrongAnswersCount === 0 ? 'bg-bg-warm text-ink-mute' : 'bg-bg-warm text-accent'}`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-mincho text-ink mb-2">{mode.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed max-w-xs">{mode.description}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-bg-warm ${
                  mode.type === 'wrong' && wrongAnswersCount === 0 ? 'text-ink-mute' : 'text-ink-mute group-hover:text-ink'
                }`}>
                  <ChevronRight size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="mt-8 bg-amber/10 border border-amber/20 p-4 rounded-md flex items-start gap-3">
            <div className="mt-0.5 text-amber">
              <HelpCircle size={20} />
            </div>
            <p className="text-ink text-sm">
              <strong>提示：</strong>
              还没有已完成的课程。请先通过课程列表学习一些语法点，掌握基础后再来进行综合练习。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
