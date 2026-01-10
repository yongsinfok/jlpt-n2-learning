/**
 * 设置状态管理
 * 注意：大多数设置已经集成在 userStore 中，此 store 用于扩展设置需求
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI 状态
 */
interface UIState {
  /** 侧边栏是否展开 */
  isSidebarOpen: boolean;
  /** 是否显示每日目标完成提示 */
  showGoalCompleteToast: boolean;
  /** 是否显示成就解锁提示 */
  showAchievementUnlock: boolean;
  /** 当前解锁的成就 ID */
  unlockedAchievementId: string | null;
}

/**
 * 设置 Store
 */
interface SettingsStore extends UIState {
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  /** 关闭侧边栏 */
  closeSidebar: () => void;
  /** 显示目标完成提示 */
  showGoalComplete: () => void;
  /** 隐藏目标完成提示 */
  hideGoalComplete: () => void;
  /** 显示成就解锁 */
  showAchievement: (achievementId: string) => void;
  /** 隐藏成就解锁 */
  hideAchievement: () => void;
}

/**
 * 创建设置 Store
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // 初始状态
      isSidebarOpen: false,
      showGoalCompleteToast: false,
      showAchievementUnlock: false,
      unlockedAchievementId: null,

      // 切换侧边栏
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // 关闭侧边栏
      closeSidebar: () => set({ isSidebarOpen: false }),

      // 显示目标完成提示
      showGoalComplete: () => set({ showGoalCompleteToast: true }),

      // 隐藏目标完成提示
      hideGoalComplete: () => set({ showGoalCompleteToast: false }),

      // 显示成就解锁
      showAchievement: (achievementId) =>
        set({ showAchievementUnlock: true, unlockedAchievementId: achievementId }),

      // 隐藏成就解锁
      hideAchievement: () =>
        set({ showAchievementUnlock: false, unlockedAchievementId: null }),
    }),
    {
      name: 'jlpt-n2-ui-settings',
    }
  )
);
