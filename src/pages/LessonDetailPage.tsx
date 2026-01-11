/**
 * 课程详情页 - 显示课程的所有语法点
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, RotateCcw } from 'lucide-react';
import { getLessonById, getGrammarPointsByLesson, getUserProgress } from '@/db/operations';
import type { Lesson, GrammarPoint, UserProgress } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProgressBar } from '@/components/common/ProgressBar';

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

    // 检查该语法点的所有例句是否都已学习
    const grammarPoint = grammarPoints.find(g => g.id === grammarId);
    if (!grammarPoint) return 0;

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

  const handleReviewLesson = () => {
    navigate(`/lesson/${lessonId}/review`);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600">课程不存在</p>
          <button
            onClick={() => navigate('/lessons')}
            className="mt-4 text-primary hover:underline"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/lessons')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        返回课程列表
      </button>

      {/* 课程标题 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">课程 {lesson.id}</h1>

        {/* 进度条 */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>完成进度</span>
            <span className="font-medium">{lesson.completionRate.toFixed(0)}%</span>
          </div>
          <ProgressBar progress={lesson.completionRate} />
        </div>
        <p className="text-sm text-gray-500">
          已学习 {lesson.sentenceCount > 0 ? Math.round(lesson.sentenceCount * lesson.completionRate / 100) : 0} / {lesson.sentenceCount} 个例句
        </p>
      </div>

      {/* 语法点列表 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={22} />
          本课语法点
        </h2>

        {grammarPoints.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无语法点</p>
        ) : (
          <div className="space-y-3">
            {grammarPoints.map((gp) => {
              const progress = getGrammarProgress(gp.id);
              return (
                <button
                  key={gp.id}
                  onClick={() => handleGrammarClick(gp.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{gp.id}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      progress === 100
                        ? 'bg-green-100 text-green-700'
                        : progress > 0
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {progress === 100 ? '已完成' : progress > 0 ? '学习中' : '未开始'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{gp.grammarConnection}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{gp.sentenceCount} 个例句</span>
                    <span>{progress}%</span>
                  </div>
                  {progress > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleContinueLearning}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          <BookOpen size={18} />
          继续学习
        </button>

        <button
          onClick={handleReviewLesson}
          className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
          复习本课
        </button>

        <button
          onClick={handleStartQuiz}
          disabled={!canTakeQuiz}
          className={`
            flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-lg transition-colors
            ${canTakeQuiz
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <FileText size={18} />
          课后测试
        </button>
      </div>

      {!canTakeQuiz && (
        <p className="text-center text-sm text-gray-500 mt-4">
          完成 80% 后解锁课后测试
        </p>
      )}
    </div>
  );
}
