/**
 * 学习卡片组件 - Modern Japanese Design
 * Refined Washi Paper Aesthetic with Animations
 */

import { useState, useEffect, useCallback } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
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
 * 学习卡片组件
 * 修复了文字重叠问题，采用更干净的垂直堆叠布局
 */
export function StudyCard({
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

  // 重置状态当句子改变时
  useEffect(() => {
    setShowFurigana(true);
    setShowTranslation(true);
    setShowAnalysis(true);
  }, [sentence.id]);

  // 高亮语法点
  const highlightGrammar = useCallback(() => {
    if (!text) return '';
    const escapedGrammar = grammarPoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedGrammar})`, 'g');
    return text.replace(regex, '<span class="text-shu-600 border-b-2 border-shu-300 pb-0.5 mx-0.5 font-bold">$1</span>');
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onPrevious, onNext]);

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>

      {/* 顶部进度条 */}
      <div className="flex items-center justify-between mb-6 px-4">
        <span className="text-sm font-medium text-sumi-500 font-sans tracking-wide">
          SENTENCE <span className="text-sumi-900 font-bold ml-1">{currentIndex + 1}</span>
          <span className="mx-1 text-sumi-300">/</span>
          {totalCount}
        </span>
        <div className="flex gap-1 h-1.5 flex-1 max-w-[200px] mx-4">
          {Array.from({ length: Math.min(totalCount, 10) }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full rounded-full flex-1 transition-all duration-300 ${idx <= currentIndex
                ? idx === currentIndex ? 'bg-ai-500 scale-y-125' : 'bg-ai-200'
                : 'bg-sumi-100'
                }`}
            />
          ))}
        </div>
      </div>

      {/* 主卡片 */}
      <div className="bg-white rounded-3xl shadow-paper-lg border border-sumi-100 overflow-hidden relative transition-all duration-500">

        {/* 背景装饰 (Asanoha Pattern) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-asanoha opacity-[0.03] pointer-events-none rounded-bl-full" />

        {/* 主要内容区 */}
        <div className="p-8 sm:p-12 text-center relative z-10 flex flex-col items-center min-h-[400px] justify-center">

          {/* 2. 主句显示 */}
          <div className="mb-8 w-full min-h-[120px] flex items-center justify-center">
            <p
              className="text-3xl sm:text-4xl md:text-5xl leading-tight text-sumi-900 font-medium tracking-wide transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: highlightGrammar() }}
            />
          </div>

          {/* 3. 音频播放器 */}
          <div className="mb-10 w-full flex justify-center">
            {audioPath && <AudioPlayer audioPath={audioPath} />}
          </div>

          {/* 4. 控制胶囊 */}
          <div className="inline-flex items-center gap-1 p-2 bg-sumi-50 rounded-2xl border border-sumi-100 shadow-paper-sm mb-10 transform hover:scale-105 transition-transform duration-200">
            <ToggleButton
              isActive={showFurigana}
              onClick={() => setShowFurigana(!showFurigana)}
              label="假名"
              shortcut="F"
            />
            <div className="w-px h-6 bg-sumi-200 mx-1" />
            <ToggleButton
              isActive={showTranslation}
              onClick={() => setShowTranslation(!showTranslation)}
              label="翻译"
              shortcut="T"
            />
            <div className="w-px h-6 bg-sumi-200 mx-1" />
            <ToggleButton
              isActive={showAnalysis}
              onClick={() => setShowAnalysis(!showAnalysis)}
              label="解析"
              shortcut="A"
            />
          </div>

          {/* 5. 展开的详细内容 (下方) */}
          <div className="w-full space-y-4 text-left max-w-2xl">

            {/* 假名卡片 */}
            <div className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${showFurigana ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}
             `}>
              <div className="bg-ai-50 rounded-xl p-5 border border-ai-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-ai-400" />
                <h4 className="text-xs font-bold text-ai-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ai-500" />
                  假名标注
                </h4>
                <p className="text-xl text-sumi-800 font-medium tracking-wide">{furigana}</p>
              </div>
            </div>

            {/* 翻译卡片 */}
            <div className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${showTranslation ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}
             `}>
              <div className="bg-matcha-50 rounded-xl p-5 border border-matcha-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-matcha-400" />
                <h4 className="text-xs font-bold text-matcha-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-matcha-500" />
                  中文翻译
                </h4>
                <p className="text-lg text-sumi-800 font-medium">{translation}</p>
              </div>
            </div>

            {/* 解析卡片 */}
            <div className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${showAnalysis ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
             `}>
              <div className="bg-white rounded-xl p-6 border border-sumi-200 shadow-paper-md max-h-96 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold text-sumi-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sumi-400" />
                  逐词解析
                </h4>
                <div className="text-sumi-700 text-sm leading-relaxed prose prose-sm max-w-none">
                  {wordByWord && (wordByWord.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: wordByWord }} />
                  ) : (
                    <p className="whitespace-pre-wrap">{wordByWord}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="bg-sumi-50 border-t border-sumi-100 px-6 py-5 flex items-center justify-between gap-6">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className="w-12 h-12 flex items-center justify-center text-sumi-400 hover:text-ai-600 hover:bg-white hover:shadow-paper-sm rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-transparent"
            title="Previous"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            onClick={onUnderstood}
            className={`
               flex-1 max-w-sm flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-lg tracking-wide transition-all transform active:scale-95 shadow-lg
               ${isLearned
                ? 'bg-matcha-500 text-white shadow-matcha-200 hover:bg-matcha-600'
                : 'bg-white text-sumi-800 border border-sumi-100 shadow-paper-sm hover:border-ai-200 hover:text-ai-600'
              }
             `}
          >
            <Star size={22} className={isLearned ? 'fill-current' : 'text-sumi-400'} />
            {isLearned ? '已掌握' : '标为掌握'}
          </button>

          <button
            onClick={onNext}
            disabled={isLast}
            className="w-12 h-12 flex items-center justify-center text-sumi-400 hover:text-ai-600 hover:bg-white hover:shadow-paper-sm rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-transparent"
            title="Next"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* 底部快捷键提示 */}
      <div className="mt-8 text-center flex justify-center gap-6">
        <KeyboardHint label="F" desc="假名" />
        <KeyboardHint label="T" desc="翻译" />
        <KeyboardHint label="A" desc="解析" />
        <KeyboardHint label="←/→" desc="切换" />
      </div>
    </div>
  );
}

function ToggleButton({ isActive, onClick, label, shortcut }: { isActive: boolean; onClick: () => void; label: string; shortcut: string }) {
  return (
    <button
      onClick={onClick}
      title={`Shortcut: ${shortcut}`}
      className={`
        relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
        ${isActive
          ? 'bg-sumi-900 text-white shadow-lg scale-105'
          : 'text-sumi-600 hover:bg-white hover:text-sumi-900'
        }
      `}
    >
      <span className="flex items-center gap-2">
        {label}
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-ai-400" />}
      </span>
    </button>
  );
}

function KeyboardHint({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-sumi-400 opacity-60 hover:opacity-100 transition-opacity cursor-default">
      <kbd className="px-2 py-1 bg-white border border-sumi-200 rounded-md font-sans font-bold shadow-sm">{label}</kbd>
      <span>{desc}</span>
    </div>
  );
}
