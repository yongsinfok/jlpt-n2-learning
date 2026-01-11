/**
 * 成就徽章组件
 * 显示成就的图标、名称和解锁状态
 */

import { Lock } from 'lucide-react';
import { useState } from 'react';

interface AchievementBadgeProps {
  /** 成就图标/emoji */
  icon: string;
  /** 成就名称 */
  name: string;
  /** 成就描述 */
  description: string;
  /** 是否已解锁 */
  isUnlocked: boolean;
  /** 解锁日期 */
  unlockedDate?: Date;
  /** 成就分类 */
  category?: 'learning' | 'practice' | 'streak' | 'milestone';
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

export function AchievementBadge({
  icon,
  name,
  description,
  isUnlocked,
  unlockedDate,
  category,
  showDetails = false,
  onClick,
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (cat?: string): string => {
    switch (cat) {
      case 'learning':
        return 'from-blue-400 to-blue-600';
      case 'practice':
        return 'from-purple-400 to-purple-600';
      case 'streak':
        return 'from-orange-400 to-red-600';
      case 'milestone':
        return 'from-yellow-400 to-amber-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer
        ${isUnlocked
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 hover:shadow-lg hover:scale-105'
          : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
        }
      `}
    >
      {/* 成就图标 */}
      <div className={`
        text-4xl mb-2 transition-transform duration-200
        ${isUnlocked ? 'scale-100' : 'grayscale scale-75'}
        ${isHovered ? 'scale-110' : ''}
      `}>
        {isUnlocked ? icon : <Lock className="w-8 h-8 text-gray-400" />}
      </div>

      {/* 成就名称 */}
      <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {name}
      </h4>

      {/* 成就描述（显示详情时） */}
      {showDetails && (
        <p className={`text-sm mb-2 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
      )}

      {/* 解锁状态 */}
      {isUnlocked ? (
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-600 font-medium">已解锁</span>
          {unlockedDate && (
            <span className="text-gray-500 ml-1">
              ({formatDate(unlockedDate)})
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <span className="text-gray-500">未解锁</span>
        </div>
      )}

      {/* 悬停提示 */}
      {isHovered && !showDetails && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl p-3 flex items-center justify-center text-center z-10">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}

      {/* 分类标签（可选） */}
      {category && isUnlocked && (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs text-white bg-gradient-to-r ${getCategoryColor(category)}`}>
          {getCategoryLabel(category)}
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'learning':
      return '学习';
    case 'practice':
      return '练习';
    case 'streak':
      return '坚持';
    case 'milestone':
      return '里程碑';
    default:
      return '';
  }
}
