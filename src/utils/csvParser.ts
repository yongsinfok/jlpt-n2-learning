/**
 * CSV 数据解析器
 * 用于从 notes.csv 加载学习数据
 */

import Papa from 'papaparse';
import { db } from '@/db/schema';
import { APP_CONFIG, DEFAULT_DAILY_GOAL, ACHIEVEMENTS } from './constants';
import type { Sentence, Lesson, GrammarPoint, UserProgress, DailyGoal, Achievement } from '@/types';
import { getTodayString } from './dateHelper';

/**
 * CSV 行数据接口
 */
interface CSVRow {
  例句: string;
  语法点: string;
  课号: number;
  假名标注: string;
  中文翻译: string;
  音频: string;
  语法接续: string;
  语法解释: string;
  逐词精解: string;
  标签: string;
}

/**
 * 提取音频文件路径
 * 处理 "[sound:example_002.mp3]" 格式
 */
function extractAudioPath(audioField: string): string {
  const match = audioField?.match(/\[sound:(.+?)\]/);
  return match ? `${APP_CONFIG.AUDIO_PATH}/${match[1]}` : '';
}

/**
 * 解析标签字符串
 */
function parseTags(tagsString: string): string[] {
  if (!tagsString) return [];
  return tagsString.split(',').map((t: string) => t.trim()).filter(Boolean);
}

/**
 * 加载 CSV 数据并导入到 IndexedDB
 */
export async function loadCSVData(): Promise<void> {
  try {
    // 1. 检查是否已有数据
    const existingSentences = await db.sentences.count();
    if (existingSentences > 0) {
      console.log('Data already loaded, skipping...');
      return;
    }

    console.log('Loading CSV data...');

    // 2. 加载 CSV 文件
    const response = await fetch(APP_CONFIG.CSV_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const csvText = await response.text();

    // 3. 解析 CSV
    const { data, errors } = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }

    console.log(`Parsed ${data.length} rows from CSV`);

    // 4. 转换数据格式
    const sentences: Sentence[] = data.map((row, index) => ({
      id: `sentence_${index + 1}`,
      lessonNumber: row.课号 || 0,
      grammarPoint: row.语法点 || '',
      sentence: row.例句 || '',
      furigana: row.假名标注 || '',
      translation: row.中文翻译 || '',
      audioPath: extractAudioPath(row.音频),
      grammarConnection: row.语法接续 || '',
      grammarExplanation: row.语法解释 || '',
      wordByWord: row.逐词精解 || '',
      tags: parseTags(row.标签),
    }));

    // 5. 批量插入例句
    await db.sentences.bulkAdd(sentences);
    console.log(`Inserted ${sentences.length} sentences`);

    // 6. 生成课程和语法点数据
    await generateLessonsAndGrammar(sentences);

    // 7. 初始化用户进度
    await initializeUserProgress();

    // 8. 初始化成就
    await initializeAchievements();

    console.log('Data loaded successfully!');
  } catch (error) {
    console.error('Failed to load CSV data:', error);
    throw error;
  }
}

/**
 * 从例句数据生成课程和语法点
 */
async function generateLessonsAndGrammar(sentences: Sentence[]): Promise<void> {
  // 按课号和语法点分组
  const lessonsMap = new Map<number, Set<string>>();
  const grammarMap = new Map<string, GrammarPoint>();

  for (const sentence of sentences) {
    // 收集课程的语法点
    if (!lessonsMap.has(sentence.lessonNumber)) {
      lessonsMap.set(sentence.lessonNumber, new Set());
    }
    lessonsMap.get(sentence.lessonNumber)!.add(sentence.grammarPoint);

    // 收集语法点的例句
    if (!grammarMap.has(sentence.grammarPoint)) {
      grammarMap.set(sentence.grammarPoint, {
        id: sentence.grammarPoint,
        lessonNumber: sentence.lessonNumber,
        sentenceIds: [],
        sentenceCount: 0,
        grammarConnection: sentence.grammarConnection,
        grammarExplanation: sentence.grammarExplanation,
        isLearned: false,
      });
    }
    const grammar = grammarMap.get(sentence.grammarPoint)!;
    grammar.sentenceIds.push(sentence.id);
    grammar.sentenceCount++;
  }

  // 生成课程数据
  const lessons: Lesson[] = Array.from(lessonsMap.entries()).map(([id, grammarSet]) => ({
    id,
    grammarPoints: Array.from(grammarSet),
    sentenceCount: sentences.filter(s => s.lessonNumber === id).length,
    isUnlocked: id === 1, // 只有第1课默认解锁
    isCompleted: false,
    completionRate: 0,
  }));

  // 按课程ID排序
  lessons.sort((a, b) => a.id - b.id);

  // 批量插入
  await db.lessons.bulkAdd(lessons);
  await db.grammarPoints.bulkAdd(Array.from(grammarMap.values()));

  console.log(`Generated ${lessons.length} lessons and ${grammarMap.size} grammar points`);
}

/**
 * 初始化用户进度
 */
async function initializeUserProgress(): Promise<void> {
  const progress: UserProgress = {
    id: 'user_progress',
    currentLessonId: 1,
    currentGrammarPoint: '',
    learnedSentences: [],
    learnedGrammar: [],
    completedLessons: [],
    totalStudyTime: 0,
    studyStreak: 0,
    lastStudyDate: new Date(),
  };

  await db.userProgress.add(progress);
  console.log('User progress initialized');

  // 初始化今日目标
  await initializeDailyGoal();
}

/**
 * 初始化每日目标
 */
async function initializeDailyGoal(): Promise<void> {
  const today = getTodayString();
  const dailyGoal: DailyGoal = {
    id: today,
    date: new Date(),
    targetSentences: DEFAULT_DAILY_GOAL.SENTENCES,
    targetGrammarPoints: DEFAULT_DAILY_GOAL.GRAMMAR_POINTS,
    completedSentences: 0,
    completedGrammarPoints: 0,
    studyTime: 0,
    isCompleted: false,
  };

  await db.dailyGoals.add(dailyGoal);
  console.log('Daily goal initialized');
}

/**
 * 初始化成就
 */
async function initializeAchievements(): Promise<void> {
  const achievements: Achievement[] = ACHIEVEMENTS.map(a => ({
    ...a,
    isUnlocked: false,
  }));

  await db.achievements.bulkAdd(achievements);
  console.log('Achievements initialized');
}

/**
 * 重置所有数据（用于测试或重新开始）
 */
export async function resetAllData(): Promise<void> {
  try {
    await db.delete();
    console.log('All data reset');
    // 重新打开数据库会自动创建空的表
    await db.open();
  } catch (error) {
    console.error('Failed to reset data:', error);
    throw error;
  }
}
