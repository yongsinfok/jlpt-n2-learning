/**
 * UI 状态管理（侧边栏、Toast、成就弹窗等）
 * 用户设置见 userStore.settings
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
 * UI Store
 */
interface UIStore extends UIState {
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

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      showGoalCompleteToast: false,
      showAchievementUnlock: false,
      unlockedAchievementId: null,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      showGoalComplete: () => set({ showGoalCompleteToast: true }),
      hideGoalComplete: () => set({ showGoalCompleteToast: false }),
      showAchievement: (achievementId) =>
        set({ showAchievementUnlock: true, unlockedAchievementId: achievementId }),
      hideAchievement: () =>
        set({ showAchievementUnlock: false, unlockedAchievementId: null }),
    }),
    {
      name: 'jlpt-n2-ui-settings',
    }
  )
);
