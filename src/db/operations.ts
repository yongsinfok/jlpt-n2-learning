/**
 * IndexedDB 数据库操作
 * 提供对数据库的增删改查操作
 */

import { db } from './schema';
import type {
  Sentence,
  Lesson,
  GrammarPoint,
  UserProgress,
  DailyGoal,
  ExerciseRecord,
  WrongAnswer,
  Achievement,
} from '@/types';

// ==================== 例句操作 ====================

/**
 * 获取所有例句
 */
export async function getAllSentences(): Promise<Sentence[]> {
  return await db.sentences.toArray();
}

/**
 * 根据课程号获取例句
 */
export async function getSentencesByLesson(lessonNumber: number): Promise<Sentence[]> {
  return await db.sentences.where('lessonNumber').equals(lessonNumber).toArray();
}

/**
 * 根据语法点获取例句
 */
export async function getSentencesByGrammarPoint(grammarPoint: string): Promise<Sentence[]> {
  return await db.sentences.where('grammarPoint').equals(grammarPoint).toArray();
}

/**
 * 根据例句 ID 获取例句
 */
export async function getSentenceById(id: string): Promise<Sentence | undefined> {
  return await db.sentences.get(id);
}

/**
 * 标记例句为已学习
 */
export async function markSentenceAsLearned(sentenceId: string): Promise<void> {
  await addLearnedSentence(sentenceId);
}

/**
 * 标记语法点为已学习并安排复习
 */
export async function markGrammarAsLearned(grammarId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  const existing = progress.learnedGrammar.find(g => g.grammarId === grammarId);
  if (!existing) {
    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const learnedGrammarItem = {
      grammarId,
      firstLearnedDate: now,
      lastReviewedDate: now,
      nextReviewDate: nextReview,
      reviewCount: 0,
      masteryLevel: 1,
    };

    progress.learnedGrammar.push(learnedGrammarItem);
    await updateUserProgress({ learnedGrammar: progress.learnedGrammar });
  }
}

/**
 * 解锁下一课
 */
export async function unlockNextLesson(currentLessonId: number): Promise<void> {
  const nextLesson = await db.lessons.get(currentLessonId + 1);
  if (nextLesson && !nextLesson.isUnlocked) {
    await updateLessonStatus(currentLessonId + 1, { isUnlocked: true });
  }
}

/**
 * 批量添加例句
 */
export async function addSentences(sentences: Sentence[]): Promise<void> {
  await db.sentences.bulkAdd(sentences);
}

// ==================== 课程操作 ====================

/**
 * 获取所有课程
 */
export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.toArray();
}

/**
 * 根据 ID 获取课程
 */
export async function getLessonById(id: number): Promise<Lesson | undefined> {
  return await db.lessons.get(id);
}

/**
 * 更新课程状态
 */
export async function updateLessonStatus(
  id: number,
  updates: Partial<Pick<Lesson, 'isUnlocked' | 'isCompleted' | 'completionRate'>>
): Promise<void> {
  await db.lessons.update(id, updates);
}

/**
 * 批量添加课程
 */
export async function addLessons(lessons: Lesson[]): Promise<void> {
  await db.lessons.bulkAdd(lessons);
}

/**
 * 获取课程（别名函数，用于兼容）
 */
export async function getLesson(id: number): Promise<Lesson | undefined> {
  return await getLessonById(id);
}

// ==================== 语法点操作 ====================

/**
 * 获取所有语法点
 */
export async function getAllGrammarPoints(): Promise<GrammarPoint[]> {
  return await db.grammarPoints.toArray();
}

/**
 * 根据课程号获取语法点
 */
export async function getGrammarPointsByLesson(lessonNumber: number): Promise<GrammarPoint[]> {
  return await db.grammarPoints.where('lessonNumber').equals(lessonNumber).toArray();
}

/**
 * 根据 ID 获取语法点
 */
export async function getGrammarPointById(id: string): Promise<GrammarPoint | undefined> {
  return await db.grammarPoints.get(id);
}

/**
 * 更新语法点学习状态
 */
export async function updateGrammarPointStatus(
  id: string,
  updates: Partial<Pick<GrammarPoint, 'isLearned'>>
): Promise<void> {
  await db.grammarPoints.update(id, updates);
}

/**
 * 批量添加语法点
 */
export async function addGrammarPoints(grammarPoints: GrammarPoint[]): Promise<void> {
  await db.grammarPoints.bulkAdd(grammarPoints);
}

// ==================== 用户进度操作 ====================

/**
 * 获取用户进度
 */
export async function getUserProgress(): Promise<UserProgress | undefined> {
  return await db.userProgress.get('user-progress');
}

/**
 * 更新用户进度
 */
export async function updateUserProgress(updates: Partial<UserProgress>): Promise<void> {
  await db.userProgress.put({ id: 'user-progress', ...updates } as UserProgress);
}

/**
 * 初始化用户进度
 */
