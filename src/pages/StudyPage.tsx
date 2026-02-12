/**
 * 学习页面 - Glassmorphism Design with Japanese Colors
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
 * 学习页面 - Glassmorphism Design
 */
export function StudyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grammarId = searchParams.get('grammar');

  const {
    currentSentences,
    currentSentenceIndex,
    setCurrentSentences,
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

          // 检查：如果本课所有语法点都学完了
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

  // ========================================
  // LOADING STATE - Glassmorphism Design
  // ========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-washi bg-seigaiha">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="glass-card-subtle rounded-2xl p-12 flex justify-center items-center min-h-[400px] animate-spring-bounce">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE - Glassmorphism Design
  // ========================================
  if (!grammarPoint || currentSentences.length === 0) {
    return (
      <div className="min-h-screen bg-washi bg-seigaiha">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="glass-card-strong rounded-2xl p-8 text-center animate-spring-bounce">
            <p className="text-sumi text-lg mb-6">无法加载学习内容</p>
            <button
              onClick={handleBackToGrammar}
              className="btn-glass px-8 py-4 rounded-xl font-semibold hover-lift"
              >
              返回课程
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // COMPLETION STATE - Glassmorphism Design
  // ========================================
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-washi bg-seigaiha">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass-card-strong glass-glow animate-spring-bounce rounded-2xl p-8 text-center">
            {/* Success Icon */}
            <CheckCircle2
              className="mx-auto mb-6 text-matcha animate-spring-bounce"
              size={80}
              strokeWidth={2}
            />

            {/* Heading */}
            <h1 className="text-4xl font-bold text-sumi mb-4 animate-fade-in-up">
              恭喜完成！
            </h1>

            {/* Description */}
            <p className="text-sumi/80 text-lg mb-8 animate-fade-in-up animate-delay-200">
              你已经学习了「{grammarPoint.id}」的全部 {currentSentences.length} 个例句！
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
              {/* Secondary Button - Glass Effect */}
              <button
                onClick={handleBackToGrammar}
                className="glass-card px-8 py-4 rounded-xl font-semibold text-sumi hover-lift transition-all"
              >
                返回课程
              </button>

              {/* Primary Button - Sakura Pink */}
              <button
                onClick={handleNextGrammar}
                className="btn-glass-sakura px-8 py-4 rounded-xl font-semibold hover-lift shadow-lg"
              >
                继续学习下一个
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = getCurrentSentence();

  // ========================================
  // NORMAL STATE - Study Card
  // ========================================
  return (
    <div className="min-h-screen bg-washi bg-seigaiha">
      {/* 返回按钮 */}
      <button
        onClick={handleBackToGrammar}
        className="flex items-center gap-2 text-sumi/70 hover:text-sakura mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={22} />
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
