/**
 * 学习卡片组件 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 * 优化版本：XSS 防护、性能优化、可访问性增强
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Star, ArrowLeft, ArrowRight, EyeOff } from 'lucide-react';
import DOMPurify from 'dompurify';
import { AudioPlayer } from './AudioPlayer';
import type { Sentence } from '@/types';

export interface StudyCardProps {
  sentence: Sentence;
  grammarPoint: string;
  currentIndex: number;
  totalCount: number;
  onUnderstood?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isLearned?: boolean;
  className?: string;
}

/**
 * 学习卡片组件 - Modern Glassmorphism Design
 * 优雅的玻璃拟态设计，渐变背景
 */
export const StudyCard = memo(function StudyCard({
  sentence,
  grammarPoint,
  currentIndex,
  totalCount,
  onUnderstood,
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false,
  isLearned = false,
  className = '',
}: StudyCardProps) {
  const { sentence: text, furigana, translation, audioPath, wordByWord } = sentence;

  // 状态
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 重置状态当句子改变时
  useEffect(() => {
    setIsTransitioning(true);
    setShowFurigana(true);
    setShowTranslation(true);
    setShowAnalysis(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [sentence.id]);

  // 高亮语法点 - 使用 useMemo 优化性能，并使用 DOMPurify 防止 XSS
  const highlightedGrammar = useMemo(() => {
    if (!text) return '';
    const escapedGrammar = grammarPoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedGrammar})`, 'g');
    const result = text.replace(regex, '<mark class="grammar-highlight">$1</mark>');
    return DOMPurify.sanitize(result, {
      ALLOWED_TAGS: ['mark'],
      ALLOWED_ATTR: ['class']
    });
  }, [text, grammarPoint]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setShowFurigana(v => !v); }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); setShowTranslation(v => !v); }
      if (e.key === 'a' || e.key === 'A') { e.preventDefault(); setShowAnalysis(v => !v); }
      if (e.key === 'ArrowLeft' && !isFirst && onPrevious) { e.preventDefault(); onPrevious(); }
      if (e.key === 'ArrowRight' && !isLast && onNext) { e.preventDefault(); onNext(); }
      if (e.key === ' ' && !e.repeat) { e.preventDefault(); /* Play audio */ }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onPrevious, onNext]);

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* 顶部进度条 - Modern Design */}
      <div className="flex items-center justify-between mb-8 px-2">
        <span className="text-xs font-medium tracking-wide text-text-secondary">
          Sentence <span className="font-semibold text-primary">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-text-muted mx-1">/</span>
          {String(totalCount).padStart(2, '0')}
        </span>
        <div className="flex gap-1.5 h-1.5 flex-1 max-w-[240px] mx-6">
          {Array.from({ length: Math.min(totalCount, 12) }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 rounded-full transition-all duration-500 ${
                idx < currentIndex
                  ? 'bg-gradient-to-r from-primary to-secondary'
                  : idx === currentIndex
                  ? 'bg-gradient-to-r from-primary to-secondary scale-y-150 shadow-glow'
                  : 'bg-gray-200'
              }`}
              style={{ transitionDelay: `${idx * 20}ms` }}
            />
          ))}
        </div>
        <div className="flex items-center text-xs text-text-secondary">
          {isLearned ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white font-medium text-xs rounded-full shadow-sm">
              <Star size={12} className="fill-white" />
              <span>已掌握</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-white/50 backdrop-blur-sm text-text-secondary font-medium text-xs rounded-full border border-gray-200">
              学习中
            </span>
          )}
        </div>
      </div>

      {/* 主卡片 - Modern Glassmorphism Design */}
      <div className={`
        glass-card-strong p-10 md:p-14 text-center relative
        transition-all duration-500
        ${isTransitioning ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
      `}>
        {/* 主要内容区 */}
        <div className="relative flex flex-col items-center">

          {/* 语法点标签 - Modern Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium text-xs mb-8 rounded-full border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>{grammarPoint}</span>
          </div>

          {/* 主句显示 - 大号字体 */}
          <div className="mb-8 w-full min-h-[140px] flex items-center justify-center">
            <p
              className="text-3xl sm:text-4xl md:text-5xl leading-tight text-text-primary transition-all duration-500"
              style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.02em'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedGrammar }}
            />
          </div>

          {/* 音频播放器 - Modern Style */}
          {audioPath && (
            <div className="mb-8">
              <AudioPlayer audioPath={audioPath} />
            </div>
          )}

          {/* 可折叠内容区域 - Modern Cards */}
          <div className="w-full max-w-2xl space-y-4">
            {/* 假名卡片 */}
            <ExpandableCard
              show={showFurigana}
              onToggle={() => setShowFurigana(!showFurigana)}
              type="furigana"
              label="假名标注"
              shortcut="F"
            >
              <p className="text-2xl text-text-primary font-semibold tracking-wide" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
                {furigana}
              </p>
            </ExpandableCard>

            {/* 翻译卡片 */}
            <ExpandableCard
              show={showTranslation}
              onToggle={() => setShowTranslation(!showTranslation)}
              type="translation"
              label="中文翻译"
              shortcut="T"
            >
              <p className="text-lg text-text-secondary leading-relaxed">
                {translation}
              </p>
            </ExpandableCard>

            {/* 解析卡片 */}
            <ExpandableCard
              show={showAnalysis}
              onToggle={() => setShowAnalysis(!showAnalysis)}
              type="analysis"
              label="逐词解析"
              shortcut="A"
            >
              <div className="text-text-secondary text-sm leading-relaxed max-w-none">
                {wordByWord && (wordByWord.includes('<') ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(wordByWord, {
                    ALLOWED_TAGS: ['h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'div', 'span'],
                    ALLOWED_ATTR: ['class']
                  })}} />
                ) : (
                  <p className="whitespace-pre-wrap">{wordByWord}</p>
                ))}
              </div>
            </ExpandableCard>
          </div>
        </div>
      </div>

      {/* 底部导航 - Modern Design */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <NavButton
          onClick={onPrevious}
          disabled={isFirst}
          icon={<ArrowLeft size={20} />}
          label="上一句"
        />

        <button
          onClick={onUnderstood}
          className={`
            flex-1 max-w-md flex items-center justify-center gap-3 py-4 px-8
            font-semibold text-base transition-all duration-300 rounded-xl
            ${isLearned
              ? 'bg-gradient-to-r from-success to-success/80 text-white shadow-glow'
              : 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5'
            }
          `}
        >
          <Star size={20} className={isLearned ? 'fill-white' : 'fill-white/30'} />
          {isLearned ? '已掌握' : '我已理解'}
        </button>

        <NavButton
          onClick={onNext}
          disabled={isLast}
          icon={<ArrowRight size={20} />}
          label="下一句"
        />
      </div>

      {/* 键盘快捷键提示 - Modern */}
      <div className="mt-8 flex justify-center gap-3 text-xs text-text-secondary">
        <kbd className="flex items-center gap-1.5 px-3 py-2 glass-card rounded-lg">
          <span className="font-mono font-medium">F</span> 假名
        </kbd>
        <kbd className="flex items-center gap-1.5 px-3 py-2 glass-card rounded-lg">
          <span className="font-mono font-medium">T</span> 翻译
        </kbd>
        <kbd className="flex items-center gap-1.5 px-3 py-2 glass-card rounded-lg">
          <span className="font-mono font-medium">A</span> 解析
        </kbd>
        <kbd className="flex items-center gap-1.5 px-3 py-2 glass-card rounded-lg">
          <span className="font-mono font-medium">←→</span> 切换
        </kbd>
      </div>

      {/* Grammar highlight inline styles - Modern */}
      <style>{`
        mark.grammar-highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #FFFFFF;
          padding: 0 0.25em;
          border-radius: 0.25rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
});

/**
 * 可折叠卡片组件 - Modern Design
 */
function ExpandableCard({
  show,
  onToggle,
  type,
  label,
  shortcut,
  children
}: {
  show: boolean;
  onToggle: () => void;
  type: 'furigana' | 'translation' | 'analysis';
  label: string;
  shortcut: string;
  children: React.ReactNode;
}) {
  const colors = {
    furigana: {
      bg: 'bg-white/40',
      border: 'border-gray-200'
    },
    translation: {
      bg: 'bg-white/40',
      border: 'border-gray-200'
    },
    analysis: {
      bg: 'bg-white/60',
      border: 'border-gray-200'
    }
  };

  const color = colors[type];

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-out
      ${show ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className={`
        ${color.bg} backdrop-blur-sm border ${color.border} rounded-xl p-5
      `}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-text-primary">
              {label}
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-lg hover:from-primary/20 hover:to-secondary/20 transition-all"
            title={`Toggle (${shortcut})`}
          >
            <EyeOff size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * 导航按钮组件 - Modern Design
 */
function NavButton({
  onClick,
  disabled,
  icon,
  label
}: {
  onClick?: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-14 h-14 rounded-xl flex items-center justify-center
        transition-all duration-300 font-medium
        ${disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-br from-primary to-secondary text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5'
        }
      `}
      title={label}
    >
      {icon}
    </button>
  );
}
