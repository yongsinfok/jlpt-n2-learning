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

type QuizType = 'fill' | 'choice' | 'lesson' | 'practice' | null;
type LoadingState = 'loading' | 'ready' | 'error';

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const quizType = (searchParams.get('type') as QuizType) || null;
  const grammarPoint = searchParams.get('grammar');
  const lessonId = searchParams.get('lesson');
  const count = parseInt(searchParams.get('count') || '10', 10);

  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    isCompleted,
    result,
    finishQuiz,
    resetQuiz,
  } = useQuiz();

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

  const handleComplete = () => {
    finishQuiz();
  };

  const handleExit = () => {
    const confirmed = confirm('确定要退出练习吗？进度将不会保存。');
    if (confirmed) {
      navigate(-1);
    }
  };

  const handleRetry = () => {
    resetQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContinue = () => {
    navigate('/lessons');
  };

  if (loadingState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <LoadingSpinner size="lg" text="正在生成题目..." />
        </div>
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="noren-card p-8 text-center max-w-md">
          <div className="text-accent text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold font-mincho text-ink mb-2">生成试题失败</h2>
          <p className="text-ink-soft mb-6">{error}</p>
          <button
            onClick={handleGoHome}
            className="w-full px-4 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={handleExit}
            className="text-ink-mute hover:text-ink text-sm flex items-center gap-1 font-medium px-3 py-1.5 rounded-lg hover:bg-surface/50 transition-colors"
          >
            <ArrowLeft size={16} />
            退出练习
          </button>
        </div>

        <div className="noren-card p-0 overflow-hidden">
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
