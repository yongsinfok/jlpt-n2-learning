/**
 * 学习卡片组件
 */

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import type { Sentence } from '@/types';

export interface StudyCardProps {
  /** 例句数据 */
  sentence: Sentence;
  /** 语法点（用于高亮） */
  grammarPoint: string;
  /** 当前索引 */
  currentIndex: number;
  /** 总数 */
  totalCount: number;
  /** 点击"我已理解"回调 */
  onUnderstood?: () => void;
  /** 点击"下一句"回调 */
  onNext?: () => void;
  /** 点击"上一句"回调 */
  onPrevious?: () => void;
  /** 是否是第一个 */
  isFirst?: boolean;
  /** 是否是最后一个 */
  isLast?: boolean;
  /** 是否已学习 */
  isLearned?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 学习卡片组件
 * 显示日语例句，支持音频播放、可折叠的假名/翻译/解析
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

  // 折叠状态
  const [showFurigana, setShowFurigana] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // 高亮语法点
  const highlightGrammar = useCallback(() => {
    if (!text) return '';
    const escapedGrammar = grammarPoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedGrammar, 'g');
    const parts = text.split(regex);
    const matches = text.match(regex);

    let result = parts[0] || '';
    if (matches) {
      matches.forEach((match, i) => {
        result += `<span class="bg-yellow-200 border-b-2 border-yellow-500 px-0.5 rounded">${match}</span>`;
        if (parts[i + 1]) {
          result += parts[i + 1];
        }
      });
    }
    return result;
  }, [text, grammarPoint]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F: 切换假名
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setShowFurigana(v => !v);
      }
      // T: 切换翻译
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setShowTranslation(v => !v);
      }
      // A: 切换解析
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setShowAnalysis(v => !v);
      }
      // 空格: 播放音频（由 AudioPlayer 处理）
      // 左方向键: 上一句
      if (e.key === 'ArrowLeft' && !isFirst && onPrevious) {
        e.preventDefault();
        onPrevious();
        // 重置折叠状态
        setShowFurigana(false);
        setShowTranslation(false);
        setShowAnalysis(false);
      }
      // 右方向键: 下一句
      if (e.key === 'ArrowRight' && !isLast && onNext) {
        e.preventDefault();
        onNext();
        // 重置折叠状态
        setShowFurigana(false);
        setShowTranslation(false);
        setShowAnalysis(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onPrevious, onNext]);

  // 检查是否有详细的解析内容（HTML格式）
  const hasDetailedAnalysis = wordByWord && wordByWord.includes('<h3>');

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* 进度指示 */}
      <div className="bg-gradient-to-r from-ai-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">例句进度</span>
          <span className="font-semibold text-gray-900 text-sm">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
        <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-ai-500 to-ai-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 日语例句（语法点高亮） */}
        <div className="text-center py-4">
          <p
            className="text-2xl sm:text-3xl leading-relaxed text-gray-900 font-medium"
            dangerouslySetInnerHTML={{ __html: highlightGrammar() }}
          />
        </div>

        {/* 音频播放器 */}
        {audioPath && (
          <div className="flex justify-center">
            <AudioPlayer audioPath={audioPath} showPlaybackRate={false} />
          </div>
        )}

        {/* 可折叠内容区域 */}
        <div className="space-y-3">
          {/* 假名标注 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowFurigana(v => !v)}
              className="w-full px-4 py-3.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示假名 <span className="text-gray-400 font-normal text-sm ml-2">(F)</span></span>
              {showFurigana ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>
            {showFurigana && (
              <div className="px-4 py-3.5 bg-white">
                <p className="text-gray-700 leading-relaxed">{furigana}</p>
              </div>
            )}
          </div>

          {/* 中文翻译 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTranslation(v => !v)}
              className="w-full px-4 py-3.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示翻译 <span className="text-gray-400 font-normal text-sm ml-2">(T)</span></span>
              {showTranslation ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>
            {showTranslation && (
              <div className="px-4 py-3.5 bg-white">
                <p className="text-gray-700 leading-relaxed">{translation}</p>
              </div>
            )}
          </div>

          {/* 逐词解析 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowAnalysis(v => !v)}
              className="w-full px-4 py-3.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示解析 <span className="text-gray-400 font-normal text-sm ml-2">(A)</span></span>
              {showAnalysis ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>
            {showAnalysis && wordByWord && (
              <div className="px-4 py-3.5 bg-white analysis-content max-h-96 overflow-y-auto">
                {hasDetailedAnalysis ? (
                  // 如果有详细的 HTML 解析内容，直接渲染 HTML
                  <div dangerouslySetInnerHTML={{ __html: wordByWord }} />
                ) : (
                  // 否则显示简单格式（如果有的话）
                  <p className="text-gray-600 whitespace-pre-wrap">{wordByWord}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onUnderstood}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium transition-all duration-200
              ${isLearned
                ? 'bg-matcha-500 hover:bg-matcha-600 text-white'
                : 'bg-ai-600 hover:bg-ai-700 text-white'
              }
              shadow-sm hover:shadow-md hover:-translate-y-0.5
            `}
          >
            <Star size={18} className={isLearned ? 'fill-white' : ''} />
            {isLearned ? '已理解' : '我已理解'}
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-medium py-3.5 px-6 rounded-xl transition-colors duration-200"
          >
            {isLast ? '已完成' : '下一句'}
          </button>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between pt-2">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className="text-sm text-gray-500 hover:text-ai-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ← 上一句
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className="text-sm text-gray-500 hover:text-ai-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            下一句 →
          </button>
        </div>

        {/* 快捷键提示 */}
        <div className="text-xs text-gray-400 text-center space-x-3 pt-2 border-t border-gray-100">
          <span>F: 假名</span>
          <span>T: 翻译</span>
          <span>A: 解析</span>
          <span>←/→: 导航</span>
        </div>
      </div>
    </div>
  );
}
