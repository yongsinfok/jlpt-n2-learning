/**
 * IndexedDB 数据库配置
 * 使用 Dexie.js 进行数据库操作
 */

import Dexie, { Table } from 'dexie';

// 导入所有类型
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

/**
 * JLPT N2 数据库类
 */
export class JLPTN2Database extends Dexie {
  // 表定义
  sentences!: Table<Sentence, string>;
  lessons!: Table<Lesson, number>;
  grammarPoints!: Table<GrammarPoint, string>;
  userProgress!: Table<UserProgress, string>;
  dailyGoals!: Table<DailyGoal, string>;
  exerciseHistory!: Table<ExerciseRecord, string>;
  wrongAnswers!: Table<WrongAnswer, string>;
  achievements!: Table<Achievement, string>;

  constructor() {
    super('JLPTN2DB');

    // 定义数据库版本和表结构
    this.version(1).stores({
      // 例句表
      sentences: 'id, lessonNumber, grammarPoint',

      // 课程表
      lessons: 'id, isUnlocked, isCompleted',

      // 语法点表
      grammarPoints: 'id, lessonNumber, isLearned',

      // 用户进度表
      userProgress: 'id',

      // 每日目标表
      dailyGoals: 'id, date, isCompleted',

      // 练习历史表
      exerciseHistory: 'id, sentenceId, timestamp, isCorrect, grammarPoint',

      // 错题本表
      wrongAnswers: 'id, grammarPoint, resolved',

      // 成就表
      achievements: 'id, isUnlocked',
    });
  }
}

/**
 * 数据库实例
 */
export const db = new JLPTN2Database();

/**
 * 初始化数据库
 * 在应用启动时调用
 */
export async function initDatabase(): Promise<void> {
  try {
    await db.open();
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
}

/**
 * 清空数据库（用于测试或重置）
 */
export async function clearDatabase(): Promise<void> {
  try {
    await db.delete();
    console.log('Database cleared');
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
}
