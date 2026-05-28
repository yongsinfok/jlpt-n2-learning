/**
 * 应用核心配置
 */

export const APP_CONFIG = {
  DB_VERSION: 1,
  DB_NAME: 'JLPTN2DB',
  CSV_PATH: '/data/notes.csv',
  AUDIO_PATH: '/audio',
} as const;

export const DEFAULT_DAILY_GOAL = {
  SENTENCES: 10,
  GRAMMAR_POINTS: 2,
} as const;

export const LESSON_CONFIG = {
  TOTAL_LESSONS: 50,
  PASS_THRESHOLD: 0.7,
} as const;

export const STORAGE_KEYS = {
  USER_SETTINGS: 'jlpt_n2_settings',
  HAS_VISITED: 'jlpt_n2_has_visited',
  DAILY_GOAL_SETTINGS: 'jlpt_n2_daily_goal',
} as const;

// Re-export from domain files for backward compatibility
export { ROUTES } from './routes';
export { ACHIEVEMENTS } from './achievements';
export { REVIEW_INTERVALS, MASTERY_LEVELS, MASTERY_LEVEL_LABELS } from './reviewConfig';
