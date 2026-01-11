/**
 * 语法点介绍组件
 */

import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { GrammarPoint } from '@/types';

export interface GrammarIntroProps {
  /** 语法点数据 */
  grammarPoint: GrammarPoint;
  /** 自定义类名 */
  className?: string;
}

/**
 * 语法点介绍组件
 * 显示语法点的名称、接续方式和详细说明
 */
export function GrammarIntro({ grammarPoint, className = '' }: GrammarIntroProps) {
  const navigate = useNavigate();

  const { id, grammarConnection, grammarExplanation, sentenceCount } = grammarPoint;

  const handleStartLearning = () => {
    navigate(`/study?grammar=${encodeURIComponent(id)}`);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-8 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-gray-900">{id}</h1>
      </div>

      {/* 接续方式 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          接续方式
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-lg text-gray-900 font-medium">{grammarConnection}</p>
        </div>
      </div>

      {/* 详细说明 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          详细说明
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {grammarExplanation}
          </p>
        </div>
      </div>

      {/* 例句数量提示 */}
      <div className="mb-6 text-sm text-gray-600">
        本语法点共有 <span className="font-bold text-primary">{sentenceCount}</span> 个例句
      </div>

      {/* 开始学习按钮 */}
      <button
        onClick={handleStartLearning}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        开始学习例句
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
