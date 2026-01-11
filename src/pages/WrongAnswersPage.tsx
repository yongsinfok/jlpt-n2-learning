/**
 * 错题本页面
 * 按语法点分组显示错题，支持按语法点复习和全部复习
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookX,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react';
import { db } from '@/db/schema';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { WrongAnswer, Sentence } from '@/types';

/** 按语法点分组的错题 */
interface GroupedWrongAnswer {
  grammarPoint: string;
  wrongAnswers: Array<WrongAnswer & { sentence?: Sentence }>;
  totalCount: number;
}

export function WrongAnswersPage() {
  const navigate = useNavigate();

  // 状态
  const [groupedWrongAnswers, setGroupedWrongAnswers] = useState<GroupedWrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'unresolved'>('unresolved');
  const [showFilter, setShowFilter] = useState(false);
  const [totalWrongCount, setTotalWrongCount] = useState(0);

  // 加载错题数据
  useEffect(() => {
    const loadWrongAnswers = async () => {
      try {
        setLoading(true);

        // 获取错题
        let wrongAnswers: WrongAnswer[];
        if (filterMode === 'unresolved') {
          wrongAnswers = await db.wrongAnswers.where('resolved').equals(0).toArray();
        } else {
          wrongAnswers = await db.wrongAnswers.toArray();
        }

        setTotalWrongCount(wrongAnswers.length);

        if (wrongAnswers.length === 0) {
          setGroupedWrongAnswers([]);
          setLoading(false);
          return;
        }

        // 按语法点分组
        const grouped = new Map<string, WrongAnswer[]>();
        for (const wrong of wrongAnswers) {
          if (!grouped.has(wrong.grammarPoint)) {
            grouped.set(wrong.grammarPoint, []);
          }
          grouped.get(wrong.grammarPoint)!.push(wrong);
        }

        // 获取相关例句并构建分组数据
        const groupedData: GroupedWrongAnswer[] = [];
        for (const [grammarPoint, wrongs] of grouped.entries()) {
          // 获取该语法点的例句
          const sentenceIds = wrongs.map(w => w.sentenceId);
          const sentences = await db.sentences.where('id').anyOf(sentenceIds).toArray();
          const sentenceMap = new Map(sentences.map(s => [s.id, s]));

          groupedData.push({
            grammarPoint,
            wrongAnswers: wrongs.map(w => ({
              ...w,
              sentence: sentenceMap.get(w.sentenceId),
            })),
            totalCount: wrongs.length,
          });
        }

        // 按错误次数排序
        groupedData.sort((a, b) => b.totalCount - a.totalCount);

        setGroupedWrongAnswers(groupedData);
        setLoading(false);
      } catch (error) {
        console.error('加载错题失败:', error);
        setLoading(false);
      }
    };

    loadWrongAnswers();
  }, [filterMode]);

  // 格式化日期
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${Math.floor(days / 30)}月前`;
  };

  // 开始复习指定语法点的错题
  const handleReviewGrammar = (grammarPoint: string) => {
    navigate(`/quiz?type=fill&grammar=${encodeURIComponent(grammarPoint)}&count=10`);
  };

  // 开始复习全部错题
  const handleReviewAll = () => {
    // 生成包含所有错题语法点的练习
    const grammarPoints = groupedWrongAnswers.map(g => g.grammarPoint);
    // 这里可以通过后端或前端生成题目
    navigate(`/practice`);
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // 空状态
  if (groupedWrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">错题本</h1>
            <p className="text-gray-600">复习你做错的题目，巩固薄弱环节</p>
          </div>

          <EmptyState
            icon={<BookX className="w-16 h-16 text-gray-400" />}
            title="暂无错题"
            description={
              filterMode === 'unresolved'
                ? '太棒了！你已经掌握了所有做过的题目。'
                : '还没有错题记录，继续努力学习吧！'
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">错题本</h1>
              <p className="text-gray-600">
                共 {totalWrongCount} 道错题，{groupedWrongAnswers.length} 个语法点需要复习
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilter
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-5 h-5" />
                筛选
              </button>

              <button
                onClick={handleReviewAll}
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
              >
                复习全部
              </button>
            </div>
          </div>

          {/* 筛选面板 */}
          {showFilter && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterMode('unresolved')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterMode === 'unresolved'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  未掌握
                </button>
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterMode === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 错题列表 */}
        <div className="space-y-4">
          {groupedWrongAnswers.map(group => (
            <div
              key={group.grammarPoint}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* 语法点标题 */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-900">{group.grammarPoint}</h3>
                    <span className="px-3 py-1 bg-error-light text-error text-sm font-medium rounded-full">
                      {group.wrongAnswers.length} 道错题
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewGrammar(group.grammarPoint)}
                      className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      复习此语法点
                    </button>
                  </div>
                </div>
              </div>

              {/* 错题详情列表 */}
              <div className="divide-y divide-gray-100">
                {group.wrongAnswers.map(wrong => (
                  <div
                    key={wrong.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* 例句 */}
                        {wrong.sentence && (
                          <div className="mb-2">
                            <p className="text-gray-900 font-medium">{wrong.sentence.sentence}</p>
                            <p className="text-sm text-gray-600 mt-1">{wrong.sentence.translation}</p>
                          </div>
                        )}

                        {/* 统计信息 */}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-error" />
                            答错 {wrong.wrongCount} 次
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            最后答错于 {formatDate(wrong.lastWrongDate)}
                          </div>
                          {wrong.resolved && (
                            <div className="flex items-center gap-1 text-success">
                              <CheckCircle2 className="w-4 h-4" />
                              已掌握（连续答对 {wrong.correctStreak} 次）
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/quiz?type=fill&grammar=${encodeURIComponent(group.grammarPoint)}&count=3`)}
                        className="flex-shrink-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        练习
                        <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="mt-8 bg-info-light border-l-4 border-info p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>提示：</strong>
            连续答对一道错题 3 次后，该题目会从错题本中移除。建议定期复习错题，巩固薄弱环节。
          </p>
        </div>
      </div>
    </div>
  );
}
