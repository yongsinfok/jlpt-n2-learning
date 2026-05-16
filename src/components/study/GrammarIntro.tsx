import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { GrammarPoint } from '@/types';

export interface GrammarIntroProps {
  grammarPoint: GrammarPoint;
  className?: string;
}

export function GrammarIntro({ grammarPoint, className = '' }: GrammarIntroProps) {
  const navigate = useNavigate();

  const { id, grammarConnection, grammarExplanation, sentenceCount } = grammarPoint;

  const handleStartLearning = () => {
    navigate(`/study?grammar=${encodeURIComponent(id)}`);
  };

  return (
    <div className={`bg-surface border border-border rounded-[10px] shadow-sm p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-[10px] bg-accent-pale flex items-center justify-center">
          <BookOpen className="text-accent" size={20} />
        </div>
        <h1 className="text-2xl font-semibold text-ink">{id}</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide mb-2">
          接续方式
        </h2>
        <div className="bg-accent-pale border-l-4 border-accent p-4 rounded-r-[10px]">
          <p className="text-lg text-ink font-medium">{grammarConnection}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide mb-2">
          详细说明
        </h2>
        <div className="bg-surface/80 p-4 rounded-[8px] border border-light">
          <p className="text-ink-soft leading-relaxed whitespace-pre-wrap">
            {grammarExplanation}
          </p>
        </div>
      </div>

      <div className="mb-6 text-sm text-ink-soft">
        本语法点共有 <span className="font-semibold text-accent">{sentenceCount}</span> 个例句
      </div>

      <button
        onClick={handleStartLearning}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-accent hover:bg-accent-hover text-white font-medium rounded-[8px] transition-colors shadow-sm"
      >
        开始学习例句
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
