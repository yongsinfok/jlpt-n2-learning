/**
 * 测试 Hook
 */

import { useCallback } from 'react';
import { useQuizStore } from '@/stores/quizStore';
import {
  generateFillBlankQuestions,
  generateMultipleChoiceQuestions,
  generateLessonTest,
  generateRandomPractice,
} from '@/utils/quizGenerator';
import type { QuizResult } from '@/types';

/**
 * 测试 Hook
 */
export function useQuiz() {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    isCompleted,
    result,
    startTime,
    showExplanation,
    setQuestions,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    completeQuiz,
    resetQuiz,
    toggleExplanation,
    getCurrentQuestion,
    getCompletedCount,
  } = useQuizStore();

  /**
   * 开始填空题测试
   */
  const startFillBlankQuiz = useCallback(
    async (grammarPoint: string, count = 3) => {
      const quizQuestions = await generateFillBlankQuestions(grammarPoint, count);
      setQuestions(quizQuestions);
    },
    [setQuestions]
  );

  /**
   * 开始选择题测试
   */
  const startMultipleChoiceQuiz = useCallback(
    async (grammarPoint: string, count = 3) => {
      const quizQuestions = await generateMultipleChoiceQuestions(grammarPoint, count);
      setQuestions(quizQuestions);
    },
    [setQuestions]
  );

  /**
   * 开始课程测试
   */
  const startLessonTest = useCallback(
    async (lessonNumber: number, count = 10) => {
      const quizQuestions = await generateLessonTest(lessonNumber, count);
      setQuestions(quizQuestions);
    },
    [setQuestions]
  );

  /**
   * 开始随机练习
   */
  const startRandomPractice = useCallback(
    async (count = 10, lessonIds?: number[]) => {
      const quizQuestions = await generateRandomPractice(count, lessonIds);
      setQuestions(quizQuestions);
    },
    [setQuestions]
  );

  /**
   * 提交当前题目的答案
   */
  const submitCurrentAnswer = useCallback(
    (answer: string) => {
      const question = getCurrentQuestion();
      if (question) {
        submitAnswer(question.id, answer);
      }
    },
    [getCurrentQuestion, submitAnswer]
  );

  /**
   * 完成测试并计算结果
   */
  const finishQuiz = useCallback((): QuizResult | null => {
    if (!startTime || questions.length === 0) return null;

    let correctCount = 0;
    const results: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
    }> = [];

    for (const question of questions) {
      const userAnswer = userAnswers.get(question.id) || '';
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) correctCount++;

      results.push({
        questionId: question.id,
        isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
      });
    }

    const quizResult: QuizResult = {
      totalQuestions: questions.length,
      correctCount,
      accuracy: correctCount / questions.length,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      results,
    };

    completeQuiz(quizResult);
    return quizResult;
  }, [startTime, questions, userAnswers, completeQuiz]);

  /**
   * 获取当前进度
   */
  const getProgress = useCallback(() => {
    const total = questions.length;
    const completed = getCompletedCount();
    return total > 0 ? completed / total : 0;
  }, [questions.length, getCompletedCount]);

  return {
    // 状态
    questions,
    currentQuestionIndex,
    userAnswers,
    isCompleted,
    result,
    showExplanation,

    // 操作
    startFillBlankQuiz,
    startMultipleChoiceQuiz,
    startLessonTest,
    startRandomPractice,
    submitCurrentAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    finishQuiz,
    resetQuiz,
    toggleExplanation,

    // 工具
    getCurrentQuestion,
    getCompletedCount,
    getProgress,
  };
}
