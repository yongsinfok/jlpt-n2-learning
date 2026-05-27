import { db } from '../schema';
import type { Achievement } from '@/types';

export async function getAllAchievements(): Promise<Achievement[]> {
  return await db.achievements.toArray();
}

export async function getUnlockedAchievements(): Promise<Achievement[]> {
  return await db.achievements.filter((item) => item.isUnlocked).toArray();
}

export async function getAchievementById(id: string): Promise<Achievement | undefined> {
  return await db.achievements.get(id);
}

export async function unlockAchievement(id: string): Promise<void> {
  await db.achievements.update(id, { isUnlocked: true, unlockedDate: new Date() });
}

export async function addAchievements(achievements: Achievement[]): Promise<void> {
  await db.achievements.bulkAdd(achievements);
}
