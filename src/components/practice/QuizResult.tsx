import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home, ArrowRight } from 'lucide-react';
import type { QuizResult, QuizQuestion } from '@/types';

interface QuizResultProps {
  result: QuizResult;
  questions: QuizQuestion[];
  onRetry?: () => void;
  onGoHome?: () => void;
  onContinue?: () => void;
  onViewDetails?: () => void;
}

export function QuizResult({
  result,
  questions,
  onRetry,
  onGoHome,
  onContinue,
  onViewDetails,
}: QuizResultProps) {
  const getGrade = (accuracy: number) => {
    if (accuracy >= 0.9) return { grade: 'S', color: 'text-amber', bg: 'bg-amber-pale' };
    if (accuracy >= 0.7) return { grade: 'A', color: 'text-pine', bg: 'bg-pine-pale' };
    if (accuracy >= 0.6) return { grade: 'C', color: 'text-amber', bg: 'bg-amber-pale' };
    return { grade: 'D', color: 'text-accent', bg: 'bg-accent-pale' };
  };

  const { grade, color, bg } = getGrade(result.accuracy);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  const statsByGrammar = questions.reduce<Record<string, { total: number; correct: number }>>(
    (acc, question) => {
      const grammar = question.grammarPoint;
      if (!acc[grammar]) {
        acc[grammar] = { total: 0, correct: 0 };
      }
      acc[grammar].total++;

      const questionResult = result.results.find(r => r.questionId === question.id);
      if (questionResult?.isCorrect) {
        acc[grammar].correct++;
      }

      return acc;
    },
    {}
  );

  const wrongQuestions = questions.filter(q => {
    const questionResult = result.results.find(r => r.questionId === q.id);
    return questionResult && !questionResult.isCorrect;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-surface border border-border rounded-[10px] shadow-sm overflow-hidden">
        <div className={`bg-accent text-white p-8 text-center`}>
          <div className="flex justify-center mb-4">
            <div className={`w-24 h-24 rounded-full ${bg} flex items-center justify-center`}>
              <Trophy className={`w-12 h-12 ${color}`} />
            </div>
          </div>
          <div className={`text-6xl font-bold ${color} mb-2`}>{grade}</div>
          <h2 className="text-2xl font-bold mb-2">
            {result.accuracy >= 0.7 ? '恭喜通过！' : '继续努力！'}
          </h2>
          <p className="text-white/80">
            正确 {result.correctCount} / {result.totalQuestions} 题
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-dim rounded-[8px] p-4 text-center">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-ink-soft mb-1">正确率</p>
              <p className="text-2xl font-bold text-ink">
                {Math.round(result.accuracy * 100)}%
              </p>
            </div>

            <div className="bg-surface-dim rounded-[8px] p-4 text-center">
              <Clock className="w-8 h-8 text-amber mx-auto mb-2" />
              <p className="text-sm text-ink-soft mb-1">用时</p>
              <p className="text-2xl font-bold text-ink">
                {formatTime(result.timeSpent)}
              </p>
            </div>

            <div className="bg-surface-dim rounded-[8px] p-4 text-center">
              <TrendingUp className="w-8 h-8 text-pine mx-auto mb-2" />
              <p className="text-sm text-ink-soft mb-1">平均每题</p>
              <p className="text-2xl font-bold text-ink">
                {formatTime(Math.round(result.timeSpent / result.totalQuestions))}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-ink-soft mb-2">
              <span>正确率进度</span>
              <span>{Math.round(result.accuracy * 100)}%</span>
            </div>
            <div className="w-full bg-surface-dim rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  result.accuracy >= 0.7
                    ? 'bg-pine'
                    : result.accuracy >= 0.5
                    ? 'bg-amber'
                    : 'bg-accent'
                }`}
                style={{ width: `${result.accuracy * 100}%` }}
              />
            </div>
          </div>

          {Object.keys(statsByGrammar).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-ink mb-3">按语法点统计</h3>
              <div className="space-y-2">
                {Object.entries(statsByGrammar)
                  .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
                  .slice(0, 5)
                  .map(([grammar, stats]) => {
                    const accuracy = stats.correct / stats.total;
                    return (
                      <div key={grammar} className="bg-surface-dim rounded-[8px] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-ink">{grammar}</span>
                          <span className="text-sm text-ink-mute">
                            {stats.correct} / {stats.total}
                          </span>
                        </div>
                        <div className="w-full bg-surface-dim rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              accuracy >= 0.8
                                ? 'bg-pine'
                                : accuracy >= 0.6
                                ? 'bg-amber'
                                : 'bg-accent'
                            }`}
                            style={{ width: `${accuracy * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-[8px] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                重新测试
              </button>
            )}
            {onContinue && (
              <button
                onClick={onContinue}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pine hover:bg-pine/90 text-white font-medium rounded-[8px] transition-colors"
              >
                继续学习
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-surface-dim hover:bg-surface-hover text-ink font-medium rounded-[8px] transition-colors"
              >
                <Home className="w-5 h-5" />
                返回首页
              </button>
            )}
            {onViewDetails && wrongQuestions.length > 0 && (
              <button
                onClick={onViewDetails}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber hover:bg-amber/90 text-white font-medium rounded-[8px] transition-colors"
              >
                查看错题 ({wrongQuestions.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {result.accuracy < 0.7 && (
        <div className="mt-6 bg-amber-pale border-l-4 border-amber p-4 rounded-[8px]">
          <p className="text-ink">
            <strong>提示：</strong>
            建议复习后再进行测试。你可以查看错题解析，针对性地练习薄弱的语法点。
          </p>
        </div>
      )}

      {result.accuracy >= 0.9 && (
        <div className="mt-6 bg-pine-pale border-l-4 border-pine p-4 rounded-[8px]">
          <p className="text-ink">
            <strong>太棒了！</strong>
            你的掌握程度非常好，继续保持！可以尝试更有挑战性的练习。
          </p>
        </div>
      )}
    </div>
  );
}
