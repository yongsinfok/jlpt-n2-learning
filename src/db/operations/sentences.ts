import { db } from '../schema';
import type { Sentence } from '@/types';

export async function getAllSentences(): Promise<Sentence[]> {
  return await db.sentences.toArray();
}

export async function getSentencesByLesson(lessonNumber: number): Promise<Sentence[]> {
  return await db.sentences.where('lessonNumber').equals(lessonNumber).toArray();
}

export async function getSentencesByGrammarPoint(grammarPoint: string): Promise<Sentence[]> {
  return await db.sentences.where('grammarPoint').equals(grammarPoint).toArray();
}

export async function getSentenceById(id: string): Promise<Sentence | undefined> {
  return await db.sentences.get(id);
}

export async function addSentences(sentences: Sentence[]): Promise<void> {
  await db.sentences.bulkAdd(sentences);
}
