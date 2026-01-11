/**
 * 成就页面 - 显示所有成就和解锁状态
 */

import { useEffect, useState } from 'react';
import { getAllAchievements } from '@/db/operations';
import { AchievementBadge } from '@/components/progress/AchievementBadge';
import { Award, Filter } from 'lucide-react';

type AchievementCategory = 'all' | 'learning' | 'practice' | 'streak' | 'milestone';

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const allAchievements = await getAllAchievements();
    setAchievements(allAchievements);
  };

  const filteredAchievements = achievements.filter((achievement) => {
    // 按解锁状态筛选
    if (showUnlockedOnly && !achievement.isUnlocked) {
      return false;
    }

    // 按分类筛选
    if (selectedCategory === 'all') {
      return true;
    }

    // 根据成就ID推断分类
    if (selectedCategory === 'learning') {
      return achievement.id.includes('grammar') || achievement.id.includes('sentence') || achievement.id.includes('lesson');
    }
    if (selectedCategory === 'practice') {
      return achievement.id.includes('quiz') || achievement.id.includes('perfect') || achievement.id.includes('correct');
    }
    if (selectedCategory === 'streak') {
      return achievement.id.includes('streak') || achievement.id.includes('days');
    }
    if (selectedCategory === 'milestone') {
      return achievement.id.includes('progress') || achievement.id.includes('percent') || achievement.id.includes('complete');
    }

    return true;
  });

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-gray-900">成就徽章</h1>
        </div>
        <p className="text-gray-600">
          已解锁: <strong className="text-amber-600">{unlockedCount}</strong> / {totalCount}
        </p>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* 分类筛选 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">分类:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedCategory('learning')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'learning'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                学习进度
              </button>
              <button
                onClick={() => setSelectedCategory('practice')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'practice'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                练习成绩
              </button>
              <button
                onClick={() => setSelectedCategory('streak')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'streak'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                坚持学习
              </button>
              <button
                onClick={() => setSelectedCategory('milestone')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'milestone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                里程碑
              </button>
            </div>
          </div>

          {/* 状态筛选 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">只显示已解锁</span>
          </label>
        </div>
      </div>

      {/* 成就网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            icon={achievement.icon}
            name={achievement.name}
            description={achievement.description}
            isUnlocked={achievement.isUnlocked}
            unlockedDate={achievement.unlockedDate}
            showDetails
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredAchievements.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到成就</h3>
          <p className="text-gray-600">
            {showUnlockedOnly
              ? '还没有解锁任何成就，继续学习吧！'
              : '该分类下没有成就'}
          </p>
        </div>
      )}

      {/* 成就说明 */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          关于成就系统
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          成就系统旨在激励你坚持学习。当你完成特定目标时，会自动解锁相应的成就徽章。
          成就分为多个类别：学习进度、练习成绩、坚持学习和里程碑等。
          有些成就需要持续努力才能解锁，比如连续学习30天或完成全部课程。
        </p>
      </div>
    </div>
  );
}
