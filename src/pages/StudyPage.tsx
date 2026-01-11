/**
 * 学习页面 - 显示例句学习卡片
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StudyCard } from '@/components/study';
import { useStudyStore } from '@/stores/studyStore';
import {
  getSentencesByGrammarPoint,
  getGrammarPointById,
  markSentenceAsLearned,
  markGrammarAsLearned,
  getUserProgress,
  unlockNextLesson,
  getLessonById,
} from '@/db/operations';
import type { Sentence, GrammarPoint, Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * 学习页面
 */
export function StudyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grammarId = searchParams.get('grammar');

  const {
    currentSentences,
    currentSentenceIndex,
    setCurrentSentences,
    goToSentence,
    nextSentence,
    previousSentence,
    resetStudy,
  } = useStudyStore();

  const [grammarPoint, setGrammarPoint] = useState<GrammarPoint | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [learnedSentencesInSession, setLearnedSentencesInSession] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!grammarId) {
      navigate('/lessons');
      return;
    }
    loadData(grammarId);
  }, [grammarId]);

  useEffect(() => {
    return () => {
      resetStudy();
    };
  }, [resetStudy]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [gpData, sentencesData] = await Promise.all([
        getGrammarPointById(id),
        getSentencesByGrammarPoint(id),
      ]);

      if (!gpData) {
        navigate('/lessons');
        return;
      }

      setGrammarPoint(gpData);
      setCurrentSentences(sentencesData);

      // 获取所属课程信息
      const lessonData = await getLessonById(gpData.lessonNumber);
      setLesson(lessonData || null);

      // 检查已学习的例句
      const progress = await getUserProgress();
      const learnedSet = new Set(progress?.learnedSentences || []);
      setLearnedSentencesInSession(learnedSet);
    } catch (error) {
      console.error('Failed to load study data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSentence = useCallback((): Sentence | null => {
    return currentSentences[currentSentenceIndex] || null;
  }, [currentSentences, currentSentenceIndex]);

  const isCurrentSentenceLearned = useCallback((): boolean => {
    const sentence = getCurrentSentence();
    return sentence ? learnedSentencesInSession.has(sentence.id) : false;
  }, [getCurrentSentence, learnedSentencesInSession]);

  const handleUnderstood = async () => {
    const sentence = getCurrentSentence();
    if (!sentence || !grammarPoint) return;

    try {
      // 标记例句为已学习
      await markSentenceAsLearned(sentence.id);
      setLearnedSentencesInSession(prev => new Set(prev).add(sentence.id));

      // 检查是否完成所有例句
      const allLearned = currentSentences.every(s =>
        learnedSentencesInSession.has(s.id) || s.id === sentence.id
      );

      if (allLearned) {
        // 标记语法点为已学习
        await markGrammarAsLearned(grammarPoint.id);

        // 如果是课程的最后一个语法点，可能需要解锁下一课
        const progress = await getUserProgress();
        if (lesson && progress) {
          const learnedInLesson = progress.learnedGrammar.filter(g => {
            const gp = currentSentences.find(s => s.grammarPoint === g.grammarId);
            return gp && gp.lessonNumber === lesson.id;
          });

          // 简单的检查：如果本课所有语法点都学完了
          if (learnedInLesson.length > 0 && lesson.completionRate >= 80) {
            await unlockNextLesson(lesson.id);
          }
        }

        setShowCompletion(true);
      } else {
        nextSentence();
      }
    } catch (error) {
      console.error('Failed to mark as learned:', error);
    }
  };

  const handleNext = () => {
    if (currentSentenceIndex < currentSentences.length - 1) {
      nextSentence();
    } else {
      // 最后一句，显示完成
      setShowCompletion(true);
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      previousSentence();
    }
  };

  const handleBackToGrammar = () => {
    if (grammarPoint) {
      navigate(`/lesson/${grammarPoint.lessonNumber}`);
    } else {
      navigate('/lessons');
    }
  };

  const handleNextGrammar = async () => {
    if (!grammarPoint || !lesson) return;

    // 找到下一个未学习的语法点
    const grammarPoints = await (
      await import('@/db/operations')
    ).getGrammarPointsByLesson(grammarPoint.lessonNumber);

    const currentIndex = grammarPoints.findIndex(g => g.id === grammarPoint.id);
    const nextGrammar = grammarPoints[currentIndex + 1];

    if (nextGrammar) {
      navigate(`/study?grammar=${encodeURIComponent(nextGrammar.id)}`);
    } else {
      navigate(`/lesson/${grammarPoint.lessonNumber}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!grammarPoint || currentSentences.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600">无法加载学习内容</p>
          <button
            onClick={handleBackToGrammar}
            className="mt-4 text-primary hover:underline"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  // 显示完成界面
  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">恭喜完成！</h1>
          <p className="text-gray-600 mb-6">
            你已经学习了「{grammarPoint.id}」的全部 {currentSentences.length} 个例句！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackToGrammar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              返回课程
            </button>
            <button
              onClick={handleNextGrammar}
              className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              继续学习下一个
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = getCurrentSentence();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={handleBackToGrammar}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        返回课程
      </button>

      {/* 学习卡片 */}
      {currentSentence && (
        <StudyCard
          sentence={currentSentence}
          grammarPoint={grammarPoint.id}
          currentIndex={currentSentenceIndex}
          totalCount={currentSentences.length}
          onUnderstood={handleUnderstood}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentSentenceIndex === 0}
          isLast={currentSentenceIndex === currentSentences.length - 1}
          isLearned={isCurrentSentenceLearned()}
        />
      )}
    </div>
  );
}
