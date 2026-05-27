import { db } from '../schema';
import type { GrammarPoint } from '@/types';

export async function getAllGrammarPoints(): Promise<GrammarPoint[]> {
  return await db.grammarPoints.toArray();
}

export async function getGrammarPointsByLesson(lessonNumber: number): Promise<GrammarPoint[]> {
  return await db.grammarPoints.where('lessonNumber').equals(lessonNumber).toArray();
}

export async function getGrammarPointById(id: string): Promise<GrammarPoint | undefined> {
  return await db.grammarPoints.get(id);
}

export async function updateGrammarPointStatus(
  id: string,
  updates: Partial<Pick<GrammarPoint, 'isLearned'>>
): Promise<void> {
  await db.grammarPoints.update(id, updates);
}

export async function addGrammarPoints(grammarPoints: GrammarPoint[]): Promise<void> {
  await db.grammarPoints.bulkAdd(grammarPoints);
}
