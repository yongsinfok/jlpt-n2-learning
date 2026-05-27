import { db } from '../schema';
import type { DailyGoal } from '@/types';

export async function getDailyGoal(date: string): Promise<DailyGoal | undefined> {
  return await db.dailyGoals.get(date);
}

export async function getTodayGoal(): Promise<DailyGoal | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return await getDailyGoal(today);
}

export async function updateDailyGoal(goal: DailyGoal): Promise<void> {
  await db.dailyGoals.put(goal);
}

export async function getRecentGoals(days: number): Promise<DailyGoal[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await db.dailyGoals
    .where('date')
    .between(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], true, true)
    .toArray();
}
