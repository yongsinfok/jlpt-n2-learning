/**
 * 学习卡片组件 - Modern Japanese "Zen Glass" Design
 * Focus Mode Aesthetic with Smooth Animations
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
 * 学习卡片组件 - Focus Mode 设计
 * 清爽专注的学习界面，采用玻璃态美学
 * 优化版本：使用 memo 避免不必要的重渲染
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
      {/* 顶部进度条 - 极简设计 */}
      <div className="flex items-center justify-between mb-8 px-2">
        <span className="text-xs font-semibold text-sumi-400 uppercase tracking-widest">
          例句 <span className="text-ai-600 font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-sumi-300 mx-1">/</span>
          {String(totalCount).padStart(2, '0')}
        </span>
        <div className="flex gap-1.5 h-1 flex-1 max-w-[240px] mx-6">
          {Array.from({ length: Math.min(totalCount, 12) }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full rounded-full flex-1 transition-all duration-500 ${
                idx < currentIndex
                  ? 'bg-gradient-to-r from-ai-400 to-matcha-400'
                  : idx === currentIndex
                  ? 'bg-ai-500 scale-y-150 shadow-[0_0_8px_rgba(79,70,229,0.4)]'
                  : 'bg-sumi-100'
              }`}
              style={{ transitionDelay: `${idx * 20}ms` }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sumi-400">
          {isLearned ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-matcha-50 text-matcha-600 rounded-md font-medium">
              <Star size={12} className="fill-current" />
              已掌握
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-sumi-50 text-sumi-500 rounded-md">
              学习中
            </span>
          )}
        </div>
      </div>

      {/* 主卡片 - 玻璃态设计 */}
      <div className={`
        glass-card p-10 md:p-14 text-center relative overflow-hidden
        transition-all duration-500
        ${isTransitioning ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
      `}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-ai-50/30 via-transparent to-matcha-50/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-asanoha-pattern opacity-[0.03] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-ai-100 to-transparent rounded-full blur-3xl opacity-30" />

        {/* 主要内容区 */}
        <div className="relative z-10 flex flex-col items-center">

          {/* 语法点标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-shu-50/80 backdrop-blur border border-shu-200/50 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-shu-500 animate-pulse" />
            <span className="text-sm font-semibold text-shu-700">{grammarPoint}</span>
          </div>

          {/* 主句显示 - 大号字体 */}
          <div className="mb-8 w-full min-h-[140px] flex items-center justify-center">
            <p
              className="text-3xl sm:text-4xl md:text-5xl leading-relaxed text-sumi-900 font-medium transition-all duration-500"
              style={{
                fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedGrammar }}
            />
          </div>

          {/* 音频播放器 - 居中 */}
          {audioPath && (
            <div className="mb-8">
              <AudioPlayer audioPath={audioPath} />
            </div>
          )}

          {/* 可折叠内容区域 */}
          <div className="w-full max-w-2xl space-y-3">
            {/* 假名卡片 */}
            <ExpandableCard
              show={showFurigana}
              onToggle={() => setShowFurigana(!showFurigana)}
              type="furigana"
              label="假名标注"
              shortcut="F"
            >
              <p className="text-2xl text-ai-800 font-medium tracking-wide" style={{ fontFamily: '"Zen Kaku Gothic New", sans-serif' }}>
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
              <p className="text-lg text-sumi-700 leading-relaxed">
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
              <div className="text-sumi-600 text-sm leading-relaxed prose prose-sm max-w-none">
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

      {/* 底部导航 - 极简设计 */}
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
            flex-1 max-w-md flex items-center justify-center gap-3 py-4 px-8 rounded-2xl
            font-semibold text-base tracking-wide transition-all duration-200
            transform active:scale-[0.98]
            ${isLearned
              ? 'bg-gradient-to-r from-matcha-500 to-matcha-600 text-white shadow-lg shadow-matcha-200/50'
              : 'bg-white text-sumi-800 border border-sumi-200 shadow-sm hover:border-ai-300 hover:shadow-md hover:text-ai-700'
            }
          `}
        >
          <Star size={20} className={isLearned ? 'fill-white' : 'text-sumi-300'} />
          {isLearned ? '已掌握' : '我已理解'}
        </button>

        <NavButton
          onClick={onNext}
          disabled={isLast}
          icon={<ArrowRight size={20} />}
          label="下一句"
        />
      </div>

      {/* 键盘快捷键提示 - 更隐蔽 */}
      <div className="mt-8 flex justify-center gap-4 text-xs text-sumi-300">
        <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur rounded-md border border-sumi-100">
          <span className="font-mono">F</span> 假名
        </kbd>
        <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur rounded-md border border-sumi-100">
          <span className="font-mono">T</span> 翻译
        </kbd>
        <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur rounded-md border border-sumi-100">
          <span className="font-mono">A</span> 解析
        </kbd>
        <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur rounded-md border border-sumi-100">
          <span className="font-mono">←→</span> 切换
        </kbd>
      </div>

      {/* Grammar highlight inline styles */}
      <style>{`
        mark.grammar-highlight {
          background: linear-gradient(180deg, transparent 60%, rgba(200, 54, 78, 0.2) 60%);
          padding: 0 0.125em;
          color: #C8364E;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
});

/**
 * 可折叠卡片组件
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
      bg: 'bg-ai-50/80',
      border: 'border-ai-200/50',
      text: 'text-ai-700',
      dot: 'bg-ai-400'
    },
    translation: {
      bg: 'bg-matcha-50/80',
      border: 'border-matcha-200/50',
      text: 'text-matcha-700',
      dot: 'bg-matcha-400'
    },
    analysis: {
      bg: 'bg-sumi-50/80',
      border: 'border-sumi-200/50',
      text: 'text-sumi-700',
      dot: 'bg-sumi-400'
    }
  };

  const color = colors[type];

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-out
      ${show ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className={`
        ${color.bg} backdrop-blur rounded-xl p-5 border ${color.border} shadow-sm
        transition-all duration-300 hover:shadow-md
      `}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${color.text}`}>
              {label}
            </span>
          </div>
          <button
            onClick={onToggle}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${show ? 'bg-white/50 text-sumi-400' : 'bg-transparent text-sumi-300'}
            `}
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
 * 导航按钮组件
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
        w-14 h-14 flex items-center justify-center
        rounded-2xl transition-all duration-200
        ${disabled
          ? 'bg-sumi-50 text-sumi-300 cursor-not-allowed opacity-50'
          : 'bg-white text-sumi-400 hover:text-ai-600 hover:bg-ai-50 hover:shadow-md hover:scale-105'
        }
      `}
      title={label}
    >
      {icon}
    </button>
  );
}
