/**
 * 错题本类型定义
 */

/** 错题记录 */
export interface WrongAnswer {
  /** sentenceId */
  id: string;
  /** 例句ID */
  sentenceId: string;
  /** 语法点 */
  grammarPoint: string;
  /** 答错次数 */
  wrongCount: number;
  /** 最后答错日期 */
  lastWrongDate: Date;
  /** 是否已掌握（连续答对3次） */
  resolved: boolean;
  /** 连续答对次数 */
  correctStreak: number;
}
