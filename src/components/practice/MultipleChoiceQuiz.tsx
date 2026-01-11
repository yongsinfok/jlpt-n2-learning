/**
 * 选择题练习组件
 * 在本项目中，选择题与填空题的逻辑相同
 * 该组件直接复用 FillBlankQuiz 组件
 */

import { FillBlankQuiz } from './FillBlankQuiz';
import type { QuizQuestion } from '@/types';

interface MultipleChoiceQuizProps {
  /** 题目列表 */
  questions: QuizQuestion[];
  /** 完成测试回调 */
  onComplete: (result: {
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    timeSpent: number;
    results: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
    }>;
  }) => void;
  /** 退出练习回调 */
  onExit?: () => void;
  /** 是否显示解析 */
  showExplanation?: boolean;
}

/**
 * 选择题组件
 * 注：在本项目中，选择题与填空题逻辑相同，都是从选项中选择正确的语法点填入空白
 * 因此该组件直接复用 FillBlankQuiz 组件
 */
export function MultipleChoiceQuiz(props: MultipleChoiceQuizProps) {
  return <FillBlankQuiz {...props} />;
}
