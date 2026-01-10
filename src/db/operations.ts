/**
 * 数据库操作封装
 */

import { db } from './schema';
import type {
  Sentence,
  Lesson,
  GrammarPoint,
  UserProgress,
  DailyGoal,
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
 * 根据课号获取例句
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
 * 获取单个例句
 */
export async function getSentence(id: string): Promise<Sentence | undefined> {
  return await db.sentences.get(id);
}

// ==================== 课程操作 ====================

/**
 * 获取所有课程
 */
export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.toArray();
}

/**
 * 获取单个课程
 */
export async function getLesson(id: number): Promise<Lesson | undefined> {
  return await db.lessons.get(id);
}

/**
 * 更新课程状态
 */
export async function updateLesson(id: number, updates: Partial<Lesson>): Promise<void> {
  await db.lessons.update(id, updates);
}

/**
 * 批量添加课程
 */
export async function bulkAddLessons(lessons: Lesson[]): Promise<void> {
  await db.lessons.bulkAdd(lessons);
}

// ==================== 语法点操作 ====================

/**
 * 获取所有语法点
 */
export async function getAllGrammarPoints(): Promise<GrammarPoint[]> {
  return await db.grammarPoints.toArray();
}

/**
 * 根据课号获取语法点
 */
export async function getGrammarPointsByLesson(lessonNumber: number): Promise<GrammarPoint[]> {
  return await db.grammarPoints.where('lessonNumber').equals(lessonNumber).toArray();
}

/**
 * 获取单个语法点
 */
export async function getGrammarPoint(id: string): Promise<GrammarPoint | undefined> {
  return await db.grammarPoints.get(id);
}

/**
 * 更新语法点学习状态
 */
export async function updateGrammarPoint(id: string, updates: Partial<GrammarPoint>): Promise<void> {
  await db.grammarPoints.update(id, updates);
}

// ==================== 用户进度操作 ====================

/**
 * 获取用户进度
 */
export async function getUserProgress(): Promise<UserProgress | undefined> {
  return await db.userProgress.get('user_progress');
}

/**
 * 创建用户进度
 */
export async function createUserProgress(progress: UserProgress): Promise<void> {
  await db.userProgress.add(progress);
}

/**
 * 更新用户进度
 */
export async function updateUserProgress(updates: Partial<UserProgress>): Promise<void> {
  await db.userProgress.update('user_progress', updates);
}

/**
 * 添加已学习的例句
 */
export async function addLearnedSentence(sentenceId: string): Promise<void> {
  const progress = await getUserProgress();
  if (progress) {
    if (!progress.learnedSentences.includes(sentenceId)) {
      progress.learnedSentences.push(sentenceId);
      await updateUserProgress({ learnedSentences: progress.learnedSentences });
    }
  }
}

/**
 * 添加已完成的课程
 */
export async function addCompletedLesson(lessonId: number): Promise<void> {
  const progress = await getUserProgress();
  if (progress) {
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await updateUserProgress({ completedLessons: progress.completedLessons });
    }
  }
}

// ==================== 每日目标操作 ====================

/**
 * 获取某日的目标
 */
export async function getDailyGoal(date: string): Promise<DailyGoal | undefined> {
  return await db.dailyGoals.get(date);
}

/**
 * 创建或更新每日目标
 */
export async function upsertDailyGoal(goal: DailyGoal): Promise<void> {
  await db.dailyGoals.put(goal);
}

/**
 * 更新每日目标进度
 */
export async function updateDailyGoalProgress(id: string, updates: Partial<DailyGoal>): Promise<void> {
  await db.dailyGoals.update(id, updates);
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
  return await db.wrongAnswers.filter(item => !item.resolved).toArray();
}

/**
 * 根据语法点获取错题
 */
export async function getWrongAnswersByGrammar(grammarPoint: string): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.where('grammarPoint').equals(grammarPoint).toArray();
}

/**
 * 添加或更新错题
 */
export async function upsertWrongAnswer(wrongAnswer: WrongAnswer): Promise<void> {
  await db.wrongAnswers.put(wrongAnswer);
}

/**
 * 记录答错
 */
export async function recordWrongAnswer(sentenceId: string, grammarPoint: string): Promise<void> {
  const existing = await db.wrongAnswers.get(sentenceId);
  if (existing) {
    await db.wrongAnswers.update(sentenceId, {
      wrongCount: existing.wrongCount + 1,
      lastWrongDate: new Date(),
      correctStreak: 0,
      resolved: false,
    });
  } else {
    await db.wrongAnswers.add({
      id: sentenceId,
      sentenceId,
      grammarPoint,
      wrongCount: 1,
      lastWrongDate: new Date(),
      resolved: false,
      correctStreak: 0,
    });
  }
}

/**
 * 记录答对（用于错题消除）
 */
export async function recordCorrectAnswer(sentenceId: string): Promise<void> {
  const existing = await db.wrongAnswers.get(sentenceId);
  if (existing && !existing.resolved) {
    const newStreak = existing.correctStreak + 1;
    const resolved = newStreak >= 3;
    await db.wrongAnswers.update(sentenceId, {
      correctStreak: newStreak,
      resolved,
    });
  }
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
  return await db.achievements.filter(item => item.isUnlocked).toArray();
}

/**
 * 解锁成就
 */
export async function unlockAchievement(achievementId: string): Promise<void> {
  await db.achievements.update(achievementId, {
    isUnlocked: true,
    unlockedDate: new Date(),
  });
}

/**
 * 批量添加成就
 */
export async function bulkAddAchievements(achievements: Achievement[]): Promise<void> {
  await db.achievements.bulkAdd(achievements);
}

// ==================== 数据统计 ====================

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<{
  sentencesCount: number;
  lessonsCount: number;
  grammarPointsCount: number;
  learnedSentencesCount: number;
  completedLessonsCount: number;
}> {
  const [sentencesCount, lessonsCount, grammarPointsCount, progress] = await Promise.all([
    db.sentences.count(),
    db.lessons.count(),
    db.grammarPoints.count(),
    getUserProgress(),
  ]);

  return {
    sentencesCount,
    lessonsCount,
    grammarPointsCount,
    learnedSentencesCount: progress?.learnedSentences.length || 0,
    completedLessonsCount: progress?.completedLessons.length || 0,
  };
}
