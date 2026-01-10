/**
 * 例句类型定义
 */
export interface Sentence {
  /** 唯一ID */
  id: string;
  /** 课号 (1-50) */
  lessonNumber: number;
  /** 语法点名称 */
  grammarPoint: string;
  /** 日语原文 */
  sentence: string;
  /** 假名标注 */
  furigana: string;
  /** 中文翻译 */
  translation: string;
  /** 音频文件路径 */
  audioPath: string;
  /** 语法接续 */
  grammarConnection: string;
  /** 语法解释 */
  grammarExplanation: string;
  /** 逐词精解 */
  wordByWord: string;
  /** 标签数组 */
  tags: string[];
}
