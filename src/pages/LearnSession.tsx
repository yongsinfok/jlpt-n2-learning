/**
 * LearnSession — Single-page learning flow
 * 选课 → 学例句 → 微测验 → 下个语法点 → ... → 课后测试 → 完成总结
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, 
  Lock, Trophy, ArrowRight, RotateCcw,
} from 'lucide-react';
import { StudyCard } from '@/components/study/StudyCard';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { ProgressBar } from '@/components/common/ProgressBar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { generateFillBlankQuestions, generateLessonTest } from '@/utils/quizGenerator';
import {
  getAllLessons,
  getGrammarPointsByLesson,
  getSentencesByGrammarPoint,

  markSentenceAsLearned,
  markGrammarAsLearned,
  unlockNextLesson,


  updateLessonStatus,
} from '@/services/studyService';
import { LESSON_CONFIG } from '@/utils/constants';
import type { Lesson, GrammarPoint, Sentence, QuizQuestion } from '@/types';

// ── State Machine ──────────────────────────────────────────

type Step =
  | { phase: 'select' }
  | { phase: 'study'; lesson: Lesson; grammar: GrammarPoint; sentences: Sentence[]; sentenceIndex: number }
  | { phase: 'micro-quiz'; lesson: Lesson; grammar: GrammarPoint; questions: QuizQuestion[]; questionIndex: number; answers: Record<string, string>; submitted: boolean }
  | { phase: 'lesson-test'; lesson: Lesson; questions: QuizQuestion[]; questionIndex: number; answers: Record<string, string>; submitted: boolean }
  | { phase: 'summary'; lesson: Lesson; microScore: { correct: number; total: number }; testScore: { correct: number; total: number } };

// ── Component ──────────────────────────────────────────────

export function LearnSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ phase: 'select' });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [allGrammars, setAllGrammars] = useState<{ lessonId: number; grammars: GrammarPoint[] }[]>([]);
  const [microCorrect, setMicroCorrect] = useState(0);
  const [microTotal, setMicroTotal] = useState(0);

  // Load lessons on mount
  useEffect(() => {
    (async () => {
      const data = await getAllLessons();
      setLessons(data.sort((a, b) => a.id - b.id));
      setLoading(false);
    })();
  }, []);

  // ── Start a lesson ─────────────────────────────────────

  const startLesson = useCallback(async (lesson: Lesson) => {
    const grammars = await getGrammarPointsByLesson(lesson.id);
    if (grammars.length === 0) return;

    setAllGrammars(prev => {
      const filtered = prev.filter(g => g.lessonId !== lesson.id);
      return [...filtered, { lessonId: lesson.id, grammars }];
    });

    // Find first unlearned grammar or first grammar
    const nextGrammar = grammars.find(g => !g.isLearned) || grammars[0];
    const sentences = await getSentencesByGrammarPoint(nextGrammar.id);

    setStep({ phase: 'study', lesson, grammar: nextGrammar, sentences, sentenceIndex: 0 });
  }, []);

  // ── Study → Micro Quiz ─────────────────────────────────

  const onSentenceUnderstood = useCallback(async (sentenceId: string) => {
    await markSentenceAsLearned(sentenceId);
  }, []);

  const onStudyComplete = useCallback(async (lesson: Lesson, grammar: GrammarPoint) => {
    await markGrammarAsLearned(grammar.id);
    const questions = await generateFillBlankQuestions(grammar.id, 3);
    if (questions.length === 0) {
      // No questions possible, skip to next grammar
      advanceToNextGrammar(lesson, grammar);
      return;
    }
    setMicroCorrect(0);
    setMicroTotal(0);
    setStep({ phase: 'micro-quiz', lesson, grammar, questions, questionIndex: 0, answers: {}, submitted: false });
  }, []);

  // ── Micro Quiz ─────────────────────────────────────────

  const submitMicroAnswer = useCallback((answer: string) => {
    setStep(prev => {
      if (prev.phase !== 'micro-quiz') return prev;
      const q = prev.questions[prev.questionIndex];
      const isCorrect = answer === q.correctAnswer;
      if (isCorrect) setMicroCorrect(c => c + 1);
      setMicroTotal(t => t + 1);
      return { ...prev, answers: { ...prev.answers, [q.id]: answer }, submitted: true };
    });
  }, []);

  const nextMicroQuestion = useCallback(() => {
    setStep(prev => {
      if (prev.phase !== 'micro-quiz') return prev;
      if (prev.questionIndex < prev.questions.length - 1) {
        return { ...prev, questionIndex: prev.questionIndex + 1, submitted: false };
      }
      // Micro quiz done → advance to next grammar
      advanceToNextGrammar(prev.lesson, prev.grammar);
      return prev;
    });
  }, []);

  // ── Advance to next grammar or lesson test ─────────────

  const advanceToNextGrammar = useCallback((lesson: Lesson, currentGrammar: GrammarPoint) => {
    const entry = allGrammars.find(g => g.lessonId === lesson.id);
    if (!entry) {
      // No grammar data loaded yet, go to lesson test
      startLessonTest(lesson);
      return;
    }

    const currentIdx = entry.grammars.findIndex(g => g.id === currentGrammar.id);
    const nextIdx = currentIdx + 1;

    if (nextIdx < entry.grammars.length) {
      // Next grammar
      const nextGrammar = entry.grammars[nextIdx];
      (async () => {
        const sentences = await getSentencesByGrammarPoint(nextGrammar.id);
        setStep({ phase: 'study', lesson, grammar: nextGrammar, sentences, sentenceIndex: 0 });
      })();
    } else {
      // All grammars done → lesson test
      startLessonTest(lesson);
    }
  }, [allGrammars]);

  const startLessonTest = useCallback(async (lesson: Lesson) => {
    const questions = await generateLessonTest(lesson.id, 10);
    setStep({ phase: 'lesson-test', lesson, questions, questionIndex: 0, answers: {}, submitted: false });
  }, []);

  // ── Lesson Test ────────────────────────────────────────

  const submitTestAnswer = useCallback((answer: string) => {
    setStep(prev => {
      if (prev.phase !== 'lesson-test') return prev;
      const q = prev.questions[prev.questionIndex];
      return { ...prev, answers: { ...prev.answers, [q.id]: answer }, submitted: true };
    });
  }, []);

  const nextTestQuestion = useCallback(async () => {
    setStep(prev => {
      if (prev.phase !== 'lesson-test') return prev;
      if (prev.questionIndex < prev.questions.length - 1) {
        return { ...prev, questionIndex: prev.questionIndex + 1, submitted: false };
      }
      // Test done → calculate score & summary
      const testCorrect = prev.questions.filter(q => prev.answers[q.id] === q.correctAnswer).length;
      const testTotal = prev.questions.length;
      setStep({ phase: 'summary', lesson: prev.lesson, microScore: { correct: microCorrect, total: microTotal }, testScore: { correct: testCorrect, total: testTotal } });
      return prev;
    });
  }, [microCorrect, microTotal]);

  // ── Summary actions ────────────────────────────────────

  const onSummaryNext = useCallback(async (lesson: Lesson, testScore: { correct: number; total: number }) => {
    const passed = testScore.total > 0 && testScore.correct / testScore.total >= LESSON_CONFIG.PASS_THRESHOLD;
    if (passed) {
      await updateLessonStatus(lesson.id, { isCompleted: true, completionRate: 100 });
      await unlockNextLesson(lesson.id);
      const nextLesson = lessons.find(l => l.id === lesson.id + 1);
      if (nextLesson && nextLesson.isUnlocked) {
        startLesson(nextLesson);
        return;
      }
    }
    setStep({ phase: 'select' });
  }, [lessons, startLesson]);

  // ── Render ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载课程..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => step.phase === 'select' ? navigate('/') : setStep({ phase: 'select' })}
          className="flex items-center gap-2 text-ink-soft hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{step.phase === 'select' ? '首页' : '选课'}</span>
        </button>

        {step.phase === 'select' && renderSelect()}
        {step.phase === 'study' && renderStudy()}
        {step.phase === 'micro-quiz' && renderMicroQuiz()}
        {step.phase === 'lesson-test' && renderLessonTest()}
        {step.phase === 'summary' && renderSummary()}
      </div>
    </div>
  );

  // ── Step: Select Lesson ────────────────────────────────

  function renderSelect() {
    return (
      <div>
        <h1 className="text-2xl font-bold font-mincho text-ink mb-2">选择课程</h1>
        <p className="text-sm text-ink-soft mb-8">选择一个课程开始学习</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {lessons.map(lesson => {
            const canStart = lesson.isUnlocked;
            return (
              <button
                key={lesson.id}
                onClick={() => canStart && startLesson(lesson)}
                disabled={!canStart}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-center
                  ${canStart
                    ? 'border-accent/30 bg-surface hover:border-accent hover:shadow-md active:scale-95 cursor-pointer'
                    : 'border-border bg-surface-dim cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className={`text-2xl font-bold mb-1 ${canStart ? 'text-ink' : 'text-ink-mute'}`}>
                  {lesson.id}
                </div>
                <div className="text-[10px] text-ink-mute">
                  {lesson.isCompleted ? '✅ 完了' : canStart ? `${lesson.grammarPoints.length} 文法` : <Lock size={14} className="mx-auto" />}
                </div>
                {canStart && !lesson.isCompleted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step: Study Sentences ──────────────────────────────

  function renderStudy() {
    if (step.phase !== 'study') return null;
    const { lesson, grammar, sentences, sentenceIndex } = step;
    if (sentences.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-ink-soft mb-4">这个语法点暂无例句</p>
          <button onClick={() => onStudyComplete(lesson, grammar)} className="px-6 py-2 bg-accent text-white rounded-lg">
            继续
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-ink-mute">Lesson {lesson.id}</span>
            <h2 className="text-lg font-bold font-mincho text-ink">{grammar.id}</h2>
          </div>
          <span className="text-xs text-ink-mute bg-surface-dim px-2 py-1 rounded">
            学例句
          </span>
        </div>

        <StudyCard
          sentence={sentences[sentenceIndex]}
          grammarPoint={grammar.id}
          grammarExplanation={grammar.grammarExplanation}
          currentIndex={sentenceIndex}
          totalCount={sentences.length}
          isFirst={sentenceIndex === 0}
          isLast={sentenceIndex === sentences.length - 1}
          onUnderstood={() => {
            onSentenceUnderstood(sentences[sentenceIndex].id);
            if (sentenceIndex < sentences.length - 1) {
              setStep(prev => ({ ...prev as Step & { phase: 'study' }, sentenceIndex: sentenceIndex + 1 }));
            } else {
              onStudyComplete(lesson, grammar);
            }
          }}
          onNext={() => setStep(prev => ({ ...prev as Step & { phase: 'study' }, sentenceIndex: Math.min(sentenceIndex + 1, sentences.length - 1) }))}
          onPrevious={() => setStep(prev => ({ ...prev as Step & { phase: 'study' }, sentenceIndex: Math.max(sentenceIndex - 1, 0) }))}
        />
      </div>
    );
  }

  // ── Step: Micro Quiz ───────────────────────────────────

  function renderMicroQuiz() {
    if (step.phase !== 'micro-quiz') return null;
    const { grammar, questions, questionIndex, answers, submitted } = step;
    const question = questions[questionIndex];
    if (!question) return null;

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-ink-mute">小测验</span>
            <h2 className="text-lg font-bold font-mincho text-ink">{grammar.id}</h2>
          </div>
          <span className="text-xs text-ink-mute bg-accent-pale text-accent px-2 py-1 rounded-full font-medium">
            {questionIndex + 1}/{questions.length}
          </span>
        </div>

        <ProgressBar progress={((questionIndex + 1) / questions.length) * 100} showLabel size="sm" />

        <div className="mt-4">
          <QuestionCard
            question={question}
            isSubmitted={submitted}
            userAnswer={answers[question.id]}
            onSelectAnswer={(answer) => {
              if (!submitted) submitMicroAnswer(answer);
            }}
            showExplanation={submitted}
          />
        </div>

        {submitted && (
          <button
            onClick={nextMicroQuestion}
            className="mt-4 w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            {questionIndex < questions.length - 1 ? '下一题' : '继续学习'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    );
  }

  // ── Step: Lesson Test ──────────────────────────────────

  function renderLessonTest() {
    if (step.phase !== 'lesson-test') return null;
    const { lesson, questions, questionIndex, answers, submitted } = step;
    const question = questions[questionIndex];
    if (!question) return null;

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-ink-mute">课后测试</span>
            <h2 className="text-lg font-bold font-mincho text-ink">Lesson {lesson.id}</h2>
          </div>
          <span className="text-xs text-ink-mute bg-pine-pale text-pine px-2 py-1 rounded-full font-medium">
            {questionIndex + 1}/{questions.length}
          </span>
        </div>

        <ProgressBar progress={((questionIndex + 1) / questions.length) * 100} showLabel size="sm" />

        <div className="mt-4">
          <QuestionCard
            question={question}
            isSubmitted={submitted}
            userAnswer={answers[question.id]}
            onSelectAnswer={(answer) => {
              if (!submitted) submitTestAnswer(answer);
            }}
            showExplanation={submitted}
          />
        </div>

        {submitted && (
          <button
            onClick={nextTestQuestion}
            className="mt-4 w-full py-3 bg-pine text-white rounded-xl font-semibold hover:bg-pine/90 transition-colors flex items-center justify-center gap-2"
          >
            {questionIndex < questions.length - 1 ? '下一题' : '查看结果'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    );
  }

  // ── Step: Summary ──────────────────────────────────────

  function renderSummary() {
    if (step.phase !== 'summary') return null;
    const { lesson, microScore, testScore } = step;
    const passed = testScore.total > 0 && testScore.correct / testScore.total >= LESSON_CONFIG.PASS_THRESHOLD;
    const microPct = microScore.total > 0 ? Math.round((microScore.correct / microScore.total) * 100) : 0;
    const testPct = testScore.total > 0 ? Math.round((testScore.correct / testScore.total) * 100) : 0;

    return (
      <div className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${passed ? 'bg-pine-pale' : 'bg-accent-pale'}`}>
          {passed ? <Trophy size={40} className="text-pine" /> : <RotateCcw size={40} className="text-accent" />}
        </div>

        <h2 className="text-2xl font-bold font-mincho text-ink mb-2">
          Lesson {lesson.id} {passed ? '完成！' : '未通过'}
        </h2>
        <p className="text-ink-soft mb-8">
          {passed ? '太棒了，继续学习下一课吧！' : `需要正确率 ≥ ${Math.round(LESSON_CONFIG.PASS_THRESHOLD * 100)}%，再试一次吧`}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className={`text-3xl font-bold ${microPct >= 70 ? 'text-pine' : 'text-accent'}`}>{microPct}%</div>
            <div className="text-xs text-ink-mute mt-1">小测验</div>
            <div className="text-xs text-ink-mute">{microScore.correct}/{microScore.total}</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className={`text-3xl font-bold ${testPct >= 70 ? 'text-pine' : 'text-accent'}`}>{testPct}%</div>
            <div className="text-xs text-ink-mute mt-1">课后测试</div>
            <div className="text-xs text-ink-mute">{testScore.correct}/{testScore.total}</div>
          </div>
        </div>

        <div className="flex gap-3 max-w-sm mx-auto">
          {!passed && (
            <button
              onClick={() => startLessonTest(lesson)}
              className="flex-1 py-3 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent-pale transition-colors"
            >
              重考
            </button>
          )}
          {passed && (
            <button
              onClick={() => onSummaryNext(lesson, testScore)}
              className="flex-1 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              下一课 <ArrowRight size={18} />
            </button>
          )}
          <button
            onClick={() => setStep({ phase: 'select' })}
            className="flex-1 py-3 border border-border text-ink-soft rounded-xl font-medium hover:bg-surface-hover transition-colors"
          >
            回到选课
          </button>
        </div>
      </div>
    );
  }
}
