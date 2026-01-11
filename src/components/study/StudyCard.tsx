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

  // 解析逐词精解
  const parseWordByWord = useCallback((text: string) => {
    if (!text) return [];
    return text.split(';').map(item => {
      const [word, reading] = item.split(':');
      return { word: word?.trim() || '', reading: reading?.trim() || '' };
    }).filter(item => item.word);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {/* 进度指示 */}
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">例句进度</span>
          <span className="font-medium text-gray-900">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 日语例句（语法点高亮） */}
        <div className="text-center">
          <p
            className="text-2xl leading-relaxed text-gray-900"
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowFurigana(v => !v)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示假名 (F)</span>
              {showFurigana ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showFurigana && (
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-700">{furigana}</p>
              </div>
            )}
          </div>

          {/* 中文翻译 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowTranslation(v => !v)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示翻译 (T)</span>
              {showTranslation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showTranslation && (
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-700">{translation}</p>
              </div>
            )}
          </div>

          {/* 逐词解析 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowAnalysis(v => !v)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">显示解析 (A)</span>
              {showAnalysis ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showAnalysis && (
              <div className="px-4 py-3 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parseWordByWord(wordByWord).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.word}</span>
                      <span className="text-gray-500">:</span>
                      <span className="text-gray-600">{item.reading}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onUnderstood}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${isLearned
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary hover:bg-primary-hover text-white'
              }
              shadow-md hover:shadow-lg
            `}
          >
            <Star size={18} className={isLearned ? 'fill-white' : ''} />
            {isLearned ? '已理解' : '我已理解'}
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isLast ? '已完成' : '下一句 →'}
          </button>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className="text-sm text-gray-600 hover:text-primary disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ← 上一句
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className="text-sm text-gray-600 hover:text-primary disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            下一句 →
          </button>
        </div>

        {/* 快捷键提示 */}
        <div className="text-xs text-gray-500 text-center space-x-4">
          <span>F: 假名</span>
          <span>T: 翻译</span>
          <span>A: 解析</span>
          <span>空格: 播放</span>
          <span>←/→: 导航</span>
        </div>
      </div>
    </div>
  );
}
