import { db } from '../schema';
import type { UserProgress } from '@/types';

export async function getUserProgress(): Promise<UserProgress | undefined> {
  return await db.userProgress.get('user-progress');
}

export async function updateUserProgress(updates: Partial<UserProgress>): Promise<void> {
  await db.userProgress.put({ id: 'user-progress', ...updates } as UserProgress);
}

export async function initializeUserProgress(progress: UserProgress): Promise<void> {
  await db.userProgress.put(progress);
}

export async function addLearnedSentence(sentenceId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  if (!progress.learnedSentences.includes(sentenceId)) {
    progress.learnedSentences.push(sentenceId);
    await updateUserProgress(progress);
  }
}

export async function addCompletedLesson(lessonId: number): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    await updateUserProgress(progress);
  }
}

export async function markSentenceAsLearned(sentenceId: string): Promise<void> {
  await addLearnedSentence(sentenceId);
}

export async function markGrammarAsLearned(grammarId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;

  const existing = progress.learnedGrammar.find(g => g.grammarId === grammarId);
  if (!existing) {
    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    progress.learnedGrammar.push({
      grammarId,
      firstLearnedDate: now,
      lastReviewedDate: now,
      nextReviewDate: nextReview,
      reviewCount: 0,
      masteryLevel: 1,
    });

    await updateUserProgress({ learnedGrammar: progress.learnedGrammar });
  }
}

export async function unlockNextLesson(currentLessonId: number): Promise<void> {
  const { getLessonById, updateLessonStatus } = await import('./lessons');
  const nextLesson = await getLessonById(currentLessonId + 1);
  if (nextLesson && !nextLesson.isUnlocked) {
    await updateLessonStatus(currentLessonId + 1, { isUnlocked: true });
  }
}