export async function initializeUserProgress(progress: UserProgress): Promise<void> {
  await db.userProgress.put(progress);
}

/**
 * 添加已学习的例句
 */
export async function addLearnedSentence(sentenceId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  if (!progress.learnedSentences.includes(sentenceId)) {
    progress.learnedSentences.push(sentenceId);
    await updateUserProgress(progress);
  }
}

/**
 * 添加已完成的课程
 */
export async function addCompletedLesson(lessonId: number): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    await updateUserProgress(progress);
  }
}

// ==================== 每日目标操作 ====================

/**
 * 获取指定日期的每日目标
 */
export async function getDailyGoal(date: string): Promise<DailyGoal | undefined> {
  return await db.dailyGoals.get(date);
}

/**
 * 获取今日目标
 */
export async function getTodayGoal(): Promise<DailyGoal | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return await getDailyGoal(today);
}

/**
 * 更新每日目标
 */
export async function updateDailyGoal(goal: DailyGoal): Promise<void> {
  await db.dailyGoals.put(goal);
}

/**
 * 获取最近 N 天的目标记录
 */
export async function getRecentGoals(days: number): Promise<DailyGoal[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await db.dailyGoals
    .where('date')
    .between(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], true, true)
    .toArray();
}

// ==================== 练习历史操作 ====================

/**
 * 添加练习记录
 */
export async function addExerciseRecord(record: ExerciseRecord): Promise<void> {
  await db.exerciseHistory.add(record);
}

/**
 * 获取指定语法点的练习历史
 */
export async function getExerciseHistoryByGrammarPoint(grammarPoint: string): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory.where('grammarPoint').equals(grammarPoint).toArray();
}

/**
 * 获取最近的练习记录
 */
export async function getRecentExerciseRecords(limit: number = 50): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory.orderBy('timestamp').reverse().limit(limit).toArray();
}

/**
 * 获取指定日期范围内的练习记录
 */
export async function getExerciseRecordsByDateRange(startDate: Date, endDate: Date): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory
    .where('timestamp')
    .between(startDate.getTime(), endDate.getTime())
    .toArray();
}

// ==================== 错题本操作 ====================

/**
 * 获取所有错题
 */
export async function getAllWrongAnswers(): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.toArray();
}

/**
 * 获取未解决的错题
 */
export async function getUnresolvedWrongAnswers(): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.filter((item) => !item.resolved).toArray();
}

/**
 * 根据语法点获取错题
 */
export async function getWrongAnswersByGrammarPoint(grammarPoint: string): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.where('grammarPoint').equals(grammarPoint).toArray();
}

/**
 * 添加错题
 */
export async function addWrongAnswer(answer: WrongAnswer): Promise<void> {
  await db.wrongAnswers.add(answer);
}

/**
 * 标记错题为已解决
 */
export async function resolveWrongAnswer(id: string): Promise<void> {
  await db.wrongAnswers.update(id, { resolved: true });
}

/**
 * 删除错题记录
 */
export async function deleteWrongAnswer(id: string): Promise<void> {
  await db.wrongAnswers.delete(id);
}

// ==================== 成就操作 ====================

/**
 * 获取所有成就
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  return await db.achievements.toArray();
}

/**
 * 获取已解锁的成就
 */
export async function getUnlockedAchievements(): Promise<Achievement[]> {
  return await db.achievements.filter((item) => item.isUnlocked).toArray();
}

/**
 * 根据 ID 获取成就
 */
export async function getAchievementById(id: string): Promise<Achievement | undefined> {
  return await db.achievements.get(id);
}

/**
 * 解锁成就
 */
export async function unlockAchievement(id: string): Promise<void> {
  await db.achievements.update(id, { isUnlocked: true, unlockedDate: new Date() });
}

/**
 * 批量添加成就
 */
export async function addAchievements(achievements: Achievement[]): Promise<void> {
  await db.achievements.bulkAdd(achievements);
}

// ==================== 通用操作 ====================

/**
 * 清空所有表（用于重置）
 */
export async function clearAllTables(): Promise<void> {
  await db.sentences.clear();
  await db.lessons.clear();
  await db.grammarPoints.clear();
  await db.userProgress.clear();
  await db.dailyGoals.clear();
  await db.exerciseHistory.clear();
  await db.wrongAnswers.clear();
  await db.achievements.clear();
}

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<{
  sentences: number;
  lessons: number;
  grammarPoints: number;
  exerciseHistory: number;
  wrongAnswers: number;
  achievements: number;
}> {
  const [sentences, lessons, grammarPoints, exerciseHistory, wrongAnswers, achievements] = await Promise.all([
    db.sentences.count(),
    db.lessons.count(),
    db.grammarPoints.count(),
    db.exerciseHistory.count(),
    db.wrongAnswers.count(),
    db.achievements.count(),
  ]);

  return {
    sentences,
    lessons,
    grammarPoints,
    exerciseHistory,
    wrongAnswers,
    achievements,
  };
}
