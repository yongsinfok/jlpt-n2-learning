/**
 * 测试状态管理
 */

import { create } from 'zustand';
import type { QuizQuestion, QuizResult } from '@/types';

/**
 * 测试 Store
 */
interface QuizStore {
  /** 题目列表 */
  questions: QuizQuestion[];
  /** 当前题目索引 */
  currentQuestionIndex: number;
  /** 用户答案 */
  userAnswers: Map<string, string>;
  /** 是否已完成 */
  isCompleted: boolean;
  /** 测试结果 */
  result: QuizResult | null;
  /** 测试开始时间 */
  startTime: number | null;
  /** 是否显示解析 */
  showExplanation: boolean;

  /** 设置题目列表 */
  setQuestions: (questions: QuizQuestion[]) => void;
  /** 提交答案 */
  submitAnswer: (questionId: string, answer: string) => void;
  /** 下一题 */
  nextQuestion: () => void;
  /** 上一题 */
  previousQuestion: () => void;
  /** 跳转到指定题目 */
  goToQuestion: (index: number) => void;
  /** 完成测试 */
  completeQuiz: (result: QuizResult) => void;
  /** 重置测试 */
  resetQuiz: () => void;
  /** 切换解析显示 */
  toggleExplanation: () => void;
  /** 获取当前题目 */
  getCurrentQuestion: () => QuizQuestion | undefined;
  /** 获取已完成题目数 */
  getCompletedCount: () => number;
}

/**
 * 创建测试 Store
 */
export const useQuizStore = create<QuizStore>()((set, get) => ({
  // 初始状态
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: new Map(),
  isCompleted: false,
  result: null,
  startTime: null,
  showExplanation: false,

  // 设置题目列表
  setQuestions: (questions) =>
    set({
      questions,
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isCompleted: false,
      result: null,
      startTime: Date.now(),
      showExplanation: false,
    }),

  // 提交答案
  submitAnswer: (questionId, answer) =>
    set((state) => {
      const newAnswers = new Map(state.userAnswers);
      newAnswers.set(questionId, answer);
      return { userAnswers: newAnswers };
    }),

  // 下一题
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
      showExplanation: false,
    })),

  // 上一题
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      showExplanation: false,
    })),

  // 跳转到指定题目
  goToQuestion: (index) =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
      showExplanation: false,
    })),

  // 完成测试
  completeQuiz: (result) =>
    set({
      result,
      isCompleted: true,
    }),

  // 重置测试
  resetQuiz: () =>
    set({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isCompleted: false,
      result: null,
      startTime: null,
      showExplanation: false,
    }),

  // 切换解析显示
  toggleExplanation: () =>
    set((state) => ({ showExplanation: !state.showExplanation })),

  // 获取当前题目
  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex];
  },

  // 获取已完成题目数
  getCompletedCount: () => {
    const state = get();
    return state.userAnswers.size;
  },
}));
