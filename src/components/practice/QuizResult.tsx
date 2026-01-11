/**
 * 测试结果组件
 * 显示测试完成后的成绩、统计数据和操作按钮
 */

import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home, ArrowRight } from 'lucide-react';
import type { QuizResult, QuizQuestion } from '@/types';

interface QuizResultProps {
  /** 测试结果数据 */
  result: QuizResult;
  /** 题目列表（用于统计和查看） */
  questions: QuizQuestion[];
  /** 重新测试回调 */
  onRetry?: () => void;
  /** 返回首页回调 */
  onGoHome?: () => void;
  /** 继续学习回调 */
  onContinue?: () => void;
  /** 查看详细结果回调 */
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
  // 计算成绩等级
  const getGrade = (accuracy: number) => {
    if (accuracy >= 0.9) return { grade: 'S', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (accuracy >= 0.8) return { grade: 'A', color: 'text-success', bg: 'bg-success-light' };
    if (accuracy >= 0.7) return { grade: 'B', color: 'text-primary', bg: 'bg-primary-light' };
    if (accuracy >= 0.6) return { grade: 'C', color: 'text-warning', bg: 'bg-warning-light' };
    return { grade: 'D', color: 'text-error', bg: 'bg-error-light' };
  };

  const { grade, color, bg } = getGrade(result.accuracy);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  // 按语法点统计正确率
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

  // 获取错题
  const wrongQuestions = questions.filter(q => {
    const questionResult = result.results.find(r => r.questionId === q.id);
    return questionResult && !questionResult.isCorrect;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 主结果卡片 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 成绩展示区 */}
        <div className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 text-center`}>
          <div className="flex justify-center mb-4">
            <div className={`w-24 h-24 rounded-full ${bg} flex items-center justify-center`}>
              <Trophy className={`w-12 h-12 ${color}`} />
            </div>
          </div>
          <div className={`text-6xl font-bold ${color} mb-2`}>{grade}</div>
          <h2 className="text-2xl font-bold mb-2">
            {result.accuracy >= 0.7 ? '恭喜通过！' : '继续努力！'}
          </h2>
          <p className="text-blue-100">
            正确 {result.correctCount} / {result.totalQuestions} 题
          </p>
        </div>

        {/* 统计数据 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 正确率 */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">正确率</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(result.accuracy * 100)}%
              </p>
            </div>

            {/* 用时 */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">用时</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(result.timeSpent)}
              </p>
            </div>

            {/* 平均每题用时 */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">平均每题</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(Math.round(result.timeSpent / result.totalQuestions))}
              </p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>正确率进度</span>
              <span>{Math.round(result.accuracy * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  result.accuracy >= 0.7
                    ? 'bg-success'
                    : result.accuracy >= 0.5
                    ? 'bg-warning'
                    : 'bg-error'
                }`}
                style={{ width: `${result.accuracy * 100}%` }}
              />
            </div>
          </div>

          {/* 按语法点统计 */}
          {Object.keys(statsByGrammar).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">按语法点统计</h3>
              <div className="space-y-2">
                {Object.entries(statsByGrammar)
                  .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
                  .slice(0, 5)
                  .map(([grammar, stats]) => {
                    const accuracy = stats.correct / stats.total;
                    return (
                      <div key={grammar} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{grammar}</span>
                          <span className="text-sm text-gray-500">
                            {stats.correct} / {stats.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              accuracy >= 0.8
                                ? 'bg-success'
                                : accuracy >= 0.6
                                ? 'bg-warning'
                                : 'bg-error'
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

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                重新测试
              </button>
            )}
            {onContinue && (
              <button
                onClick={onContinue}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-success hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                继续学习
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                返回首页
              </button>
            )}
            {onViewDetails && wrongQuestions.length > 0 && (
              <button
                onClick={onViewDetails}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-warning hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
              >
                查看错题 ({wrongQuestions.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      {result.accuracy < 0.7 && (
        <div className="mt-6 bg-warning-light border-l-4 border-warning p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>提示：</strong>
            建议复习后再进行测试。你可以查看错题解析，针对性地练习薄弱的语法点。
          </p>
        </div>
      )}

      {result.accuracy >= 0.9 && (
        <div className="mt-6 bg-success-light border-l-4 border-success p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>太棒了！</strong>
            你的掌握程度非常好，继续保持！可以尝试更有挑战性的练习。
          </p>
        </div>
      )}
    </div>
  );
}
