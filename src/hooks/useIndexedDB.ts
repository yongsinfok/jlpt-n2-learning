/**
 * IndexedDB 操作 Hook
 */

import { useCallback } from 'react';
import {
  getAllSentences,
  getSentencesByLesson,
  getSentencesByGrammarPoint,
  getAllLessons,
  getLesson,
  getAllGrammarPoints,
  getGrammarPointsByLesson,
  getDatabaseStats,
} from '@/db/operations';
import type { Sentence, Lesson, GrammarPoint } from '@/types';

/**
 * IndexedDB 操作 Hook
 */
export function useIndexedDB() {
  /**
   * 获取所有例句
   */
  const fetchAllSentences = useCallback(async (): Promise<Sentence[]> => {
    return await getAllSentences();
  }, []);

  /**
   * 获取课程的例句
   */
  const fetchLessonSentences = useCallback(async (lessonNumber: number): Promise<Sentence[]> => {
    return await getSentencesByLesson(lessonNumber);
  }, []);

  /**
   * 获取语法点的例句
   */
  const fetchGrammarPointSentences = useCallback(
    async (grammarPoint: string): Promise<Sentence[]> => {
      return await getSentencesByGrammarPoint(grammarPoint);
    },
    []
  );

  /**
   * 获取所有课程
   */
  const fetchAllLessons = useCallback(async (): Promise<Lesson[]> => {
    return await getAllLessons();
  }, []);

  /**
   * 获取单个课程
   */
  const fetchLesson = useCallback(async (id: number): Promise<Lesson | undefined> => {
    return await getLesson(id);
  }, []);

  /**
   * 获取所有语法点
   */
  const fetchAllGrammarPoints = useCallback(async (): Promise<GrammarPoint[]> => {
    return await getAllGrammarPoints();
  }, []);

  /**
   * 获取课程的语法点
   */
  const fetchLessonGrammarPoints = useCallback(
    async (lessonNumber: number): Promise<GrammarPoint[]> => {
      return await getGrammarPointsByLesson(lessonNumber);
    },
    []
  );

  /**
   * 获取数据库统计信息
   */
  const fetchStats = useCallback(async () => {
    return await getDatabaseStats();
  }, []);

  return {
    fetchAllSentences,
    fetchLessonSentences,
    fetchGrammarPointSentences,
    fetchAllLessons,
    fetchLesson,
    fetchAllGrammarPoints,
    fetchLessonGrammarPoints,
    fetchStats,
  };
}
