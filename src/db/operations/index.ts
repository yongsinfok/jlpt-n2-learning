export * from './sentences';
export * from './lessons';
export * from './grammar';
export * from './progress';
export * from './dailyGoals';
export * from './exercises';
export * from './wrongAnswers';
export * from './achievements';

import { db } from '../schema';

export async function clearAllTables(): Promise<void> {
  await Promise.all([
    db.sentences.clear(),
    db.lessons.clear(),
    db.grammarPoints.clear(),
    db.userProgress.clear(),
    db.dailyGoals.clear(),
    db.exerciseHistory.clear(),
    db.wrongAnswers.clear(),
    db.achievements.clear(),
  ]);
}

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

  return { sentences, lessons, grammarPoints, exerciseHistory, wrongAnswers, achievements };
}
