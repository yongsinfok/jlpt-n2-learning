import {
  getSentencesByGrammarPoint,
  getSentenceById,
  getGrammarPointById,
  markSentenceAsLearned,
  markGrammarAsLearned,
  unlockNextLesson,
  getUserProgress,
  updateUserProgress,
  addLearnedSentence,
  addCompletedLesson,
  getLessonById,
} from '@/db/operations';

export async function startStudySession(grammarId: string) {
  const [grammar, sentences, progress] = await Promise.all([
    getGrammarPointById(grammarId),
    getSentencesByGrammarPoint(grammarId),
    getUserProgress(),
  ]);
  return { grammar, sentences, progress };
}

export async function completeSentence(sentenceId: string) {
  await markSentenceAsLearned(sentenceId);
}

export async function completeGrammarPoint(grammarId: string) {
  await markGrammarAsLearned(grammarId);
}

export async function completeLesson(lessonId: number) {
  await unlockNextLesson(lessonId);
}

export {
  getSentencesByGrammarPoint,
  getSentenceById,
  getGrammarPointById,
  getUserProgress,
  updateUserProgress,
  addLearnedSentence,
  addCompletedLesson,
  getLessonById,
  markSentenceAsLearned,
  markGrammarAsLearned,
  unlockNextLesson,
};
