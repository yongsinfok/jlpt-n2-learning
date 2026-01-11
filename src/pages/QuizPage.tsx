/**
 * 测试页面
 * 通用测试页面，支持填空题、选择题、课程测试等多种模式
 * 根据 URL 参数或路由状态决定测试类型
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { FillBlankQuiz } from '@/components/practice/FillBlankQuiz';
import { QuizResult } from '@/components/practice/QuizResult';
import { useQuiz } from '@/hooks/useQuiz';
import {
  generateFillBlankQuestions,
  generateMultipleChoiceQuestions,
  generateLessonTest,
  generateRandomPractice,
} from '@/utils/quizGenerator';
import type { QuizQuestion } from '@/types';

/** 测试类型 */
type QuizType = 'fill' | 'choice' | 'lesson' | 'practice' | null;

/** 加载状态 */
type LoadingState = 'loading' | 'ready' | 'error';

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 从 URL 参数获取测试配置
  const quizType = (searchParams.get('type') as QuizType) || null;
  const grammarPoint = searchParams.get('grammar');
  const lessonId = searchParams.get('lesson');
  const count = parseInt(searchParams.get('count') || '10', 10);

  // 状态
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    isCompleted,
    result,
    finishQuiz,
    resetQuiz,
  } = useQuiz();

  // 根据测试类型加载题目
  useEffect(() => {
    const loadQuestions = async () => {
      setLoadingState('loading');
      setError(null);

      try {
        let loadedQuestions: QuizQuestion[] = [];

        switch (quizType) {
          case 'fill':
            // 填空题测试
            if (!grammarPoint) {
              throw new Error('缺少语法点参数');
            }
            loadedQuestions = await generateFillBlankQuestions(grammarPoint, count);
            break;

          case 'choice':
            // 选择题测试
            if (!grammarPoint) {
              throw new Error('缺少语法点参数');
            }
            loadedQuestions = await generateMultipleChoiceQuestions(grammarPoint, count);
            break;

          case 'lesson':
            // 课程测试
            if (!lessonId) {
              throw new Error('缺少课程ID参数');
            }
            loadedQuestions = await generateLessonTest(parseInt(lessonId), count);
            break;

          case 'practice':
            // 随机练习
            loadedQuestions = await generateRandomPractice(count);
            break;

          default:
            throw new Error('未知的测试类型');
        }

        if (loadedQuestions.length === 0) {
          throw new Error('没有找到符合条件的题目');
        }

        setQuestions(loadedQuestions);
        setLoadingState('ready');
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
        setLoadingState('error');
      }
    };

    loadQuestions();
  }, [quizType, grammarPoint, lessonId, count]);

  // 处理完成测试
  const handleComplete = (quizResult: {
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    timeSpent: number;
    results: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
    }>;
  }) => {
    finishQuiz();

    // 保存练习记录到 IndexedDB
    // 这里可以添加保存逻辑
  };

  // 处理退出
  const handleExit = () => {
    const confirmed = confirm('确定要退出练习吗？进度将不会保存。');
    if (confirmed) {
      navigate(-1);
    }
  };

  // 处理重新测试
  const handleRetry = () => {
    resetQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理返回首页
  const handleGoHome = () => {
    navigate('/');
  };

  // 处理继续学习
  const handleContinue = () => {
    navigate('/lessons');
  };

  // 加载中
  if (loadingState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">正在生成题目...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (loadingState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // 测试结果
  if (isCompleted && result) {
    return (
      <QuizResult
        result={result}
        questions={questions}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        onContinue={handleContinue}
      />
    );
  }

  // 测试进行中
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mb-4 px-4">
        <button
          onClick={handleExit}
          className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
        >
          ← 返回
        </button>
      </div>

      <FillBlankQuiz
        questions={questions}
        onComplete={handleComplete}
        onExit={handleExit}
        showExplanation={false}
      />
    </div>
  );
}
