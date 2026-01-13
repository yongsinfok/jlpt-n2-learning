/**
 * 语法点介绍组件 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { GrammarPoint } from '@/types';

export interface GrammarIntroProps {
  /** 语法点数据 */
  grammarPoint: GrammarPoint;
  /** 自定义类名 */
  className?: string;
}

/**
 * 语法点介绍组件
 * 显示语法点的名称、接续方式和详细说明
 */
export function GrammarIntro({ grammarPoint, className = '' }: GrammarIntroProps) {
  const navigate = useNavigate();

  const { id, grammarConnection, grammarExplanation, sentenceCount } = grammarPoint;

  const handleStartLearning = () => {
    navigate(`/study?grammar=${encodeURIComponent(id)}`);
  };

  return (
    <div className={`glass-card-strong p-8 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <BookOpen className="text-primary" size={20} />
        </div>
        <h1 className="text-2xl font-semibold gradient-text">{id}</h1>
      </div>

      {/* 接续方式 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          接续方式
        </h2>
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary p-4 rounded-r-xl">
          <p className="text-lg text-text-primary font-medium">{grammarConnection}</p>
        </div>
      </div>

      {/* 详细说明 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          详细说明
        </h2>
        <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
            {grammarExplanation}
          </p>
        </div>
      </div>

      {/* 例句数量提示 */}
      <div className="mb-6 text-sm text-text-secondary">
        本语法点共有 <span className="font-semibold text-primary">{sentenceCount}</span> 个例句
      </div>

      {/* 开始学习按钮 */}
      <button
        onClick={handleStartLearning}
        className="w-full flex items-center justify-center gap-2 btn-modern-primary py-3 px-6"
      >
        开始学习例句
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
