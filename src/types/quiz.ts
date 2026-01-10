/**
 * 测试练习类型定义
 */

/** 题目类型 */
export type QuestionType = 'fill' | 'choice';

/** 练习记录 */
export interface ExerciseRecord {
  /** 自动生成UUID */
  id: string;
  /** 例句ID */
  sentenceId: string;
  /** 语法点 */
  grammarPoint: string;
  /** 题型 */
  questionType: QuestionType;
  /** 用户答案 */
  userAnswer: string;
  /** 正确答案 */
  correctAnswer: string;
  /** 是否正确 */
  isCorrect: boolean;
  /** 答题时间 */
  timestamp: Date;
}

/** 测试题目 */
export interface QuizQuestion {
  /** 题目ID */
  id: string;
  /** 例句ID */
  sentenceId: string;
  /** 题目文本（填空题用） */
  sentence: string;
  /** 语法点 */
  grammarPoint: string;
  /** 翻译 */
  translation: string;
  /** 选项（选择题用） */
  options: string[];
  /** 正确答案 */
  correctAnswer: string;
  /** 解释 */
  explanation: string;
}

/** 测试结果 */
export interface QuizResult {
  /** 题目总数 */
  totalQuestions: number;
  /** 正确数量 */
  correctCount: number;
  /** 正确率 */
  accuracy: number;
  /** 用时（秒） */
  timeSpent: number;
  /** 题目结果列表 */
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
  }>;
}
