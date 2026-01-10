/**
 * 复习计划 Hook
 */

import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { getUnresolvedWrongAnswers } from '@/db/operations';

/**
 * 复习计划 Hook
 */
export function useReviewSchedule() {
  const { userProgress } = useUserStore();

  /**
   * 获取今天需要复习的语法点
   */
  const getTodayReviews = useCallback(() => {
    if (!userProgress) return [];
    return getDueReviews(userProgress.learnedGrammar);
  }, [userProgress]);

  /**
   * 获取今天需要复习的数量
   */
  const getTodayReviewCount = useCallback(() => {
    return getTodayReviews().length;
  }, [getTodayReviews]);

  /**
   * 获取未解决的错题数量
   */
  const getWrongAnswerCount = useCallback(async () => {
    const wrongAnswers = await getUnresolvedWrongAnswers();
    return wrongAnswers.length;
  }, []);

  /**
   * 检查是否有待复习内容
   */
  const hasPendingReviews = useCallback(() => {
    return getTodayReviewCount() > 0;
  }, [getTodayReviewCount]);

  return {
    getTodayReviews,
    getTodayReviewCount,
    getWrongAnswerCount,
    hasPendingReviews,
  };
}
