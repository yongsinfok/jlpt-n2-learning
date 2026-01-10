/**
 * 成就类型定义
 */

/** 成就 */
export interface Achievement {
  /** 成就ID */
  id: string;
  /** 成就名称 */
  name: string;
  /** 成就描述 */
  description: string;
  /** 图标（emoji） */
  icon: string;
  /** 解锁条件 */
  condition: string;
  /** 是否解锁 */
  isUnlocked: boolean;
  /** 解锁日期 */
  unlockedDate?: Date;
}

/** 成就类型枚举 */
export enum AchievementType {
  /** 学习里程碑 */
  MILESTONE = 'milestone',
  /** 连续学习 */
  STREAK = 'streak',
  /** 测试成绩 */
  QUIZ = 'quiz',
  /** 学习习惯 */
  HABIT = 'habit',
  /** 进度达成 */
  PROGRESS = 'progress',
}
