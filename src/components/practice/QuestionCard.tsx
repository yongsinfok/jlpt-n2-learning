/**
 * 题目卡片组件 - 优化版本
 * 使用 React.memo 和 useCallback 优化性能
 * 增强可访问性（ARIA 属性）
 */

import { useState, memo, useMemo, useCallback } from 'react';
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import type { QuizQuestion } from '@/types';

interface QuestionCardProps {
  /** 题目数据 */
  question: QuizQuestion;
  /** 是否已提交 */
  isSubmitted: boolean;
  /** 用户选择的答案 */
  userAnswer?: string;
  /** 选择答案回调 */
  onSelectAnswer: (answer: string) => void;
  /** 是否显示解析 */
  showExplanation?: boolean;
  /** 切换解析显示 */
  onToggleExplanation?: () => void;
}

export const QuestionCard = memo(function QuestionCard({
  question,
  isSubmitted,
  userAnswer,
  onSelectAnswer,
  showExplanation = false,
  onToggleExplanation,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<string | undefined>(userAnswer);

  // 判断答案是否正确
  const isCorrect = useMemo(() => {
    return userAnswer === question.correctAnswer;
  }, [userAnswer, question.correctAnswer]);

  // 处理选项选择
  const handleSelectOption = useCallback((option: string) => {
    if (isSubmitted) return; // 已提交后不能更改
    setLocalSelected(option);
    onSelectAnswer(option);
  }, [isSubmitted, onSelectAnswer]);

  // 缓存选项样式函数
  const getOptionClassName = useCallback((option: string) => {
    const baseClasses = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ';

    if (!isSubmitted) {
      // 未提交状态
      return (
        baseClasses +
        (localSelected === option
          ? 'border-primary bg-primary-light text-gray-900'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50')
      );
    }

    // 已提交状态
    if (option === question.correctAnswer) {
      return baseClasses + 'border-success bg-success-light text-gray-900';
    }

    if (option === userAnswer && !isCorrect) {
      return baseClasses + 'border-error bg-error-light text-gray-900';
    }

    return baseClasses + 'border-gray-200 bg-gray-100 text-gray-500';
  }, [isSubmitted, localSelected, question.correctAnswer, userAnswer, isCorrect]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8" role="region" aria-label={`题目 ${question.id.slice(-8)}`}>
      {/* 题目编号和进度 */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500">题目 ID: {question.id.slice(-8)}</span>
        {isSubmitted && (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="flex items-center gap-1 text-success font-medium">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                正确
              </span>
            ) : (
              <span className="flex items-center gap-1 text-error font-medium">
                <XCircle className="w-5 h-5" aria-hidden="true" />
                错误
              </span>
            )}
          </div>
        )}
      </div>

      {/* 题目内容 */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-relaxed">
          请选择正确的语法点填入空白处：
        </h3>
        <p className="text-xl md:text-2xl text-gray-800 my-6 leading-relaxed font-medium">
          {question.sentence}
        </p>
      </div>

      {/* 选项列表 */}
      <div className="space-y-3 mb-6" role="radiogroup" aria-label="答案选项">
        {question.options.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index);
          const isSelected = localSelected === option;
          const isCorrectOption = option === question.correctAnswer;
          const isWrongSelected = option === userAnswer && !isCorrect && isSubmitted;

          return (
            <button
              key={option}
              onClick={() => handleSelectOption(option)}
              disabled={isSubmitted}
              className={getOptionClassName(option)}
              aria-label={`选项 ${optionLabel}: ${option}`}
              aria-pressed={isSelected}
              aria-disabled={isSubmitted}
              role="radio"
              tabIndex={isSubmitted ? -1 : 0}
            >
              <div className="flex items-center gap-4">
                {/* 选项标签 */}
                <span
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700"
                  aria-hidden="true"
                >
                  {optionLabel}
                </span>
                {/* 选项内容 */}
                <span className="text-lg">{option}</span>
                {/* 正确/错误标记 */}
                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-success ml-auto" aria-hidden="true" />
                )}
                {isSubmitted && isWrongSelected && (
                  <XCircle className="w-6 h-6 text-error ml-auto" aria-hidden="true" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 答案反馈（提交后显示） */}
      {isSubmitted && (
        <div
          className={`border-l-4 p-4 rounded-lg mb-4 ${
            isCorrect ? 'border-success bg-success-light' : 'border-error bg-error-light'
          }`}
          role="alert"
          aria-live="polite"
        >
          <p className="font-bold text-gray-900 mb-1">
            {isCorrect ? '回答正确！' : '回答错误'}
          </p>
          <p className="text-gray-700">
            正确答案：<span className="font-bold">{question.correctAnswer}</span>
            {!isCorrect && userAnswer && (
              <>，你的答案：<span className="line-through">{userAnswer}</span></>
            )}
          </p>
        </div>
      )}

      {/* 翻译（始终显示） */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">中文翻译：</p>
        <p className="text-gray-800">{question.translation}</p>
      </div>

      {/* 解析（可展开） */}
      {question.explanation && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={onToggleExplanation}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            aria-expanded={showExplanation}
            aria-controls="explanation-content"
          >
            <span className="font-medium text-gray-700">语法解析</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                showExplanation ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>
          {showExplanation && (
            <div id="explanation-content" className="px-4 py-3 bg-white">
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
