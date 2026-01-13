/**
 * 课程详情页 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
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
    if (!grammarPoint || grammarPoint.sentenceCount === 0) return 100;

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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="正在准备课程内容..." />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass-card-strong p-8 text-center max-w-md">
          <p className="text-text-secondary mb-4">课程不存在</p>
          <button
            onClick={() => navigate('/lessons')}
            className="text-primary hover:text-secondary font-medium"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header Section - Glass */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/30 border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/lessons')}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors rounded-xl hover:bg-white/50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-text-primary leading-none">课程 {lesson.id}</h1>
              <p className="text-xs text-text-secondary mt-1">N2 语法系统学习</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Progress Overview Card */}
        <div className="glass-card-strong p-6 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-semibold text-text-primary font-mono tracking-tight">{lesson.completionRate.toFixed(0)}%</span>
                <span className="text-text-secondary text-sm font-medium">完成进度</span>
              </div>
              <div className="w-full sm:w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${lesson.completionRate}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-2">
                已学习 {lesson.sentenceCount > 0 ? Math.round(lesson.sentenceCount * lesson.completionRate / 100) : 0} / {lesson.sentenceCount} 个例句
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleContinueLearning}
                className="btn-modern-primary flex items-center gap-2"
              >
                <BookOpen size={18} />
                继续学习
              </button>

              <button
                onClick={handleStartQuiz}
                disabled={!canTakeQuiz}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all
                  ${canTakeQuiz
                    ? 'bg-success/10 border-success/30 text-success hover:bg-success/20'
                    : 'bg-gray-50 border-gray-200 text-text-muted cursor-not-allowed'
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
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              本课语法点
            </h2>
            <span className="text-xs font-medium text-text-secondary bg-white/50 px-2 py-1 rounded-full">
              {grammarPoints.length} 个语法
            </span>
          </div>

          {grammarPoints.length === 0 ? (
            <div className="glass-card-strong p-12 text-center border-dashed">
              <p className="text-text-secondary">暂无语法点数据</p>
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
                      hover:shadow-glow hover:-translate-y-0.5
                      ${isCompleted
                        ? 'bg-success/5 border-success/20 hover:bg-success/10'
                        : 'glass-card hover:bg-white/60'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-text-muted w-6">{(index + 1).toString().padStart(2, '0')}</span>
                          <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors">
                            {gp.id}
                          </h3>
                        </div>
                        <p className="text-sm text-text-secondary pl-9 mb-3">{gp.grammarConnection}</p>

                        <div className="flex items-center gap-4 pl-9">
                          <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isCompleted ? 'bg-success' : 'bg-gradient-to-r from-primary to-secondary'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary">{progress}%</span>
                        </div>
                      </div>

                      <div className="self-center">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-primary transition-colors" />
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
