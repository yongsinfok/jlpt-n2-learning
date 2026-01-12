/**
 * 课程详情页 - 显示课程的所有语法点
 * Modern Japanese Design - Washi Aesthetic
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { getLessonById, getGrammarPointsByLesson, getUserProgress } from '@/db/operations';
import type { Lesson, GrammarPoint, UserProgress } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * 课程详情页面
 */
export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const lessonId = id ? parseInt(id) : 1;

  useEffect(() => {
    loadData();
  }, [lessonId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lessonData, grammarData, progressData] = await Promise.all([
        getLessonById(lessonId),
        getGrammarPointsByLesson(lessonId),
        getUserProgress(),
      ]);
      setLesson(lessonData || null);
      setGrammarPoints(grammarData);
      setUserProgress(progressData || null);
    } catch (error) {
      console.error('Failed to load lesson details:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取语法点的学习进度
  const getGrammarProgress = useCallback((grammarId: string) => {
    if (!userProgress || !lesson) return 0;
    const learned = userProgress.learnedGrammar.find(g => g.grammarId === grammarId);
    if (!learned) return 0;

    const grammarPoint = grammarPoints.find(g => g.id === grammarId);
    if (!grammarPoint || grammarPoint.sentenceCount === 0) return 100; // 如果没有例句，但已标记学习，则视为完成

    const learnedSentencesInGrammar = userProgress.learnedSentences.filter(id =>
      grammarPoint.sentenceIds.includes(id)
    );

    return Math.round((learnedSentencesInGrammar.length / grammarPoint.sentenceCount) * 100);
  }, [userProgress, lesson, grammarPoints]);

  // 找到第一个未完成的语法点
  const findFirstIncompleteGrammar = useCallback(() => {
    for (const gp of grammarPoints) {
      if (getGrammarProgress(gp.id) < 100) {
        return gp.id;
      }
    }
    return grammarPoints[0]?.id || null;
  }, [grammarPoints, getGrammarProgress]);

  const handleContinueLearning = () => {
    const nextGrammarId = findFirstIncompleteGrammar();
    if (nextGrammarId) {
      navigate(`/grammar/${encodeURIComponent(nextGrammarId)}`);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/lesson/${lessonId}/quiz`);
  };

  const handleGrammarClick = (grammarId: string) => {
    navigate(`/grammar/${encodeURIComponent(grammarId)}`);
  };

  const canTakeQuiz = lesson?.completionRate && lesson.completionRate >= 80;

  if (loading) {
    return (
      <div className="min-h-screen bg-washi-texture flex items-center justify-center">
        <LoadingSpinner size="lg" text="正在准备课程内容..." />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-washi-texture flex items-center justify-center p-4">
        <div className="card-paper p-8 text-center max-w-md">
          <p className="text-sumi-600 mb-4">课程不存在</p>
          <button
            onClick={() => navigate('/lessons')}
            className="text-ai-600 hover:underline font-medium"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi-texture pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-sumi-200 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/lessons')}
              className="p-2 -ml-2 text-sumi-500 hover:text-sumi-900 transition-colors rounded-full hover:bg-sumi-50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-sumi-900 leading-none">课程 {lesson.id}</h1>
              <p className="text-xs text-sumi-500 mt-1">N2 语法系统学习</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Progress Overview Card */}
        <div className="card-paper p-6 relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] bg-asanoha rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-ai-700 font-mono tracking-tight">{lesson.completionRate.toFixed(0)}%</span>
                <span className="text-sumi-500 text-sm font-medium">完成进度</span>
              </div>
              <div className="w-full sm:w-64 h-2 bg-sumi-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ai-600 transition-all duration-700 ease-out"
                  style={{ width: `${lesson.completionRate}%` }}
                />
              </div>
              <p className="text-sm text-sumi-500 mt-2">
                已学习 {lesson.sentenceCount > 0 ? Math.round(lesson.sentenceCount * lesson.completionRate / 100) : 0} / {lesson.sentenceCount} 个例句
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleContinueLearning}
                className="btn-primary flex items-center gap-2 shadow-lg shadow-ai-100"
              >
                <BookOpen size={18} />
                继续学习
              </button>

              <button
                onClick={handleStartQuiz}
                disabled={!canTakeQuiz}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all
                  ${canTakeQuiz
                    ? 'bg-matcha-50 border-matcha-200 text-matcha-700 hover:bg-matcha-100 hover:border-matcha-300'
                    : 'bg-sumi-50 border-sumi-100 text-sumi-400 cursor-not-allowed'
                  }
                `}
              >
                <FileText size={18} />
                课后测试
              </button>
            </div>
          </div>
        </div>

        {/* Grammar Points List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-sumi-900 flex items-center gap-2">
              <BookOpen size={20} className="text-ai-600" />
              本课语法点
            </h2>
            <span className="text-xs font-medium text-sumi-400 bg-sumi-100 px-2 py-1 rounded">
              {grammarPoints.length} 个语法
            </span>
          </div>

          {grammarPoints.length === 0 ? (
            <div className="card-paper p-12 text-center bg-sumi-50 border-dashed">
              <p className="text-sumi-500">暂无语法点数据</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {grammarPoints.map((gp, index) => {
                const progress = getGrammarProgress(gp.id);
                const isCompleted = progress === 100;

                return (
                  <button
                    key={gp.id}
                    onClick={() => handleGrammarClick(gp.id)}
                    className={`
                      group w-full text-left p-5 rounded-xl border transition-all duration-200
                      hover:shadow-paper-md hover:-translate-y-0.5
                      ${isCompleted
                        ? 'bg-white border-matcha-200'
                        : 'bg-white border-sumi-200 hover:border-ai-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-sumi-400 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                          <h3 className="font-bold text-lg text-sumi-900 group-hover:text-ai-700 transition-colors">
                            {gp.id}
                          </h3>
                        </div>
                        <p className="text-sm text-sumi-600 pl-9 mb-3">{gp.grammarConnection}</p>

                        <div className="flex items-center gap-4 pl-9">
                          <div className="flex-1 max-w-[120px] h-1.5 bg-sumi-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isCompleted ? 'bg-matcha-500' : 'bg-ai-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-sumi-400">{progress}%</span>
                        </div>
                      </div>

                      <div className="self-center">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-matcha-500" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-sumi-200 group-hover:border-ai-400 transition-colors" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
