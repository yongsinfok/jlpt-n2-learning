/**
 * 成就系统 - XP、等级、成就解锁
 */

import { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement?: number; // XP 要求
}

export interface AchievementSystemProps {
  xp: number;
  level: number;
  achievements: Achievement[];
  onAchievementUnlock?: (achievementId: string) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: '初出茅庐',
    description: '完成第一道题目',
    icon: <Star size={32} />,
    rarity: 'common',
    unlocked: true,
  },
  {
    id: 'combo_master',
    title: '连击大师',
    description: '达到 10 连击',
    icon: <Sparkles size={32} />,
    rarity: 'legendary',
    unlocked: false,
    requirement: 1000, // 需要在一次游戏中获得 1000 XP
  },
  {
    id: 'combo_strong',
    title: '连击高手',
    description: '达到 5 连击',
    icon: <Trophy size={32} />,
    rarity: 'rare',
    unlocked: false,
    requirement: 300,
  },
  {
    id: 'speed_demon',
    title: '速度恶魔',
    description: '60秒内完成所有题目',
    icon: <Award size={32} />,
    rarity: 'epic',
    unlocked: false,
    requirement: 2000,
  },
  {
    id: 'perfectionist',
    title: '完美主义',
    description: '单次练习零错误',
    icon: <Star size={32} />,
    rarity: 'legendary',
    unlocked: false,
    requirement: 500, // 连续 10 题全对
  },
];

const LEVELS = [
  { level: 1, title: '初学者', minXP: 0, color: 'from-gray-500 to-gray-700' },
  { level: 2, title: '入门', minXP: 100, color: 'from-blue-400 to-blue-600' },
  { level: 3, title: '熟练', minXP: 500, color: 'from-green-400 to-green-600' },
  { level: 4, title: '专家', minXP: 1500, color: 'from-purple-400 to-purple-600' },
  { level: 5, title: '大师', minXP: 3000, color: 'from-yellow-400 to-orange-500' },
];

export const AchievementSystem = ({ xp, level, achievements, onAchievementUnlock }: AchievementSystemProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // 计算下一级所需的 XP
  const nextLevel = LEVELS.find(l => l.level === level + 1);
  const xpToNextLevel = nextLevel ? nextLevel.minXP - xp : 0;
  const progress = nextLevel ? Math.min(100, (xp / nextLevel.minXP) * 100) : 0;

  // 检查新解锁的成就
  useEffect(() => {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.requirement && xp >= achievement.requirement) {
        onAchievementUnlock?.(achievement.id);
      }
    });
  }, [xp, achievements, onAchievementUnlock]);

  return (
    <div className="relative">
      {/* XP 和等级显示 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-indigo-200">等级</div>
            <div className="text-4xl font-bold">{level}</div>
          </div>
          <div>
            <div className="text-sm text-indigo-200">XP</div>
            <div className="text-4xl font-bold">{xp}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-indigo-200">下一级</div>
            <div className="text-2xl font-bold text-yellow-300">
              {nextLevel ? nextLevel.title : '---'}
            </div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${nextLevel?.color}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 成就网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement) => (
          <div
            key={achievement.id}
            onClick={() => achievement.unlocked && setSelectedAchievement(achievement)}
            className={`
              bg-white rounded-2xl p-6 shadow-lg border-2
              transition-all duration-300
              ${achievement.unlocked
                ? 'border-gray-200 hover:scale-105 hover:shadow-xl cursor-pointer'
                : 'border-gray-100 opacity-50 cursor-not-allowed'
              }
              ${achievement.rarity === 'legendary' && 'animate-pulse'}
            `}
          >
            {/* 成就图标 */}
            <div className={`
              w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
              ${achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                : 'bg-gray-200'
              }
            `}>
              {achievement.unlocked ? (
                achievement.icon
              ) : (
                <div className="text-gray-400 text-3xl">?</div>
              )}
            </div>

            {/* 成就信息 */}
            <div>
              <div className={`font-bold text-lg mb-2 ${achievement.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                {achievement.title}
              </div>
              <div className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </div>
              
              {/* 稀有度标签 */}
              {achievement.rarity !== 'common' && achievement.unlocked && (
                <div className="mt-2">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold text-white
                    ${achievement.rarity === 'legendary'
                      ? 'bg-purple-600'
                      : achievement.rarity === 'epic'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }
                  `}>
                    {achievement.rarity === 'legendary' && '⭐传说'}
                    {achievement.rarity === 'epic' && '💎史诗'}
                    {achievement.rarity === 'rare' && '💎稀有'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 成就详情弹窗 */}
      {showModal && selectedAchievement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="text-center mb-6">
              {selectedAchievement.icon}
              <div className="mt-4 text-4xl font-bold text-gray-800">
                {selectedAchievement.title}
              </div>
              <div className={`text-sm text-gray-600 mb-2 ${selectedAchievement.rarity === 'legendary' ? 'animate-pulse' : ''}`}>
                {selectedAchievement.description}
              </div>
              {selectedAchievement.requirement && (
                <div className="text-xs text-purple-600 font-semibold">
                  需求: {selectedAchievement.requirement} XP
                </div>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
