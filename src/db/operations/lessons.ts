import { db } from '../schema';
import type { Lesson } from '@/types';

export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.toArray();
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  return await db.lessons.get(id);
}

export async function updateLessonStatus(
  id: number,
  updates: Partial<Pick<Lesson, 'isUnlocked' | 'isCompleted' | 'completionRate'>>
): Promise<void> {
  await db.lessons.update(id, updates);
}

export async function addLessons(lessons: Lesson[]): Promise<void> {
  await db.lessons.bulkAdd(lessons);
}

export async function getLesson(id: number): Promise<Lesson | undefined> {
  return await getLessonById(id);
}
