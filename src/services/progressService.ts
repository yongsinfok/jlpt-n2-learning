import {
  getUserProgress,
  getTodayGoal,
  updateDailyGoal,
  getRecentGoals,
  getRecentExerciseRecords,
  getExerciseRecordsByDateRange,
} from '@/db/operations';

export async function getHomeData() {
  const [progress, todayGoal] = await Promise.all([
    getUserProgress(),
    getTodayGoal(),
  ]);
  return { progress, todayGoal };
}

export {
  getUserProgress,
  getTodayGoal,
  updateDailyGoal,
  getRecentGoals,
  getRecentExerciseRecords,
  getExerciseRecordsByDateRange,
};
