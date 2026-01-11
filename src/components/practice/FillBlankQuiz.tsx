/**
 * 填空题练习组件
 * 提供完整的填空题练习体验，包括题目展示、进度导航
 */

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import type { QuizQuestion } from '@/types';

interface FillBlankQuizProps {
  /** 题目列表 */
  questions: QuizQuestion[];
  /** 完成测试回调 */
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
  /** 退出练习回调 */
  onExit?: () => void;
  /** 是否显示解析 */
  showExplanation?: boolean;
}

export function FillBlankQuiz({
  questions,
  onComplete,
  onExit,
  showExplanation: initialShowExplanation = false,
}: FillBlankQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(initialShowExplanation);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  // 更新计时
  useEffect(() => {
    if (!isSubmitted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitted, startTime]);

  const currentQuestion = questions[currentIndex];
  const hasAnswer = currentQuestion && userAnswers.has(currentQuestion.id);
  const answeredCount = userAnswers.size;
  const progress = answeredCount / questions.length;

  // 处理选择答案
  const handleSelectAnswer = (answer: string) => {
    setUserAnswers(prev => new Map(prev).set(currentQuestion.id, answer));
    setShowExplanation(true);
  };

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  // 上一题
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  // 提交测试
  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      const confirmed = confirm(
        `还有 ${questions.length - answeredCount} 道题未作答，确定要提交吗？`
      );
      if (!confirmed) return;
    }

    setIsSubmitted(true);

    // 计算结果
    let correctCount = 0;
    const results = questions.map(question => {
      const userAnswer = userAnswers.get(question.id) || '';
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

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 如果没有题目
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">暂无题目</h2>
          <p className="text-gray-600 mb-4">请先学习一些语法点再来练习吧！</p>
          {onExit && (
            <button
              onClick={onExit}
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
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
      {/* 顶部进度栏 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              进度: {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              已答: {answeredCount} / {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">用时:</span>
            <span className="text-sm font-mono font-bold text-gray-900">
              {formatTime(timeSpent)}
            </span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* 题目导航点 */}
        <div className="flex gap-1 mt-3 flex-wrap">
          {questions.map((q, index) => {
            const isAnswered = userAnswers.has(q.id);
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
                    ? 'bg-primary text-white'
                    : isAnswered
                    ? 'bg-success text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label={`跳转到题目 ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* 题目卡片 */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          isSubmitted={isSubmitted}
          userAnswer={userAnswers.get(currentQuestion.id)}
          onSelectAnswer={handleSelectAnswer}
          showExplanation={showExplanation}
          onToggleExplanation={() => setShowExplanation(prev => !prev)}
        />
      )}

      {/* 导航按钮 */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          上一题
        </button>

        <div className="flex gap-2">
          {onExit && !isSubmitted && (
            <button
              onClick={onExit}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              退出练习
            </button>
          )}

          {isSubmitted ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-2 bg-success hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
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
                  className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
        >
          下一题
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
