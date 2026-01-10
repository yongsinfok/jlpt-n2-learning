/**
 * 艾宾浩斯复习算法
 * 用于计算科学的复习间隔
 */

import { REVIEW_INTERVALS, MASTERY_LEVELS } from './constants';
import type { UserProgress } from '@/types';

/**
 * 复习计划结果
 */
export interface ReviewSchedule {
  /** 新的掌握等级 */
  nextLevel: number;
  /** 下次复习日期 */
  nextReviewDate: Date;
}

/**
 * 计算下次复习时间
 * @param currentLevel 当前掌握等级 (0-5)
 * @param wasCorrect 答题是否正确
 * @returns 复习计划
 */
export function calculateNextReview(
  currentLevel: number,
  wasCorrect: boolean
): ReviewSchedule {
  // 答对：等级+1（最高5）
  // 答错：等级-1（最低1）
  let nextLevel = wasCorrect
    ? Math.min(currentLevel + 1, MASTERY_LEVELS.LEVEL_5)
    : Math.max(currentLevel - 1, MASTERY_LEVELS.LEVEL_1);

  // 根据新等级计算复习间隔
  const daysToAdd = REVIEW_INTERVALS[nextLevel];

  // 计算下次复习日期
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  nextReviewDate.setHours(0, 0, 0, 0); // 设置为当天00:00

  return { nextLevel, nextReviewDate };
}

/**
 * 获取今天需要复习的语法点
 * @param learnedGrammar 已学习的语法列表
 * @returns 需要复习的语法点ID数组
 */
export function getDueReviews(
  learnedGrammar: UserProgress['learnedGrammar']
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return learnedGrammar
    .filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    })
    .map(item => item.grammarId);
}

/**
 * 获取未来 N 天内需要复习的语法点数量
 * @param learnedGrammar 已学习的语法列表
 * @param days 天数
 * @returns 每天的复习数量
 */
export function getUpcomingReviewCounts(
  learnedGrammar: UserProgress['learnedGrammar'],
  days: number
): number[] {
  const counts = new Array(days).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  learnedGrammar.forEach(item => {
    const reviewDate = new Date(item.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < days) {
      counts[daysDiff]++;
    }
  });

  return counts;
}

/**
 * 检查某个语法点是否今天需要复习
 * @param grammarId 语法点ID
 * @param learnedGrammar 已学习的语法列表
 * @returns 是否需要复习
 */
export function isReviewDueToday(
  grammarId: string,
  learnedGrammar: UserProgress['learnedGrammar']
): boolean {
  const grammar = learnedGrammar.find(g => g.grammarId === grammarId);
  if (!grammar) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(grammar.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= today;
}

/**
 * 获取复习优先级（越早需要复习的优先级越高）
 * @param grammarId 语法点ID
 * @param learnedGrammar 已学习的语法列表
 * @returns 优先级分数（越大越优先）
 */
export function getReviewPriority(
  grammarId: string,
  learnedGrammar: UserProgress['learnedGrammar']
): number {
  const grammar = learnedGrammar.find(g => g.grammarId === grammarId);
  if (!grammar) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(grammar.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  const daysOverdue = Math.floor((today.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));

  // 过期越久，优先级越高
  // 今天到期 = 100
  // 过期1天 = 101
  // 未来1天 = 99
  return 100 + daysOverdue;
}
