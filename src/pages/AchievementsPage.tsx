/**
 * AchievementsPage - Modern Clean Design
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
    if (showUnlockedOnly && !achievement.isUnlocked) {
      return false;
    }

    if (selectedCategory === 'all') {
      return true;
    }

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
    <div className="min-h-screen bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-warning" />
            <h1 className="text-h1 md:text-3xl font-bold text-primary">成就徽章</h1>
          </div>
          <p className="text-body text-neutral-dark">
            已解锁: <strong className="text-warning">{unlockedCount}</strong> / {totalCount}
          </p>
        </div>

        {/* Filter */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-neutral-dark" />
              <span className="text-small text-neutral-dark">分类:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-primary hover:bg-neutral'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setSelectedCategory('learning')}
                  className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    selectedCategory === 'learning'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-primary hover:bg-neutral'
                  }`}
                >
                  学习进度
                </button>
                <button
                  onClick={() => setSelectedCategory('practice')}
                  className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    selectedCategory === 'practice'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-primary hover:bg-neutral'
                  }`}
                >
                  练习成绩
                </button>
                <button
                  onClick={() => setSelectedCategory('streak')}
                  className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    selectedCategory === 'streak'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-primary hover:bg-neutral'
                  }`}
                >
                  坚持学习
                </button>
                <button
                  onClick={() => setSelectedCategory('milestone')}
                  className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    selectedCategory === 'milestone'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-primary hover:bg-neutral'
                  }`}
                >
                  里程碑
                </button>
              </div>
            </div>

            {/* Status filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-small text-primary">只显示已解锁</span>
            </label>
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          <div className="card p-12 text-center">
            <Award className="w-16 h-16 text-neutral-dark mx-auto mb-4" />
            <h3 className="text-h1 text-primary mb-2">没有找到成就</h3>
            <p className="text-body text-neutral-dark">
              {showUnlockedOnly
                ? '还没有解锁任何成就，继续学习吧！'
                : '该分类下没有成就'}
            </p>
          </div>
        )}

        {/* Info section */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            关于成就系统
          </h3>
          <p className="text-small text-primary leading-relaxed">
            成就系统旨在激励你坚持学习。当你完成特定目标时，会自动解锁相应的成就徽章。
            成就分为多个类别：学习进度、练习成绩、坚持学习和里程碑等。
            有些成就需要持续努力才能解锁，比如连续学习30天或完成全部课程。
          </p>
        </div>
      </div>
    </div>
  );
}
