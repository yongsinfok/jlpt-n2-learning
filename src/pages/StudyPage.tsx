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
} from '@/services/studyService';
import type { Sentence, GrammarPoint, Lesson } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
    if (!grammarId) { navigate('/lessons'); return; }
    loadData(grammarId);
  }, [grammarId]);

  useEffect(() => () => resetStudy(), [resetStudy]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [gpData, sentencesData] = await Promise.all([
        getGrammarPointById(id),
        getSentencesByGrammarPoint(id),
      ]);
      if (!gpData) { navigate('/lessons'); return; }
      setGrammarPoint(gpData);
      setCurrentSentences(sentencesData);
      const lessonData = await getLessonById(gpData.lessonNumber);
      setLesson(lessonData || null);
      const progress = await getUserProgress();
      setLearnedSentencesInSession(new Set(progress?.learnedSentences || []));
    } catch (e) {
      console.error('Failed to load study data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSentence = useCallback((): Sentence | null =>
    currentSentences[currentSentenceIndex] || null, [currentSentences, currentSentenceIndex]);

  const isCurrentSentenceLearned = useCallback((): boolean => {
    const s = getCurrentSentence();
    return s ? learnedSentencesInSession.has(s.id) : false;
  }, [getCurrentSentence, learnedSentencesInSession]);

  const handleUnderstood = async () => {
    const sentence = getCurrentSentence();
    if (!sentence || !grammarPoint) return;
    try {
      await markSentenceAsLearned(sentence.id);
      setLearnedSentencesInSession(prev => new Set(prev).add(sentence.id));
      const allLearned = currentSentences.every(s =>
        learnedSentencesInSession.has(s.id) || s.id === sentence.id
      );
      if (allLearned) {
        await markGrammarAsLearned(grammarPoint.id);
        const progress = await getUserProgress();
        if (lesson && progress) {
          const learnedInLesson = progress.learnedGrammar.filter(g => {
            const gp = currentSentences.find(s => s.grammarPoint === g.grammarId);
            return gp && gp.lessonNumber === lesson.id;
          });
          if (learnedInLesson.length > 0 && lesson.completionRate >= 80) {
            await unlockNextLesson(lesson.id);
          }
        }
        setShowCompletion(true);
      } else {
        nextSentence();
      }
    } catch (e) {
      console.error('Failed:', e);
    }
  };

  const handleNext = useCallback(() => {
    if (currentSentenceIndex < currentSentences.length - 1) {
      nextSentence();
    } else {
      setShowCompletion(true);
    }
  }, [currentSentenceIndex, currentSentences.length, nextSentence]);

  const handlePrevious = useCallback(() => {
    if (currentSentenceIndex > 0) {
      previousSentence();
    }
  }, [currentSentenceIndex, previousSentence]);

  const handleNextGrammar = async () => {
    if (!grammarPoint || !lesson) return;
    const { getGrammarPointsByLesson } = await import('@/db/operations');
    const grammarPoints = await getGrammarPointsByLesson(grammarPoint.lessonNumber);
    const idx = grammarPoints.findIndex(g => g.id === grammarPoint.id);
    const next = grammarPoints[idx + 1];
    if (next) {
      navigate(`/study?grammar=${encodeURIComponent(next.id)}`);
    } else {
      navigate(`/lesson/${grammarPoint.lessonNumber}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!grammarPoint || currentSentences.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="noren-card p-8 text-center max-w-sm">
          <p className="text-ink-soft mb-6">無法加載學習內容</p>
          <button onClick={() => navigate('/lessons')} className="bg-accent text-white px-6 py-3 rounded-[10px] font-medium hover:bg-accent-hover transition-colors">返回課程</button>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="noren-card p-8 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-pine-pale flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-pine" />
          </div>
          <h1 className="text-2xl font-mincho font-bold text-ink mb-2">完成！</h1>
          <p className="text-ink-soft mb-2">「{grammarPoint.id}」</p>
          <p className="text-sm text-ink-mute mb-8">{currentSentences.length} 個例句全部學習完畢</p>
          <div className="space-y-3">
            <button onClick={handleNextGrammar} className="w-full bg-accent text-white py-3 rounded-[10px] font-semibold hover:bg-accent-hover transition-colors shadow-sm">繼續下一個</button>
            <button onClick={() => navigate(`/lesson/${grammarPoint.lessonNumber}`)} className="w-full bg-surface border border-border py-3 rounded-[10px] font-medium text-ink-soft hover:bg-surface-hover transition-colors">返回課程</button>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = getCurrentSentence();

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={() => navigate(`/lesson/${grammarPoint.lessonNumber}`)} className="flex items-center gap-1.5 text-sm text-ink-mute hover:text-accent transition-colors">
            <ArrowLeft size={16} /> 課程 {grammarPoint.lessonNumber}
          </button>
          {lesson && (
            <span className="text-xs text-ink-faint font-mono">{lesson.id} · {currentSentences.length} 句</span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentSentence && (
          <StudyCard
            sentence={currentSentence}
            grammarPoint={grammarPoint.id}
            grammarExplanation={grammarPoint.grammarExplanation}
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
    </div>
  );
}
