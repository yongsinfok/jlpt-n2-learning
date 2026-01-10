/**
 * 用户状态管理
 * 使用 Zustand 管理用户进度、设置等状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, DailyGoal } from '@/types';
import { DEFAULT_DAILY_GOAL, STORAGE_KEYS } from '@/utils/constants';

/**
 * 用户设置
 */
export interface UserSettings {
  /** 每日目标 - 例句数 */
  targetSentences: number;
  /** 每日目标 - 语法点数 */
  targetGrammarPoints: number;
  /** 是否启用复习提醒 */
  reviewReminderEnabled: boolean;
  /** 是否首页显示复习提醒 */
  showReviewReminderOnHome: boolean;
  /** 是否自动播放音频 */
  autoPlayAudio: boolean;
  /** 音频播放速度 */
  audioPlaybackRate: number;
  /** 主题 */
  theme: 'light' | 'dark' | 'auto';
  /** 字体大小 */
  fontSize: 'small' | 'medium' | 'large';
}

/**
 * 默认用户设置
 */
const defaultSettings: UserSettings = {
  targetSentences: DEFAULT_DAILY_GOAL.SENTENCES,
  targetGrammarPoints: DEFAULT_DAILY_GOAL.GRAMMAR_POINTS,
  reviewReminderEnabled: true,
  showReviewReminderOnHome: true,
  autoPlayAudio: false,
  audioPlaybackRate: 1.0,
  theme: 'light',
  fontSize: 'medium',
};

/**
 * 用户 Store
 */
interface UserStore {
  /** 用户进度 */
  userProgress: UserProgress | null;
  /** 用户设置 */
  settings: UserSettings;
  /** 今日目标 */
  dailyGoal: DailyGoal | null;
  /** 是否已加载 */
  isLoaded: boolean;
  /** 是否首次访问 */
  isFirstVisit: boolean;

  /** 设置用户进度 */
  setUserProgress: (progress: UserProgress) => void;
  /** 更新用户进度 */
  updateUserProgress: (updates: Partial<UserProgress>) => void;
  /** 设置用户设置 */
  setSettings: (settings: UserSettings) => void;
  /** 更新用户设置 */
  updateSettings: (updates: Partial<UserSettings>) => void;
  /** 设置今日目标 */
  setDailyGoal: (goal: DailyGoal) => void;
  /** 更新今日目标 */
  updateDailyGoal: (updates: Partial<DailyGoal>) => void;
  /** 标记已访问 */
  markVisited: () => void;
  /** 重置所有数据 */
  resetAll: () => void;
}

/**
 * 创建用户 Store
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // 初始状态
      userProgress: null,
      settings: defaultSettings,
      dailyGoal: null,
      isLoaded: false,
      isFirstVisit: true,

      // 设置用户进度
      setUserProgress: (progress) => set({ userProgress: progress, isLoaded: true }),

      // 更新用户进度
      updateUserProgress: (updates) =>
        set((state) => ({
          userProgress: state.userProgress
            ? { ...state.userProgress, ...updates }
            : null,
        })),

      // 设置用户设置
      setSettings: (settings) => set({ settings }),

      // 更新用户设置
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // 设置今日目标
      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      // 更新今日目标
      updateDailyGoal: (updates) =>
        set((state) => ({
          dailyGoal: state.dailyGoal ? { ...state.dailyGoal, ...updates } : null,
        })),

      // 标记已访问
      markVisited: () => set({ isFirstVisit: false }),

      // 重置所有数据
      resetAll: () =>
        set({
          userProgress: null,
          settings: defaultSettings,
          dailyGoal: null,
          isLoaded: false,
        }),
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS,
      // 只持久化设置和首次访问标记
      partialize: (state) => ({
        settings: state.settings,
        isFirstVisit: state.isFirstVisit,
      }),
    }
  )
);
