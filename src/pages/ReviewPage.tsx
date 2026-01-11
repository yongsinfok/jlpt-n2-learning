/**
 * 复习页面 - 需要复习的语法点列表
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getSentencesByGrammarPoint } from '@/db/operations';
import { getDueReviews, calculateNextReview } from '@/utils/reviewAlgorithm';
import { CheckCircle2, BookOpen, Brain, ArrowRight } from 'lucide-react';

type ReviewMode = 'browse' | 'quiz' | null;

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  masteryLevel: number;
  lastReviewedDate: Date;
  daysSinceReview: number;
}

interface ReviewSession {
  currentIndex: number;
  totalItems: number;
  completedCount: number;
  correctCount: number;
  mode: 'browse' | 'quiz';
}

export function ReviewPage() {
  const navigate = useNavigate();
  const { userProgress, setUserProgress } = useUserStore();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [selectedMode, setSelectedMode] = useState<ReviewMode>(null);
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null);
  const [currentSentence, setCurrentSentence] = useState<any>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [completedStats, setCompletedStats] = useState<{ correct: number; total: number; updates: any[] } | null>(null);

  useEffect(() => {
    loadReviewItems();
  }, []);

  const loadReviewItems = async () => {
    const progress = await getUserProgress();
    if (progress) {
      setUserProgress(progress);

      const dueGrammarIds = getDueReviews(progress.learnedGrammar);
      const items: ReviewItem[] = dueGrammarIds.map((id) => {
        const learnedGrammar = progress.learnedGrammar.find((g) => g.grammarId === id);
        if (!learnedGrammar) {
          return {
            grammarId: id,
            grammarPoint: id,
            lessonNumber: 1,
            masteryLevel: 1,
            lastReviewedDate: new Date(),
            daysSinceReview: 0,
          };
        }

        const daysSinceReview = Math.floor(
          (Date.now() - new Date(learnedGrammar.nextReviewDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          grammarId: id,
          grammarPoint: id,
          lessonNumber: 1, // TODO: 从语法点表获取
          masteryLevel: learnedGrammar.masteryLevel,
          lastReviewedDate: learnedGrammar.lastReviewedDate,
          daysSinceReview,
        };
      });

      // 按优先级排序（过期的优先）
      items.sort((a, b) => b.daysSinceReview - a.daysSinceReview);
      setReviewItems(items);
    }
  };

  const getMasteryDescription = (level: number): string => {
    const descriptions = ['未学习', '刚学习', '初步掌握', '基本掌握', '熟练掌握', '完全掌握'];
    return descriptions[level] || '未知';
  };

  const getMasteryColor = (level: number): string => {
    if (level <= 1) return 'bg-gray-200 text-gray-700';
    if (level === 2) return 'bg-orange-100 text-orange-700';
    if (level === 3) return 'bg-yellow-100 text-yellow-700';
    if (level === 4) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  const startReview = (mode: 'browse' | 'quiz') => {
    setSelectedMode(mode);
    setReviewSession({
      currentIndex: 0,
      totalItems: reviewItems.length,
      completedCount: 0,
      correctCount: 0,
      mode,
    });
    loadCurrentReviewItem();
  };

  const loadCurrentReviewItem = async () => {
    if (reviewSession === null || reviewItems.length === 0) return;

    const currentItem = reviewItems[reviewSession.currentIndex];
    const sentences = await getSentencesByGrammarPoint(currentItem.grammarId);

    if (sentences.length > 0) {
      // 随机选择一个例句
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      setCurrentSentence(randomSentence);

      // 如果是测试模式，生成选项
      if (reviewSession.mode === 'quiz') {
        generateQuizOptions(currentItem.grammarId);
      }
    }
  };

  const generateQuizOptions = (correctAnswer: string) => {
    // 简化版：从所有复习项中随机选择3个作为干扰项
    const distractors = reviewItems
      .filter((item) => item.grammarId !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.grammarId);

    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  };

  const handleBrowseComplete = () => {
    completeReviewItem(true); // 浏览模式默认正确
  };

  const handleQuizAnswer = (answer: string) => {
    const currentItem = reviewItems[reviewSession!.currentIndex];
    const isCorrect = answer === currentItem.grammarId;

    setLastAnswerCorrect(isCorrect);
    setShowResult(true);

    setTimeout(() => {
      completeReviewItem(isCorrect);
      setShowResult(false);
    }, 1500);
  };

  const completeReviewItem = async (wasCorrect: boolean) => {
    if (reviewSession === null) return;

    const currentItem = reviewItems[reviewSession.currentIndex];

    // 计算新的复习计划
    const learnedGrammar = userProgress?.learnedGrammar.find((g) => g.grammarId === currentItem.grammarId);
    if (learnedGrammar) {
      const { nextLevel, nextReviewDate } = calculateNextReview(learnedGrammar.masteryLevel, wasCorrect);

      // 更新进度（保存到数组中，最后批量提交）
      const updates = {
        grammarId: currentItem.grammarId,
        nextLevel,
        nextReviewDate,
        wasCorrect,
      };

      // 更新本地状态
      const newCompletedCount = reviewSession.completedCount + 1;
      const newCorrectCount = wasCorrect ? reviewSession.correctCount + 1 : reviewSession.correctCount;

      if (reviewSession.currentIndex < reviewItems.length - 1) {
        // 还有下一项
        setReviewSession({
          ...reviewSession,
          currentIndex: reviewSession.currentIndex + 1,
          completedCount: newCompletedCount,
          correctCount: newCorrectCount,
        });
        loadCurrentReviewItem();
      } else {
        // 复习完成
        finishReviewSession(newCorrectCount, reviewItems.length, [updates]);
      }
    }
  };

  const finishReviewSession = async (correctCount: number, totalItems: number, updates: any[]) => {
    // 更新所有复习项的掌握等级
    // TODO: 批量更新到数据库

    setCompletedStats({
      correct: correctCount,
      total: totalItems,
      updates,
    });

    // 重新加载复习列表
    await loadReviewItems();
    setSelectedMode(null);
    setReviewSession(null);
  };

  // 如果没有需要复习的项目
  if (reviewItems.length === 0 && !selectedMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">太棒了！</h1>
          <p className="text-gray-600 mb-6">今天没有需要复习的语法点</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // 复习完成统计
  if (completedStats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">复习完成！</h1>

          <div className="bg-green-50 rounded-lg p-6 mb-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {completedStats.correct} / {completedStats.total}
            </p>
            <p className="text-gray-700">
              正确率: <strong>{Math.round((completedStats.correct / completedStats.total) * 100)}%</strong>
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">已更新复习计划:</h2>
            {completedStats.updates.map((update, index) => {
              const learnedGrammar = userProgress?.learnedGrammar.find((g) => g.grammarId === update.grammarId);
              return (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{update.grammarId}</span>
                  <div className="text-sm text-gray-600">
                    Level {learnedGrammar?.masteryLevel} → Level {update.nextLevel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCompletedStats(null)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              继续复习
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 复习进行中
  if (selectedMode && reviewSession && currentSentence) {
    const currentItem = reviewItems[reviewSession.currentIndex];

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 进度指示 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>进度: {reviewSession.currentIndex + 1} / {reviewSession.totalItems}</span>
            <span>正确: {reviewSession.correctCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((reviewSession.currentIndex + 1) / reviewSession.totalItems) * 100}%` }}
            />
          </div>
        </div>

        {/* 语法点信息 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{currentItem.grammarPoint}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(currentItem.masteryLevel)}`}>
              {getMasteryDescription(currentItem.masteryLevel)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            上次复习: {new Date(currentItem.lastReviewedDate).toLocaleDateString('zh-CN')}
          </p>
        </div>

        {/* 复习模式内容 */}
        {selectedMode === 'browse' ? (
          /* 浏览模式 */
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">快速浏览</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-xl text-gray-900 mb-4">{currentSentence.sentence}</p>
              <p className="text-gray-600">{currentSentence.translation}</p>
            </div>

            <button
              onClick={handleBrowseComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              已理解，下一个
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* 测试模式 */
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">测试模式</h3>
            </div>

            {showResult ? (
              <div className={`text-center py-8 ${lastAnswerCorrect ? 'bg-green-50' : 'bg-red-50'} rounded-lg`}>
                <p className={`text-2xl font-bold mb-2 ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {lastAnswerCorrect ? '✓ 正确！' : '✗ 不正确'}
                </p>
                {!lastAnswerCorrect && (
                  <p className="text-gray-700">正确答案是: {currentItem.grammarPoint}</p>
                )}
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <p className="text-xl text-gray-900 mb-4">
                    {currentSentence.sentence.replace(new RegExp(currentItem.grammarId, 'g'), '_____')}
                  </p>
                  <p className="text-gray-600 mb-2">请选择正确的语法点填入空白处:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quizOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleQuizAnswer(option)}
                      className="bg-gray-100 hover:bg-blue-100 hover:border-blue-300 border-2 border-transparent rounded-lg p-4 text-left transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 退出按钮 */}
        <button
          onClick={() => {
            setSelectedMode(null);
            setReviewSession(null);
            setCurrentSentence(null);
          }}
          className="mt-6 w-full text-gray-600 hover:text-gray-800 text-sm"
        >
          退出复习
        </button>
      </div>
    );
  }

  // 选择复习模式
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">复习</h1>
      <p className="text-gray-600 mb-8">今天有 {reviewItems.length} 个语法点需要复习</p>

      {/* 复习列表 */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {reviewItems.map((item) => (
            <div key={item.grammarId} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.grammarPoint}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>课程 {item.lessonNumber}</span>
                  <span>·</span>
                  <span className={`px-2 py-0.5 rounded ${getMasteryColor(item.masteryLevel)}`}>
                    {getMasteryDescription(item.masteryLevel)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 选择复习模式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => startReview('browse')}
          className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-6 text-left transition-all group"
        >
          <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">快速浏览</h3>
          <p className="text-sm text-gray-600">
            快速过一遍例句，加深印象。适合时间紧张时使用。
          </p>
          <div className="mt-4 text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            开始浏览 <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => startReview('quiz')}
          className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl p-6 text-left transition-all group"
        >
          <Brain className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">测试模式</h3>
          <p className="text-sm text-gray-600">
            通过选择题测试掌握程度，根据正确率调整复习间隔。
          </p>
          <div className="mt-4 text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            开始测试 <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
