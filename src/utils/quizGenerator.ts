/**
 * 测试题目生成器
 */

import { db } from '@/db/schema';
import type { QuizQuestion } from '@/types';

/**
 * 生成填空题
 * 从指定语法点的例句中随机选择生成填空题
 * @param grammarPoint 语法点
 * @param count 题目数量
 * @returns 题目列表
 */
export async function generateFillBlankQuestions(
  grammarPoint: string,
  count: number = 3
): Promise<QuizQuestion[]> {
  // 1. 获取该语法点的所有例句
  const sentences = await db.sentences
    .where('grammarPoint')
    .equals(grammarPoint)
    .toArray();

  if (sentences.length === 0) return [];

  // 2. 随机选择 count 个例句
  const selectedSentences = shuffleArray(sentences).slice(0, count);

  // 3. 获取相似的语法点作为干扰项
  const distractors = await getSimilarGrammarPoints(grammarPoint, 3);

  // 4. 生成题目
  return selectedSentences.map(sentence => ({
    id: `quiz_${sentence.id}_${Date.now()}_${Math.random()}`,
    sentenceId: sentence.id,
    // 替换语法点为空白
    sentence: sentence.sentence.replace(new RegExp(grammarPoint, 'g'), '______'),
    grammarPoint: grammarPoint,
    translation: sentence.translation,
    options: shuffleArray([grammarPoint, ...distractors]),
    correctAnswer: grammarPoint,
    explanation: sentence.grammarExplanation,
  }));
}

/**
 * 生成选择题
 */
export async function generateMultipleChoiceQuestions(
  grammarPoint: string,
  count: number = 3
): Promise<QuizQuestion[]> {
  // 选择题与填空题逻辑相同
  return generateFillBlankQuestions(grammarPoint, count);
}

/**
 * 生成课程综合测试
 * @param lessonNumber 课号
 * @param count 题目数量
 * @returns 题目列表
 */
export async function generateLessonTest(
  lessonNumber: number,
  count: number = 10
): Promise<QuizQuestion[]> {
  // 1. 获取课程的所有语法点
  const lesson = await db.lessons.get(lessonNumber);
  if (!lesson) return [];

  // 2. 为每个语法点生成题目
  const questions: QuizQuestion[] = [];
  const questionsPerGrammar = Math.ceil(count / lesson.grammarPoints.length);

  for (const grammarPoint of lesson.grammarPoints) {
    const grammarQuestions = await generateFillBlankQuestions(
      grammarPoint,
      questionsPerGrammar
    );
    questions.push(...grammarQuestions);
  }

  // 3. 如果题目不够，随机补充
  if (questions.length < count) {
    const allSentences = await db.sentences
      .where('lessonNumber')
      .equals(lessonNumber)
      .toArray();

    const additionalSentences = shuffleArray(allSentences)
      .slice(0, count - questions.length);

    for (const sentence of additionalSentences) {
      const distractors = await getSimilarGrammarPoints(sentence.grammarPoint, 3);
      questions.push({
        id: `quiz_${sentence.id}_${Date.now()}_${Math.random()}`,
        sentenceId: sentence.id,
        sentence: sentence.sentence.replace(new RegExp(sentence.grammarPoint, 'g'), '______'),
        grammarPoint: sentence.grammarPoint,
        translation: sentence.translation,
        options: shuffleArray([sentence.grammarPoint, ...distractors]),
        correctAnswer: sentence.grammarPoint,
        explanation: sentence.grammarExplanation,
      });
    }
  }

  // 4. 随机排序并返回指定数量
  return shuffleArray(questions).slice(0, count);
}

/**
 * 生成随机练习题
 * @param count 题目数量
 * @param lessonIds 可选：指定课程范围
 */
export async function generateRandomPractice(
  count: number = 10,
  lessonIds?: number[]
): Promise<QuizQuestion[]> {
  let sentences;

  if (lessonIds && lessonIds.length > 0) {
    // 获取指定课程的例句
    const allSentences = await Promise.all(
      lessonIds.map(id => db.sentences.where('lessonNumber').equals(id).toArray())
    );
    sentences = allSentences.flat();
  } else {
    // 获取所有已学习课程的例句
    const progress = await db.userProgress.get('user_progress');
    if (!progress || progress.completedLessons.length === 0) {
      return [];
    }

    const allSentences = await Promise.all(
      progress.completedLessons.map(id => db.sentences.where('lessonNumber').equals(id).toArray())
    );
    sentences = allSentences.flat();
  }

  if (sentences.length === 0) return [];

  // 随机选择例句
  const selectedSentences = shuffleArray(sentences).slice(0, count);
  const questions: QuizQuestion[] = [];

  for (const sentence of selectedSentences) {
    const distractors = await getSimilarGrammarPoints(sentence.grammarPoint, 3);
    questions.push({
      id: `quiz_${sentence.id}_${Date.now()}_${Math.random()}`,
      sentenceId: sentence.id,
      sentence: sentence.sentence.replace(new RegExp(sentence.grammarPoint, 'g'), '______'),
      grammarPoint: sentence.grammarPoint,
      translation: sentence.translation,
      options: shuffleArray([sentence.grammarPoint, ...distractors]),
      correctAnswer: sentence.grammarPoint,
      explanation: sentence.grammarExplanation,
    });
  }

  return questions;
}

/**
 * 获取相似的语法点作为干扰项
 */
async function getSimilarGrammarPoints(
  targetGrammar: string,
  count: number
): Promise<string[]> {
  // 获取目标语法点
  const target = await db.grammarPoints.get(targetGrammar);
  if (!target) return [];

  // 获取同课或相近课程的其他语法点
  const similar = await db.grammarPoints
    .where('lessonNumber')
    .between(Math.max(1, target.lessonNumber - 2), target.lessonNumber + 2)
    .and(g => g.id !== targetGrammar)
    .limit(count * 3)
    .toArray();

  // 随机选择指定数量
  return shuffleArray(similar.map(g => g.id)).slice(0, count);
}

/**
 * 数组随机排序（Fisher-Yates 洗牌算法）
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
