/**
 * 测试页面
 * Modern Japanese Design - Washi Aesthetic
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
import { ArrowLeft } from 'lucide-react';

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
            if (!grammarPoint) throw new Error('缺少语法点参数');
            loadedQuestions = await generateFillBlankQuestions(grammarPoint, count);
            break;

          case 'choice':
            if (!grammarPoint) throw new Error('缺少语法点参数');
            loadedQuestions = await generateMultipleChoiceQuestions(grammarPoint, count);
            break;

          case 'lesson':
            if (!lessonId) throw new Error('缺少课程ID参数');
            loadedQuestions = await generateLessonTest(parseInt(lessonId), count);
            break;

          case 'practice':
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
  const handleComplete = () => {
    finishQuiz();
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
      <div className="min-h-screen flex items-center justify-center bg-washi-texture">
        <div className="text-center">
          <LoadingSpinner size="lg" text="正在生成题目..." />
        </div>
      </div>
    );
  }

  // 错误状态
  if (loadingState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-washi-texture px-4">
        <div className="card-paper p-8 text-center max-w-md border-shu-200">
          <div className="text-shu-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-sumi-900 mb-2">生成试题失败</h2>
          <p className="text-sumi-600 mb-6">{error}</p>
          <button
            onClick={handleGoHome}
            className="btn-primary w-full"
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
    <div className="min-h-screen bg-washi-texture py-8 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-asanoha bg-repeat opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-seigaiha bg-repeat opacity-50"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="mb-6">
          <button
            onClick={handleExit}
            className="text-sumi-500 hover:text-sumi-900 text-sm flex items-center gap-1 font-medium px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={16} />
            退出练习
          </button>
        </div>

        <div className="card-paper p-0 overflow-hidden shadow-paper-lg">
          <FillBlankQuiz
            questions={questions}
            onComplete={handleComplete}
            onExit={handleExit}
            showExplanation={false}
          />
        </div>
      </div>
    </div>
  );
}
