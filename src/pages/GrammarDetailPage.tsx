/**
 * 语法点详情页 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

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

/**
 * 语法点详情页面
 */
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!grammarPoint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card-strong p-8 text-center">
          <p className="text-text-secondary">语法点不存在</p>
          <button
            onClick={() => navigate('/lessons')}
            className="mt-4 text-primary hover:text-secondary font-medium"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={handleBackToLesson}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        返回课程
      </button>

      {/* 语法点介绍 */}
      <div className="mb-8">
        <GrammarIntro grammarPoint={grammarPoint} />
      </div>

      {/* 例句列表 */}
      <div className="glass-card-strong p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BookOpen size={22} className="text-primary" />
          例句列表
        </h2>

        {sentences.length === 0 ? (
          <p className="text-text-secondary text-center py-4">暂无例句</p>
        ) : (
          <div className="space-y-3">
            {sentences.map((sentence, index) => (
              <button
                key={sentence.id}
                onClick={() => handleSentenceClick(sentence.id)}
                className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white/30 hover:border-primary/30 hover:bg-white/60 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium group-hover:shadow-glow transition-all">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary mb-1 line-clamp-2">{sentence.sentence}</p>
                    <p className="text-sm text-text-secondary line-clamp-1">{sentence.translation}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary mb-4">
            共 {sentences.length} 个例句
          </p>
          <button
            onClick={() => navigate(`/study?grammar=${encodeURIComponent(grammarPoint.id)}`)}
            className="btn-modern-primary py-3 px-8"
          >
            开始学习
          </button>
        </div>
      </div>
    </div>
  );
}
