/**
 * 学习进度 Hook
 */

import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import {
  addLearnedSentence,
  addCompletedLesson,
} from '@/db/operations';

/**
 * 学习进度 Hook
 */
export function useProgress() {
  const { userProgress, updateUserProgress } = useUserStore();

  /**
   * 从数据库刷新用户进度
   */
  const refreshProgress = useCallback(async () => {
    // TODO: Implement database refresh
    console.log('Refresh progress');
  }, []);

  /**
   * 标记例句为已学习
   */
  const markSentenceLearned = useCallback(
    async (sentenceId: string) => {
      await addLearnedSentence(sentenceId);
      // 刷新进度
      await refreshProgress();
    },
    [refreshProgress]
  );

  /**
   * 标记例句为已学习（本地状态更新，不刷新数据库）
   */
  const markSentenceLearnedOptimistic = useCallback((sentenceId: string) => {
    if (!userProgress) return;

    const newLearnedSentences = userProgress.learnedSentences.includes(sentenceId)
      ? userProgress.learnedSentences
      : [...userProgress.learnedSentences, sentenceId];

    updateUserProgress({ learnedSentences: newLearnedSentences });
  }, [userProgress, updateUserProgress]);

  /**
   * 标记课程为已完成
   */
  const markLessonCompleted = useCallback(
    async (lessonId: number) => {
      await addCompletedLesson(lessonId);
      await refreshProgress();
    },
    [refreshProgress]
  );

  /**
   * 更新当前学习位置
   */
  const updateCurrentPosition = useCallback(
    async (lessonId: number, grammarPoint: string) => {
      updateUserProgress({
        currentLessonId: lessonId,
        currentGrammarPoint: grammarPoint,
      });
    },
    [updateUserProgress]
  );

  /**
   * 增加学习时长
   */
  const addStudyTime = useCallback(
    async (seconds: number) => {
      if (!userProgress) return;
      const newTotalTime = userProgress.totalStudyTime + seconds;
      updateUserProgress({ totalStudyTime: newTotalTime });
    },
    [userProgress, updateUserProgress]
  );

  /**
   * 更新连续学习天数
   */
  const updateStudyStreak = useCallback(
    async (streak: number) => {
      updateUserProgress({ studyStreak: streak, lastStudyDate: new Date() });
    },
    [updateUserProgress]
  );

  return {
    userProgress,
    refreshProgress,
    markSentenceLearned,
    markSentenceLearnedOptimistic,
    markLessonCompleted,
    updateCurrentPosition,
    addStudyTime,
    updateStudyStreak,
  };
}
