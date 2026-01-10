/**
 * 学习进度类型定义
 */

/** 语法学习记录 */
export interface GrammarProgress {
  /** 语法点ID */
  grammarId: string;
  /** 首次学习日期 */
  firstLearnedDate: Date;
  /** 最后复习日期 */
  lastReviewedDate: Date;
  /** 下次复习日期 */
  nextReviewDate: Date;
  /** 复习次数 */
  reviewCount: number;
  /** 掌握程度 (0-5) */
  masteryLevel: number;
}

/** 用户进度 */
export interface UserProgress {
  /** 固定ID: 'user_progress' */
  id: string;
  /** 当前学习的课程ID */
  currentLessonId: number;
  /** 当前学习的语法点 */
  currentGrammarPoint: string;
  /** 已学习的例句ID列表 */
  learnedSentences: string[];
  /** 已学习的语法记录 */
  learnedGrammar: GrammarProgress[];
  /** 已完成的课程ID列表 */
  completedLessons: number[];
  /** 总学习时长（秒） */
  totalStudyTime: number;
  /** 连续学习天数 */
  studyStreak: number;
  /** 最后学习日期 */
  lastStudyDate: Date;
}

/** 每日目标 */
export interface DailyGoal {
  /** 日期字符串 'YYYY-MM-DD' */
  id: string;
  /** 日期 */
  date: Date;
  /** 目标例句数（默认10） */
  targetSentences: number;
  /** 目标语法点数（默认2） */
  targetGrammarPoints: number;
  /** 已完成例句数 */
  completedSentences: number;
  /** 已完成语法点数 */
  completedGrammarPoints: number;
  /** 学习时长（秒） */
  studyTime: number;
  /** 是否完成 */
  isCompleted: boolean;
}
