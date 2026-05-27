import { db } from '../schema';
import type { ExerciseRecord } from '@/types';

export async function addExerciseRecord(record: ExerciseRecord): Promise<void> {
  await db.exerciseHistory.add(record);
}

export async function getExerciseHistoryByGrammarPoint(grammarPoint: string): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory.where('grammarPoint').equals(grammarPoint).toArray();
}

export async function getRecentExerciseRecords(limit: number = 50): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function getExerciseRecordsByDateRange(startDate: Date, endDate: Date): Promise<ExerciseRecord[]> {
  return await db.exerciseHistory
    .where('timestamp')
    .between(startDate.getTime(), endDate.getTime())
    .toArray();
}
