/**
 * 语法点类型定义
 */
export interface GrammarPoint {
  /** 语法点名称（唯一） */
  id: string;
  /** 所属课号 */
  lessonNumber: number;
  /** 包含的例句ID列表 */
  sentenceIds: string[];
  /** 例句数量 */
  sentenceCount: number;
  /** 接续方式 */
  grammarConnection: string;
  /** 详细说明 */
  grammarExplanation: string;
  /** 是否已学习 */
  isLearned: boolean;
}
