import { db } from '../schema';
import type { WrongAnswer } from '@/types';

export async function getAllWrongAnswers(): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.toArray();
}

export async function getUnresolvedWrongAnswers(): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.filter((item) => !item.resolved).toArray();
}

export async function getWrongAnswersByGrammarPoint(grammarPoint: string): Promise<WrongAnswer[]> {
  return await db.wrongAnswers.where('grammarPoint').equals(grammarPoint).toArray();
}

export async function addWrongAnswer(answer: WrongAnswer): Promise<void> {
  await db.wrongAnswers.add(answer);
}

export async function resolveWrongAnswer(id: string): Promise<void> {
  await db.wrongAnswers.update(id, { resolved: true });
}

export async function deleteWrongAnswer(id: string): Promise<void> {
  await db.wrongAnswers.delete(id);
}
