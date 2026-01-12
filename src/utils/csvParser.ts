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
    // 注意：CSV 文件以 # 开头的配置行开头，没有标准列头
    const { data, errors } = Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }

    console.log(`Parsed ${data.length} rows from CSV`);

    // 4. 过滤掉以 # 开头的配置行
    const validRows = (data as unknown[][]).filter((row: unknown[]) => {
      return row[0] && !String(row[0]).startsWith('#');
    });

    console.log(`Filtered to ${validRows.length} valid data rows`);

    // 5. 转换数据格式
    const sentences: Sentence[] = validRows.map((row: unknown[], index: number) => {
      // 从 deck 字段提取课号（格式: "新完全掌握N2语法例句::Lesson 01"）
      const deck = String(row[0] || '');
      const lessonMatch = deck.match(/Lesson\s+(\d+)/);
      const lessonNumber = lessonMatch ? parseInt(lessonMatch[1]) : 0;

      // wordByWord 可能被分割到多列（17-20），需要合并
      const wordByWordParts = [];
      for (let i = 17; i <= 20 && i < row.length; i++) {
        if (row[i]) wordByWordParts.push(String(row[i]));
      }

      return {
        id: `sentence_${index + 1}`,
        lessonNumber: lessonNumber,
        grammarPoint: String(row[2] || ''),
        sentence: String(row[1] || ''),
        furigana: String(row[5] || ''),
        translation: String(row[6] || ''),
        audioPath: extractAudioPath(String(row[7] || '')),
        grammarConnection: String(row[8] || ''),
        grammarExplanation: String(row[13] || row[14] || ''), // 优先使用日语解释，否则中文
        wordByWord: wordByWordParts.join(''),
        tags: parseTags(String(row[22] || '')), // tags 在索引 22
      };
    });

    // 6. 批量插入例句
    await db.sentences.bulkAdd(sentences);
    console.log(`Inserted ${sentences.length} sentences`);

    // 7. 生成课程和语法点数据
    await generateLessonsAndGrammar(sentences);

    // 8. 初始化用户进度
    await initializeUserProgress();

    // 9. 初始化成就
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
