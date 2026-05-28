import {
  getAllLessons,
  getLessonById,
  getGrammarPointsByLesson,
  updateLessonStatus,
} from '@/db/operations';
import { getUserProgress } from '@/db/operations';

export async function getLessonDetail(id: number) {
  const lesson = await getLessonById(id);
  if (!lesson) return null;
  const grammarPoints = await getGrammarPointsByLesson(id);
  return { lesson, grammarPoints };
}

export { getAllLessons, getLessonById, getGrammarPointsByLesson, updateLessonStatus, getUserProgress };
