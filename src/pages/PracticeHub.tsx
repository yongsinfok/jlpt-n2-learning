/**
 * PracticeHub — Simplified practice with tabs
 * Tabs: 自由练习 | 错题本
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Shuffle, BookX, ArrowRight, CheckCircle2, XCircle,
  ChevronDown,
} from 'lucide-react';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { ProgressBar } from '@/components/common/ProgressBar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { generateRandomPractice, generateFillBlankQuestions } from '@/utils/quizGenerator';
import { getUnresolvedWrongAnswers } from '@/services/reviewService';


import type { QuizQuestion, WrongAnswer } from '@/types';

type Tab = 'practice' | 'wrong';

export function PracticeHub() {
  
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'wrong' ? 'wrong' : 'practice';

  const [tab, setTab] = useState<Tab>(initialTab as Tab);
  const [loading, setLoading] = useState(true);

  // Practice state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  // Wrong answers state
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [expandedGrammar, setExpandedGrammar] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const wrongs = await getUnresolvedWrongAnswers();
      setWrongAnswers(wrongs);
      setLoading(false);
    })();
  }, []);

  // ── Start practice ─────────────────────────────────────

  const startPractice = useCallback(async () => {
    setLoading(true);
    const qs = await generateRandomPractice(10);
    setQuestions(qs);
    setQIndex(0);
    setAnswers({});
    setSubmitted(false);
    setFinished(false);
    setLoading(false);
  }, []);

  // ── Answer handling ────────────────────────────────────

  const submitAnswer = useCallback((answer: string) => {
    const q = questions[qIndex];
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
    setSubmitted(true);
  }, [questions, qIndex]);

  const nextQuestion = useCallback(() => {
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  }, [qIndex, questions.length]);

  // ── Wrong answers grouped ──────────────────────────────

  const wrongByGrammar = wrongAnswers.reduce<Record<string, WrongAnswer[]>>((acc, w) => {
    if (!acc[w.grammarPoint]) acc[w.grammarPoint] = [];
    acc[w.grammarPoint].push(w);
    return acc;
  }, {});

  const startWrongReview = useCallback(async (grammarPoint?: string) => {
    setLoading(true);
    let qs: QuizQuestion[];
    if (grammarPoint) {
      qs = await generateFillBlankQuestions(grammarPoint, 5);
    } else {
      // All wrong answers
      const grammars = Object.keys(wrongByGrammar);
      const allQs: QuizQuestion[] = [];
      for (const g of grammars.slice(0, 3)) {
        const gq = await generateFillBlankQuestions(g, 2);
        allQs.push(...gq);
      }
      qs = allQs.slice(0, 10);
    }
    setQuestions(qs);
    setQIndex(0);
    setAnswers({});
    setSubmitted(false);
    setFinished(false);
    setTab('practice');
    setLoading(false);
  }, [wrongByGrammar]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载中..." />
      </div>
    );
  }

  // Active quiz view
  if (questions.length > 0 && !finished) {
    const q = questions[qIndex];
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => { setQuestions([]); setFinished(false); }}
            className="flex items-center gap-2 text-ink-soft hover:text-ink mb-4 transition-colors text-sm"
          >
            ← 退出练习
          </button>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-mute">练习</span>
            <span className="text-sm text-ink-mute">{qIndex + 1}/{questions.length}</span>
          </div>
          <ProgressBar progress={((qIndex + 1) / questions.length) * 100} size="sm" />

          <div className="mt-4">
            <QuestionCard
              question={q}
              isSubmitted={submitted}
              userAnswer={answers[q.id]}
              onSelectAnswer={(a) => { if (!submitted) submitAnswer(a); }}
              showExplanation={submitted}
            />
          </div>

          {submitted && (
            <button
              onClick={nextQuestion}
              className="mt-4 w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              {qIndex < questions.length - 1 ? '下一题' : '查看结果'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results view
  if (finished && questions.length > 0) {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${pct >= 70 ? 'bg-pine-pale' : 'bg-accent-pale'}`}>
            {pct >= 70 ? <CheckCircle2 size={40} className="text-pine" /> : <XCircle size={40} className="text-accent" />}
          </div>
          <h2 className="text-2xl font-bold font-mincho text-ink mb-2">练习完成</h2>
          <div className="text-4xl font-bold text-ink mb-1">{pct}%</div>
          <p className="text-sm text-ink-mute mb-8">{correct}/{questions.length} 正确</p>

          <div className="flex gap-3">
            <button
              onClick={startPractice}
              className="flex-1 py-3 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent-pale transition-colors"
            >
              再来一组
            </button>
            <button
              onClick={() => { setQuestions([]); setFinished(false); }}
              className="flex-1 py-3 border border-border text-ink-soft rounded-xl font-medium hover:bg-surface-hover transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main tab view
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold font-mincho text-ink mb-2">练习</h1>
        <p className="text-sm text-ink-soft mb-6">巩固已学内容</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-dim rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('practice')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'practice' ? 'bg-surface text-ink shadow-sm' : 'text-ink-mute hover:text-ink-soft'
            }`}
          >
            <Shuffle size={16} className="inline mr-1.5" />自由练习
          </button>
          <button
            onClick={() => setTab('wrong')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'wrong' ? 'bg-surface text-ink shadow-sm' : 'text-ink-mute hover:text-ink-soft'
            }`}
          >
            <BookX size={16} className="inline mr-1.5" />错题本
            {wrongAnswers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-accent-pale text-accent text-[10px] rounded-full font-bold">{wrongAnswers.length}</span>
            )}
          </button>
        </div>

        {tab === 'practice' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-pale rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shuffle size={32} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">随机练习</h3>
            <p className="text-sm text-ink-soft mb-6">从已学内容中随机抽取10道题</p>
            <button
              onClick={startPractice}
              className="px-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all active:scale-95"
            >
              开始练习
            </button>
          </div>
        )}

        {tab === 'wrong' && (
          <div>
            {wrongAnswers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 size={40} className="text-pine mx-auto mb-3" />
                <p className="text-ink-soft">没有错题，继续保持！</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => startWrongReview()}
                  className="w-full bg-accent text-white rounded-xl py-3 font-semibold mb-6 hover:bg-accent/90 transition-colors"
                >
                  复习全部错题 ({wrongAnswers.length})
                </button>

                {Object.entries(wrongByGrammar).map(([grammar, items]) => (
                  <div key={grammar} className="mb-2">
                    <button
                      onClick={() => setExpandedGrammar(expandedGrammar === grammar ? null : grammar)}
                      className="w-full flex items-center justify-between p-3 bg-surface border border-border rounded-xl hover:bg-surface-hover transition-colors"
                    >
                      <span className="font-medium text-ink text-sm">{grammar}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-mute">{items.length} 题</span>
                        <ChevronDown size={16} className={`text-ink-mute transition-transform ${expandedGrammar === grammar ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {expandedGrammar === grammar && (
                      <div className="mt-1 pl-3">
                        <button
                          onClick={() => startWrongReview(grammar)}
                          className="text-sm text-accent hover:underline py-2"
                        >
                          复习此语法点 →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
