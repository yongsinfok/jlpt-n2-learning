/**
 * 课程类型定义
 */
export interface Lesson {
  /** 课号 (1-50) */
  id: number;
  /** 该课包含的语法点列表 */
  grammarPoints: string[];
  /** 例句总数 */
  sentenceCount: number;
  /** 是否解锁 */
  isUnlocked: boolean;
  /** 是否完成 */
  isCompleted: boolean;
  /** 完成度 (0-100) */
  completionRate: number;
}
