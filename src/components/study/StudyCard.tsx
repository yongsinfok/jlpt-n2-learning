import { useState, useMemo, memo } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import DOMPurify from 'dompurify';
import type { Sentence } from '@/types';

export interface StudyCardProps {
  sentence: Sentence;
  grammarPoint: string;
  grammarExplanation?: string;
  currentIndex: number;
  totalCount: number;
  onUnderstood?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isLearned?: boolean;
}

export const StudyCard = memo(function StudyCard({
  sentence,
  grammarPoint,
  grammarExplanation,
  currentIndex,
  totalCount,
  onUnderstood,
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false,
  isLearned = false,
}: StudyCardProps) {
  const { sentence: text, furigana, translation, audioPath, wordByWord } = sentence;
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showGrammarNote, setShowGrammarNote] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const highlighted = useMemo(() => {
    if (!text) return '';
    const esc = grammarPoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return DOMPurify.sanitize(
      text.replace(new RegExp(`(${esc})`, 'g'), '<mark class="grammar-highlight">$1</mark>'),
      { ALLOWED_TAGS: ['mark'], ALLOWED_ATTR: ['class'] }
    );
  }, [text, grammarPoint]);

  const analysisHtml = useMemo(() => {
    if (!wordByWord || !wordByWord.includes('<')) return null;
    return DOMPurify.sanitize(wordByWord, {
      ALLOWED_TAGS: ['h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'div', 'span'],
      ALLOWED_ATTR: ['class'],
    });
  }, [wordByWord]);

  const handleUnderstood = () => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 600);
    onUnderstood?.();
  };

  const progress = ((currentIndex + 1) / totalCount) * 100;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-ink-mute min-w-[4rem]">
          {String(currentIndex + 1).padStart(2, '0')}/{String(totalCount).padStart(2, '0')}
        </span>
        <div className="flex-1 h-1.5 bg-border-light rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>
        {isLearned && (
          <span className="flex items-center gap-1 text-xs text-pine font-medium">
            <Check size={14} />已完成
          </span>
        )}
      </div>

      {/* Sentence card */}
      <div className={`bg-surface border border-border rounded-[14px] shadow-sm overflow-hidden transition-all duration-300 ${celebrate ? 'scale-[1.01]' : ''}`}>
        {/* Grammar header */}
        <div className="px-6 pt-6 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowGrammarNote(v => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-pale text-accent rounded-full text-sm font-medium hover:bg-accent-soft transition-colors"
            >
              <span>{grammarPoint}</span>
              {grammarExplanation && (
                showGrammarNote ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            {audioPath && <AudioPlayer audioPath={audioPath} showProgress={false} showPlaybackRate={false} />}
          </div>
          {showGrammarNote && grammarExplanation && (
            <p className="mt-3 text-sm text-ink-soft leading-relaxed pl-3 border-l-2 border-accent-soft">
              {grammarExplanation}
            </p>
          )}
        </div>

        {/* Sentence - hero */}
        <div className="px-6 py-8 text-center">
          <p
            className="text-2xl sm:text-3xl md:text-4xl leading-relaxed text-ink"
            style={{ fontFamily: '"Noto Serif JP", "Yu Mincho", serif', fontWeight: 500, letterSpacing: '0.02em' }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

        {/* Furigana - subtle */}
        {furigana && furigana !== text && (
          <div className="px-6 pb-2 text-center">
            <p className="text-sm text-ink-faint" style={{ fontFamily: '"Noto Sans JP", sans-serif', letterSpacing: '0.04em' }}>
              {furigana}
            </p>
          </div>
        )}

        {/* Translation */}
        {translation && (
          <div className="px-6 pb-6">
            <p className="text-base text-ink-soft leading-relaxed text-center">
              {translation}
            </p>
          </div>
        )}

        {/* Word analysis toggle */}
        {(wordByWord) && (
          <div className="border-t border-border/50">
            <button
              onClick={() => setShowAnalysis(v => !v)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm text-ink-mute hover:text-ink hover:bg-surface-dim transition-colors"
            >
              <span>逐詞解析</span>
              {showAnalysis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAnalysis && (
              <div className="px-6 pb-5">
                <div className="bg-bg-warm rounded-[10px] p-4 text-sm text-ink-soft leading-relaxed">
                  {analysisHtml
                    ? <div dangerouslySetInnerHTML={{ __html: analysisHtml }} />
                    : <p className="whitespace-pre-wrap">{wordByWord}</p>
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="w-12 h-12 rounded-[10px] flex items-center justify-center bg-surface border border-border text-ink-soft hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button
          onClick={handleUnderstood}
          className={`flex-1 py-3.5 rounded-[10px] font-semibold text-base transition-all duration-300 ${
            isLearned
              ? 'bg-pine-pale text-pine border border-pine/30'
              : 'bg-accent text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
          } ${celebrate ? 'scale-[1.03]' : ''}`}
        >
          {isLearned ? (
            <span className="flex items-center justify-center gap-2"><Check size={18} /> 已掌握</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Check size={18} /> 理解了，下一句
            </span>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          className="w-12 h-12 rounded-[10px] flex items-center justify-center bg-surface border border-border text-ink-soft hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
});
