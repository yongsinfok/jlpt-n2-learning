/**
 * 连续学习天数组件
 * 显示用户连续学习的天数和激励信息
 */

import { Flame } from 'lucide-react';

interface StudyStreakProps {
  /** 连续学习天数 */
  streak: number;
  /** 是否显示详情 */
  showDetails?: boolean;
}

export function StudyStreak({ streak, showDetails = false }: StudyStreakProps) {
  const getStreakMessage = (days: number): string => {
    if (days === 0) return '开始你的学习之旅吧！';
    if (days < 3) return '保持学习的势头！';
    if (days < 7) return '学习习惯正在养成！';
    if (days < 14) return '太棒了，坚持了一周！';
    if (days < 30) return '坚持不懈，继续加油！';
    if (days < 60) return '学习达人就是你！';
    return '你是真正的学习大师！';
  };

  const getStreakColor = (days: number): string => {
    if (days === 0) return 'text-gray-400';
    if (days < 7) return 'text-orange-500';
    if (days < 14) return 'text-orange-600';
    if (days < 30) return 'text-red-500';
    return 'text-red-600';
  };

  const getNextMilestone = (days: number): { target: number; name: string } | null => {
    if (days < 3) return { target: 3, name: '初始里程碑' };
    if (days < 7) return { target: 7, name: '一周学习' };
    if (days < 14) return { target: 14, name: '两周学习' };
    if (days < 30) return { target: 30, name: '整月学习' };
    if (days < 60) return { target: 60, name: '两月学习' };
    if (days < 100) return { target: 100, name: '百日学习' };
    return null;
  };

  const nextMilestone = getNextMilestone(streak);
  const progressToNext = nextMilestone ? ((streak / nextMilestone.target) * 100) : 100;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${getStreakColor(streak)}`}>
          <Flame className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm text-gray-600">连续学习</p>
          <p className={`text-3xl font-bold ${getStreakColor(streak)}`}>
            {streak} <span className="text-lg">天</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700 font-medium mb-3">
        {getStreakMessage(streak)}
      </p>

      {showDetails && nextMilestone && streak < 100 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>距离{nextMilestone.name}</span>
            <span>{nextMilestone.target - streak}天</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
        </div>
      )}

      {streak === 0 && (
        <p className="text-xs text-gray-500 mt-2">
          每天学习一点点，积累成大进步！
        </p>
      )}
    </div>
  );
}
