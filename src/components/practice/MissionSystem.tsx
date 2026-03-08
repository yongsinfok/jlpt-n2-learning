/**
 * 任务系统 - 每日目标、连续学习天数、完成奖励
 */

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Target, CheckCircle2, Zap, Award, TrendingUp } from 'lucide-react';

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  rewardXP: number;
  completed: boolean;
}

export interface MissionSystemProps {
  dailyGoal: number;
  studyMinutes: number;
  streakDays: number;
  onCompleteMission?: (missionId: string) => void;
}

export const MissionSystem = ({
  dailyGoal,
  studyMinutes,
  streakDays,
  onCompleteMission,
}: MissionSystemProps) => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'daily_questions',
      title: '每日问答',
      description: `完成 ${dailyGoal} 道题目`,
      target: dailyGoal,
      current: 0,
      unit: '题',
      rewardXP: 50,
      completed: false,
    },
    {
      id: 'daily_study_time',
      title: '每日学习',
      description: `学习 ${studyMinutes} 分钟`,
      target: studyMinutes,
      current: 0,
      unit: '分钟',
      rewardXP: 30,
      completed: false,
    },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);

  // 计算每日任务完成百分比
  const dailyProgress = useMemo(() => {
    const completedCount = missions.filter(m => m.completed).length;
    return Math.round((completedCount / missions.length) * 100);
  }, [missions]);

  // 完成任务
  const completeMission = useCallback((missionId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return { ...m, completed: true, current: m.target };
      }
      return m;
    }));
    
    setShowConfetti(true);
    onCompleteMission?.(missionId);
    
    setTimeout(() => setShowConfetti(false), 3000);
  }, [onCompleteMission]);

  // 格式化时间显示
  const formatMinutes = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}小时${mins}分`;
    }
    return `${minutes}分钟`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8 rounded-3xl">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-white" />
          <div className="text-white">
            <div className="text-2xl font-bold">每日任务</div>
            <div className="text-sm text-blue-100">
              {new Date().toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-6 py-3">
            <Target size={24} className="text-teal-600" />
            <div className="ml-3 text-teal-800">
              <div className="text-sm">目标进度</div>
              <div className="text-3xl font-bold">{dailyProgress}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white">
            <TrendingUp size={24} />
            <div className="ml-3">
              <div className="text-sm text-blue-100">连续学习</div>
              <div className="text-2xl font-bold">{streakDays} 天</div>
            </div>
          </div>
        </div>

      {/* 任务列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`
              bg-white rounded-2xl p-6 shadow-lg border-2
              transition-all duration-300
              ${mission.completed
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-500 hover:scale-105 hover:shadow-xl'
              }
            `}
          >
            {/* 任务标题 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white
                  ${mission.completed
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                  }
                `}>
                  {mission.completed ? <CheckCircle2 size={24} /> : <div className="text-2xl">?</div>}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {mission.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mission.description}
                  </div>
                </div>
              </div>
              
              {!mission.completed && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    奖励
                  </div>
                  <div className="text-xl font-bold text-teal-600">
                    +{mission.rewardXP} XP
                  </div>
                </div>
              )}
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="text-xs text-gray-600 mb-2">
                {mission.current} / {mission.target} {mission.unit}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`
                    h-full transition-all duration-500
                    ${mission.completed
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                    }
                  `}
                  style={{ width: `${(mission.current / mission.target) * 100}%` }}
                />
              </div>
            </div>

            {/* 完成按钮 */}
            {!mission.completed && (
              <button
                onClick={() => completeMission(mission.id)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Zap size={20} className="mr-2" />
                完成任务
              </button>
            )}

            {mission.completed && (
              <div className="text-center text-green-600 font-semibold">
                <Award size={20} className="inline mr-2" />
                已完成
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 礼花动画 */}
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce-in">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `confetti-fall 0.5s ${Math.random() * 2}s linear forwards`,
                  color: ['#f472b6', '#ffd700', '#4caf50', '#2196f3', '#9c27b0', '#00bcd4', '#ff5722'][Math.floor(Math.random() * 7)],
                }}
              >
                🎉
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
