import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { GrammarIntro } from '@/components/study';
import {
  getGrammarPointById,
  getSentencesByGrammarPoint,
} from '@/db/operations';
import type { GrammarPoint, Sentence } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function GrammarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [grammarPoint, setGrammarPoint] = useState<GrammarPoint | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/lessons');
      return;
    }
    loadData(id);
  }, [id]);

  const loadData = async (grammarId: string) => {
    try {
      setLoading(true);
      const [gpData, sentencesData] = await Promise.all([
        getGrammarPointById(grammarId),
        getSentencesByGrammarPoint(grammarId),
      ]);

      if (!gpData) {
        navigate('/lessons');
        return;
      }

      setGrammarPoint(gpData);
      setSentences(sentencesData);
    } catch (error) {
      console.error('Failed to load grammar details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLesson = () => {
    if (grammarPoint) {
      navigate(`/lesson/${grammarPoint.lessonNumber}`);
    } else {
      navigate('/lessons');
    }
  };

  const handleSentenceClick = (sentenceId: string) => {
    if (grammarPoint) {
      navigate(`/study?grammar=${encodeURIComponent(grammarPoint.id)}&sentence=${sentenceId}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : !grammarPoint ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="noren-card p-8 text-center max-w-md w-full">
            <p className="text-ink-soft">语法点不存在</p>
            <button
              onClick={() => navigate('/lessons')}
              className="mt-4 text-accent hover:text-accent-hover font-medium"
            >
              返回课程列表
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={handleBackToLesson}
            className="flex items-center gap-2 text-ink-soft hover:text-ink mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            返回课程
          </button>

          <div className="mb-8">
            <GrammarIntro grammarPoint={grammarPoint} />
          </div>

          <div className="noren-card p-6">
            <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
              <BookOpen size={22} className="text-accent" />
              例句列表
            </h2>

            {sentences.length === 0 ? (
              <p className="text-ink-soft text-center py-4">暂无例句</p>
            ) : (
              <div className="space-y-3">
                {sentences.map((sentence, index) => (
                  <button
                    key={sentence.id}
                    onClick={() => handleSentenceClick(sentence.id)}
                    className="w-full text-left p-4 rounded-md border border-border bg-surface hover:border-accent/30 hover:bg-surface-hover transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink mb-1 line-clamp-2">{sentence.sentence}</p>
                        <p className="text-sm text-ink-soft line-clamp-1">{sentence.translation}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-ink-soft mb-4">
                共 {sentences.length} 个例句
              </p>
              <button
                onClick={() => navigate(`/study?grammar=${encodeURIComponent(grammarPoint.id)}`)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors"
              >
                开始学习
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
