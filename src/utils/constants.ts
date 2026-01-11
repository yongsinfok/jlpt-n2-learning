/**
 * 应用常量定义
 */

// ==================== 应用配置 ====================

export const APP_CONFIG = {
  /** 数据库版本 */
  DB_VERSION: 1,
  /** 数据库名称 */
  DB_NAME: 'JLPTN2DB',
  /** CSV 数据路径 */
  CSV_PATH: '/data/notes.csv',
  /** 音频文件路径 */
  AUDIO_PATH: '/audio',
} as const;

// ==================== 复习算法配置 ====================

/** 复习间隔（天数）: [未使用, Level 1, Level 2, Level 3, Level 4, Level 5] */
export const REVIEW_INTERVALS = [0, 1, 3, 7, 15, 30] as const;

/** 掌握等级定义 */
export const MASTERY_LEVELS = {
  NOT_LEARNED: 0,
  LEVEL_1: 1, // 刚学习（1天后复习）
  LEVEL_2: 2, // 初步掌握（3天后复习）
  LEVEL_3: 3, // 基本掌握（7天后复习）
  LEVEL_4: 4, // 熟练掌握（15天后复习）
  LEVEL_5: 5, // 完全掌握（30天后复习）
} as const;

/** 掌握等级标签 */
export const MASTERY_LEVEL_LABELS = {
  0: '未学习',
  1: '刚学习',
  2: '初步掌握',
  3: '基本掌握',
  4: '熟练掌握',
  5: '完全掌握',
} as const;

// ==================== 学习配置 ====================

/** 默认每日目标 */
export const DEFAULT_DAILY_GOAL = {
  /** 目标例句数 */
  SENTENCES: 10,
  /** 目标语法点数 */
  GRAMMAR_POINTS: 2,
} as const;

/** 课程配置 */
export const LESSON_CONFIG = {
  /** 总课程数 */
  TOTAL_LESSONS: 50,
  /** 课后测试通过率阈值 */
  PASS_THRESHOLD: 0.7,
} as const;

// ==================== 成就定义 ====================

/** 成就列表 */
export const ACHIEVEMENTS = [
  {
    id: 'first_grammar',
    name: '开始学习',
    description: '完成第1个语法点',
    icon: '🎯',
    condition: '完成第1个语法点',
    isUnlocked: false,
  },
  {
    id: 'first_lesson',
    name: '第一课',
    description: '完成第1课',
    icon: '📚',
    condition: '完成第1课',
    isUnlocked: false,
  },
  {
    id: 'streak_7',
    name: '连续7天',
    description: '连续学习7天',
    icon: '🔥',
    condition: '连续学习7天',
    isUnlocked: false,
  },
  {
    id: 'streak_30',
    name: '连续30天',
    description: '连续学习30天',
    icon: '🔥',
    condition: '连续学习30天',
    isUnlocked: false,
  },
  {
    id: 'perfect_score',
    name: '满分测试',
    description: '课后测试获得满分',
    icon: '💯',
    condition: '课后测试获得满分',
    isUnlocked: false,
  },
  {
    id: 'early_bird',
    name: '早起学习',
    description: '上午8点前学习',
    icon: '⏰',
    condition: '上午8点前学习',
    isUnlocked: false,
  },
  {
    id: 'night_owl',
    name: '夜猫学习',
    description: '晚上10点后学习',
    icon: '🌙',
    condition: '晚上10点后学习',
    isUnlocked: false,
  },
  {
    id: 'progress_10',
    name: '10%进度',
    description: '完成10%课程',
    icon: '⭐',
    condition: '完成5课',
    isUnlocked: false,
  },
  {
    id: 'progress_25',
    name: '25%进度',
    description: '完成25%课程',
    icon: '⭐',
    condition: '完成13课',
    isUnlocked: false,
  },
  {
    id: 'progress_50',
    name: '50%进度',
    description: '完成50%课程',
    icon: '🏆',
    condition: '完成25课',
    isUnlocked: false,
  },
  {
    id: 'progress_75',
    name: '75%进度',
    description: '完成75%课程',
    icon: '🏆',
    condition: '完成38课',
    isUnlocked: false,
  },
  {
    id: 'complete_all',
    name: '完成全部',
    description: '完成全部50课',
    icon: '🏆',
    condition: '完成全部50课',
    isUnlocked: false,
  },
  {
    id: 'sentences_100',
    name: '100例句',
    description: '学习100个例句',
    icon: '📖',
    condition: '学习100个例句',
    isUnlocked: false,
  },
  {
    id: 'sentences_500',
    name: '500例句',
    description: '学习500个例句',
    icon: '📖',
    condition: '学习500个例句',
    isUnlocked: false,
  },
  {
    id: 'sentences_all',
    name: '全部例句',
    description: '学习全部例句',
    icon: '📖',
    condition: '学习全部例句',
    isUnlocked: false,
  },
  {
    id: 'quiz_100',
    name: '练习100题',
    description: '完成100道练习题',
    icon: '✏️',
    condition: '完成100道练习题',
    isUnlocked: false,
  },
  {
    id: 'quiz_500',
    name: '练习500题',
    description: '完成500道练习题',
    icon: '✏️',
    condition: '完成500道练习题',
    isUnlocked: false,
  },
  {
    id: 'accuracy_90',
    name: '正确率90%',
    description: '练习正确率达到90%',
    icon: '🎯',
    condition: '练习正确率达到90%',
    isUnlocked: false,
  },
  {
    id: 'daily_goal_30',
    name: '每日目标30天',
    description: '连续30天完成每日目标',
    icon: '💪',
    condition: '连续30天完成每日目标',
    isUnlocked: false,
  },
  {
    id: 'master_all',
    name: '全部精通',
    description: '所有语法点达到Level 5',
    icon: '🧠',
    condition: '所有语法点达到Level 5',
    isUnlocked: false,
  },
] as const;

// ==================== 路由路径 ====================

export const ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lesson/:id',
  STUDY: '/study',
  GRAMMAR_DETAIL: '/grammar/:id',
  PRACTICE: '/practice',
  QUIZ: '/quiz',
  REVIEW: '/review',
  PROGRESS: '/progress',
  WRONG_ANSWERS: '/wrong-answers',
  ACHIEVEMENTS: '/achievements',
  SETTINGS: '/settings',
} as const;

// ==================== 本地存储键 ====================

export const STORAGE_KEYS = {
  /** 用户设置 */
  USER_SETTINGS: 'jlpt_n2_settings',
  /** 首次访问标记 */
  HAS_VISITED: 'jlpt_n2_has_visited',
  /** 每日目标设置 */
  DAILY_GOAL_SETTINGS: 'jlpt_n2_daily_goal',
} as const;
