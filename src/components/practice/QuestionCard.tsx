import { useState, memo, useMemo, useCallback } from 'react';
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import type { QuizQuestion } from '@/types';

interface QuestionCardProps {
  question: QuizQuestion;
  isSubmitted: boolean;
  userAnswer?: string;
  onSelectAnswer: (answer: string) => void;
  showExplanation?: boolean;
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

  const isCorrect = useMemo(() => {
    return userAnswer === question.correctAnswer;
  }, [userAnswer, question.correctAnswer]);

  const handleSelectOption = useCallback((option: string) => {
    if (isSubmitted) return;
    setLocalSelected(option);
    onSelectAnswer(option);
  }, [isSubmitted, onSelectAnswer]);

  const getOptionClassName = useCallback((option: string) => {
    const baseClasses = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ';

    if (!isSubmitted) {
      return (
        baseClasses +
        (localSelected === option
          ? 'border-accent bg-accent-pale text-ink'
          : 'border-border bg-surface hover:border-ink-mute hover:bg-bg-warm')
      );
    }

    if (option === question.correctAnswer) {
      return baseClasses + 'border-accent bg-accent-pale text-ink';
    }

    if (option === userAnswer && !isCorrect) {
      return baseClasses + 'border-amber bg-amber-pale text-ink';
    }

    return baseClasses + 'border-border bg-surface-dim text-ink-mute';
  }, [isSubmitted, localSelected, question.correctAnswer, userAnswer, isCorrect]);

  return (
    <div className="noren-card p-5 md:p-6" role="region" aria-label={`题目 ${question.id.slice(-8)}`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-ink-mute">题目 ID: {question.id.slice(-8)}</span>
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

      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-bold font-mincho text-ink mb-2 leading-relaxed">
          请选择正确的语法点填入空白处：
        </h3>
        <p className="text-lg md:text-xl text-ink my-6 leading-relaxed font-medium">
          {question.sentence}
        </p>
      </div>

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
                <span
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-border-light font-bold text-ink-soft"
                  aria-hidden="true"
                >
                  {optionLabel}
                </span>
                <span className="text-lg">{option}</span>
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

      {isSubmitted && (
        <div
          className={`border-l-4 p-4 rounded-lg mb-4 ${
            isCorrect ? 'border-success bg-accent-pale' : 'border-error bg-amber-pale'
          }`}
          role="alert"
          aria-live="polite"
        >
          <p className="font-bold font-mincho text-ink mb-1">
            {isCorrect ? '回答正确！' : '回答错误'}
          </p>
          <p className="text-ink-soft">
            正确答案：<span className="font-bold">{question.correctAnswer}</span>
            {!isCorrect && userAnswer && (
              <>，你的答案：<span className="line-through">{userAnswer}</span></>
            )}
          </p>
        </div>
      )}

      <div className="bg-bg-warm rounded-lg p-4 mb-4">
        <p className="text-sm text-ink-soft mb-1">中文翻译：</p>
        <p className="text-ink">{question.translation}</p>
      </div>

      {question.explanation && (
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={onToggleExplanation}
            className="w-full px-4 py-3 bg-bg-warm hover:bg-surface-dim transition-colors flex items-center justify-between"
            aria-expanded={showExplanation}
            aria-controls="explanation-content"
          >
            <span className="font-medium text-ink-soft">语法解析</span>
            <ChevronDown
              className={`w-5 h-5 text-ink-mute transition-transform ${
                showExplanation ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>
          {showExplanation && (
            <div id="explanation-content" className="px-4 py-3 bg-surface">
              <p className="text-ink-soft leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
