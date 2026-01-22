/**
 * ReviewPage - Modern Clean Design
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getSentencesByGrammarPoint } from '@/db/operations';
import { getDueReviews, calculateNextReview } from '@/utils/reviewAlgorithm';
import { CheckCircle2, BookOpen, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

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
          lessonNumber: 1,
          masteryLevel: learnedGrammar.masteryLevel,
          lastReviewedDate: learnedGrammar.lastReviewedDate,
          daysSinceReview,
        };
      });

      items.sort((a, b) => b.daysSinceReview - a.daysSinceReview);
      setReviewItems(items);
    }
  };

  const getMasteryDescription = (level: number): string => {
    const descriptions = ['未学习', '刚学习', '初步掌握', '基本掌握', '熟练掌握', '完全掌握'];
    return descriptions[level] || '未知';
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
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      setCurrentSentence(randomSentence);

      if (reviewSession.mode === 'quiz') {
        generateQuizOptions(currentItem.grammarId);
      }
    }
  };

  const generateQuizOptions = (correctAnswer: string) => {
    const distractors = reviewItems
      .filter((item) => item.grammarId !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.grammarId);

    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  };

  const handleBrowseComplete = () => {
    completeReviewItem(true);
  };

  const handleQuizAnswer = (answer: string) => {
    const currentItem = reviewItems[reviewSession!].currentIndex;
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
    const learnedGrammar = userProgress?.learnedGrammar.find((g) => g.grammarId === currentItem.grammarId);

    if (learnedGrammar) {
      const { nextLevel, nextReviewDate } = calculateNextReview(learnedGrammar.masteryLevel, wasCorrect);
      const updates = {
        grammarId: currentItem.grammarId,
        nextLevel,
        nextReviewDate,
        wasCorrect,
      };

      const newCompletedCount = reviewSession.completedCount + 1;
      const newCorrectCount = wasCorrect ? reviewSession.correctCount + 1 : reviewSession.correctCount;

      if (reviewSession.currentIndex < reviewItems.length - 1) {
        setReviewSession({
          ...reviewSession,
          currentIndex: reviewSession.currentIndex + 1,
          completedCount: newCompletedCount,
          correctCount: newCorrectCount,
        });
        loadCurrentReviewItem();
      } else {
        finishReviewSession(newCorrectCount, reviewItems.length, [updates]);
      }
    }
  };

  const finishReviewSession = async (correctCount: number, totalItems: number, updates: any[]) => {
    setCompletedStats({
      correct: correctCount,
      total: totalItems,
      updates,
    });

    await loadReviewItems();
    setSelectedMode(null);
    setReviewSession(null);
  };

  // No review items
  if (reviewItems.length === 0 && !selectedMode) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h1 className="text-h1 md:text-2xl font-bold text-primary mb-2">太棒了！</h1>
            <p className="text-body text-neutral-dark mb-6">今天没有需要复习的语法点</p>
            <Button variant="primary" asChild>
              <button onClick={() => navigate('/')}>返回首页</button>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Review completed
  if (completedStats) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card p-8">
            <h1 className="text-h1 md:text-2xl font-bold text-primary mb-6 text-center">复习完成！</h1>

            <div className="bg-success/10 rounded-md p-6 mb-6 text-center">
              <p className="text-4xl font-bold text-success mb-2">
                {completedStats.correct} / {completedStats.total}
              </p>
              <p className="text-primary">
                正确率: <strong>{Math.round((completedStats.correct / completedStats.total) * 100)}%</strong>
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="font-semibold text-primary mb-2">已更新复习计划:</h2>
              {completedStats.updates.map((update, index) => {
                const learnedGrammar = userProgress?.learnedGrammar.find((g) => g.grammarId === update.grammarId);
                return (
                  <div key={index} className="flex items-center justify-between bg-neutral rounded-md p-3">
                    <span className="text-primary">{update.grammarId}</span>
                    <div className="text-small text-neutral-dark">
                      Level {learnedGrammar?.masteryLevel} → Level {update.nextLevel}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => setCompletedStats(null)}>
                继续复习
              </Button>
              <Button variant="secondary" className="flex-1" asChild>
                <button onClick={() => navigate('/')}>返回首页</button>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review in progress
  if (selectedMode && reviewSession && currentSentence) {
    const currentItem = reviewItems[reviewSession.currentIndex];

    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-small text-neutral-dark mb-2">
              <span>进度: {reviewSession.currentIndex + 1} / {reviewSession.totalItems}</span>
              <span>正确: {reviewSession.correctCount}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((reviewSession.currentIndex + 1) / reviewSession.totalItems) * 100}%` }}
              />
            </div>
          </div>

          {/* Grammar info */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h1 text-primary">{currentItem.grammarPoint}</h2>
              <span className="badge">
                {getMasteryDescription(currentItem.masteryLevel)}
              </span>
            </div>
            <p className="text-small text-neutral-dark">
              上次复习: {new Date(currentItem.lastReviewedDate).toLocaleDateString('zh-CN')}
            </p>
          </div>

          {/* Review mode content */}
          {selectedMode === 'browse' ? (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">快速浏览</h3>
              </div>

              <div className="bg-neutral rounded-md p-6 mb-6">
                <p className="text-h1 text-primary mb-4">{currentSentence.sentence}</p>
                <p className="text-neutral-dark">{currentSentence.translation}</p>
              </div>

              <Button variant="primary" className="w-full" onClick={handleBrowseComplete}>
                已理解，下一个
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">测试模式</h3>
              </div>

              {showResult ? (
                <div className={`text-center py-8 rounded-md ${lastAnswerCorrect ? 'bg-success/10' : 'bg-error/10'}`}>
                  <p className={`text-2xl font-bold mb-2 ${lastAnswerCorrect ? 'text-success' : 'text-error'}`}>
                    {lastAnswerCorrect ? '✓ 正确！' : '✗ 不正确'}
                  </p>
                  {!lastAnswerCorrect && (
                    <p className="text-primary">正确答案是: {currentItem.grammarPoint}</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-neutral rounded-md p-6 mb-6">
                    <p className="text-h1 text-primary mb-4">
                      {currentSentence.sentence.replace(new RegExp(currentItem.grammarId, 'g'), '_____')}
                    </p>
                    <p className="text-neutral-dark mb-2">请选择正确的语法点填入空白处:</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quizOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleQuizAnswer(option)}
                        className="p-4 rounded-md border border-border hover:border-primary hover:bg-neutral text-left transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Exit button */}
          <button
            onClick={() => {
              setSelectedMode(null);
              setReviewSession(null);
              setCurrentSentence(null);
            }}
            className="mt-6 w-full text-neutral-dark hover:text-primary text-small"
          >
            退出复习
          </button>
        </div>
      </div>
    );
  }

  // Select review mode
  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-h1 md:text-3xl font-bold text-primary mb-2">复习</h1>
        <p className="text-body text-neutral-dark mb-8">今天有 {reviewItems.length} 个语法点需要复习</p>

        {/* Review list */}
        <div className="card mb-6 overflow-hidden">
          <div className="divide-y divide-border">
            {reviewItems.map((item) => (
              <div key={item.grammarId} className="p-4 flex items-center justify-between hover:bg-neutral">
                <div className="flex-1">
                  <p className="font-medium text-primary">{item.grammarPoint}</p>
                  <div className="flex items-center gap-3 mt-1 text-small text-neutral-dark">
                    <span>课程 {item.lessonNumber}</span>
                    <span>·</span>
                    <span className="badge">{getMasteryDescription(item.masteryLevel)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Select review mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => startReview('browse')}
            className="card p-6 text-left hover:scale-[1.02] transition-all"
          >
            <BookOpen className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-primary mb-2">快速浏览</h3>
            <p className="text-small text-neutral-dark">
              快速过一遍例句，加深印象。适合时间紧张时使用。
            </p>
            <div className="mt-4 text-primary font-medium flex items-center gap-1">
              开始浏览 <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => startReview('quiz')}
            className="card p-6 text-left hover:scale-[1.02] transition-all"
          >
            <Brain className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-primary mb-2">测试模式</h3>
            <p className="text-small text-neutral-dark">
              通过选择题测试掌握程度，根据正确率调整复习间隔。
            </p>
            <div className="mt-4 text-primary font-medium flex items-center gap-1">
              开始测试 <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
