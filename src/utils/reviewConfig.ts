/** 复习间隔（天数）: [未使用, Level 1, Level 2, Level 3, Level 4, Level 5] */
export const REVIEW_INTERVALS = [0, 1, 3, 7, 15, 30] as const;

export const MASTERY_LEVELS = {
  NOT_LEARNED: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
} as const;

export const MASTERY_LEVEL_LABELS = {
  0: '未学习',
  1: '刚学习',
  2: '初步掌握',
  3: '基本掌握',
  4: '熟练掌握',
  5: '完全掌握',
} as const;
