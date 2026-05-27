import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import type { QuizQuestion } from '@/types';

interface FillBlankQuizProps {
  questions: QuizQuestion[];
  onComplete: (result: {
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
  }) => void;
  onExit?: () => void;
  showExplanation?: boolean;
}

export function FillBlankQuiz({
  questions,
  onComplete,
  onExit,
  showExplanation: initialShowExplanation = false,
}: FillBlankQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(initialShowExplanation);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!isSubmitted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitted, startTime]);

  const currentQuestion = questions[currentIndex];
  const hasAnswer = currentQuestion && userAnswers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(userAnswers).length;
  const progress = answeredCount / questions.length;

  const handleSelectAnswer = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      const confirmed = confirm(
        `还有 ${questions.length - answeredCount} 道题未作答，确定要提交吗？`
      );
      if (!confirmed) return;
    }

    setIsSubmitted(true);

    let correctCount = 0;
    const results = questions.map(question => {
      const userAnswer = userAnswers[question.id] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
      };
    });

    onComplete({
      totalQuestions: questions.length,
      correctCount,
      accuracy: correctCount / questions.length,
      timeSpent,
      results,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="noren-card p-8 text-center">
          <h2 className="text-xl font-bold font-mincho text-ink mb-2">暂无题目</h2>
          <p className="text-ink-soft mb-4">请先学习一些语法点再来练习吧！</p>
          {onExit && (
            <button
              onClick={onExit}
              className="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
            >
              返回
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="noren-card p-4 mb-6 sticky top-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-ink-soft">
              进度: {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-ink-mute">
              已答: {answeredCount} / {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-soft">用时:</span>
            <span className="text-sm font-mono font-bold text-ink">
              {formatTime(timeSpent)}
            </span>
          </div>
        </div>

        <div className="w-full bg-border-light rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex gap-1 mt-3 flex-wrap">
          {questions.map((q, index) => {
            const isAnswered = q.id in userAnswers;
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowExplanation(false);
                }}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-accent text-white'
                    : isAnswered
                    ? 'bg-pine text-white'
                    : 'bg-border-light text-ink-mute hover:bg-border-strong'
                }`}
                aria-label={`跳转到题目 ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          isSubmitted={isSubmitted}
          userAnswer={userAnswers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
          showExplanation={showExplanation}
          onToggleExplanation={() => setShowExplanation(prev => !prev)}
        />
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-surface hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink-soft font-medium rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          上一题
        </button>

        <div className="flex gap-2">
          {onExit && !isSubmitted && (
            <button
              onClick={onExit}
              className="px-4 py-2 border border-border bg-surface hover:bg-surface-hover text-ink-soft font-medium rounded-lg transition-colors"
            >
              退出练习
            </button>
          )}

          {isSubmitted ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-2 bg-pine hover:bg-pine-light text-white font-medium rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              查看结果
            </button>
          ) : (
            <>
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!hasAnswer}
                  className="px-6 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:text-ink-mute text-white font-medium rounded-lg transition-colors"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
                >
                  下一题
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-surface hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink-soft font-medium rounded-lg transition-colors"
        >
          下一题
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
