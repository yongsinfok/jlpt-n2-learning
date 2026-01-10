/**
 * 学习状态管理
 */

import { create } from 'zustand';
import type { Sentence, GrammarPoint, Lesson } from '@/types';

/**
 * 学习 Store
 */
interface StudyStore {
  /** 当前课程 */
  currentLesson: Lesson | null;
  /** 当前语法点 */
  currentGrammarPoint: GrammarPoint | null;
  /** 当前例句索引 */
  currentSentenceIndex: number;
  /** 当前语法点的例句列表 */
  currentSentences: Sentence[];
  /** 是否显示假名 */
  showFurigana: boolean;
  /** 是否显示翻译 */
  showTranslation: boolean;
  /** 是否显示解析 */
  showWordByWord: boolean;
  /** 音频是否播放中 */
  isPlaying: boolean;
  /** 学习模式 */
  studyMode: 'learning' | 'review';

  /** 设置当前课程 */
  setCurrentLesson: (lesson: Lesson | null) => void;
  /** 设置当前语法点 */
  setCurrentGrammarPoint: (grammar: GrammarPoint | null) => void;
  /** 设置当前例句列表 */
  setCurrentSentences: (sentences: Sentence[]) => void;
  /** 跳转到指定例句 */
  goToSentence: (index: number) => void;
  /** 下一句 */
  nextSentence: () => void;
  /** 上一句 */
  previousSentence: () => void;
  /** 切换假名显示 */
  toggleFurigana: () => void;
  /** 切换翻译显示 */
  toggleTranslation: () => void;
  /** 切换解析显示 */
  toggleWordByWord: () => void;
  /** 设置音频播放状态 */
  setPlaying: (playing: boolean) => void;
  /** 设置学习模式 */
  setStudyMode: (mode: 'learning' | 'review') => void;
  /** 重置学习状态 */
  resetStudy: () => void;
}

/**
 * 创建学习 Store
 */
export const useStudyStore = create<StudyStore>()((set) => ({
  // 初始状态
  currentLesson: null,
  currentGrammarPoint: null,
  currentSentenceIndex: 0,
  currentSentences: [],
  showFurigana: false,
  showTranslation: false,
  showWordByWord: false,
  isPlaying: false,
  studyMode: 'learning',

  // 设置当前课程
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  // 设置当前语法点
  setCurrentGrammarPoint: (grammar) => set({ currentGrammarPoint: grammar }),

  // 设置当前例句列表
  setCurrentSentences: (sentences) =>
    set({ currentSentences: sentences, currentSentenceIndex: 0 }),

  // 跳转到指定例句
  goToSentence: (index) =>
    set((state) => ({
      currentSentenceIndex: Math.max(0, Math.min(index, state.currentSentences.length - 1)),
    })),

  // 下一句
  nextSentence: () =>
    set((state) => ({
      currentSentenceIndex: Math.min(state.currentSentenceIndex + 1, state.currentSentences.length - 1),
    })),

  // 上一句
  previousSentence: () =>
    set((state) => ({
      currentSentenceIndex: Math.max(state.currentSentenceIndex - 1, 0),
    })),

  // 切换假名显示
  toggleFurigana: () => set((state) => ({ showFurigana: !state.showFurigana })),

  // 切换翻译显示
  toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),

  // 切换解析显示
  toggleWordByWord: () => set((state) => ({ showWordByWord: !state.showWordByWord })),

  // 设置音频播放状态
  setPlaying: (playing) => set({ isPlaying: playing }),

  // 设置学习模式
  setStudyMode: (mode) => set({ studyMode: mode }),

  // 重置学习状态
  resetStudy: () =>
    set({
      currentLesson: null,
      currentGrammarPoint: null,
      currentSentenceIndex: 0,
      currentSentences: [],
      showFurigana: false,
      showTranslation: false,
      showWordByWord: false,
      isPlaying: false,
      studyMode: 'learning',
    }),
}));
