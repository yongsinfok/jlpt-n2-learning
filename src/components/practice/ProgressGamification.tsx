/**
 * 进度游戏化组件 - 可视化学习热力图、成就完成率、XP 曲线
 */

import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, BarChart3, LineChart, Calendar } from 'lucide-react';
import Recharts from 'recharts';

export interface ProgressGamificationProps {
  studyData: {
    date: string;
    minutes: number;
    questionsCompleted: number;
    accuracy: number;
  }[];
  achievements: Array<{
    id: string;
    unlockedAt: string;
  }>;
  xpHistory: Array<{
    date: string;
    amount: number;
    total: number;
  }>;
}

export const ProgressGamification = ({
  studyData,
  achievements,
  xpHistory,
}: ProgressGamificationProps) => {
  const [selectedView, setSelectedView] = useState<'heatmap' | 'chart' | 'calendar'>('chart');

  // 计算学习热力图数据
  const heatmapData = useMemo(() => {
    const days: Record<string, number> = {};
    studyData.forEach(day => {
      const dateKey = day.date.split('T')[0];
      days[dateKey] = (days[dateKey] || 0) + day.minutes;
    });
    
    // 找到最大值用于归一化
    const maxMinutes = Math.max(...Object.values(days));
    
    return Object.entries(days).map(([date, minutes]) => ({
      date,
      value: minutes / maxMinutes,
    }));
  }, [studyData]);

  // 计算 XP 曲线
  const xpChartData = useMemo(() => {
    return xpHistory.map(h => ({
      date: h.date.split('T')[0],
      xp: h.amount,
      total: h.total,
    }));
  }, [xpHistory]);

  // 计算成就完成率
  const completionRate = useMemo(() => {
    if (achievements.length === 0) return 0;
    return Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100);
  }, [achievements]);

  return (
    <div className="space-y-8 bg-white rounded-2xl p-8 shadow-xl">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">学习数据中心</h2>
          <p className="text-gray-600">可视化你的学习进度和成就</p>
        </div>
        
        {/* 视图切换 */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-2">
          <button
            onClick={() => setSelectedView('heatmap')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'heatmap' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <TrendingUp size={20} />
          </button>
          <button
            onClick={() => setSelectedView('chart')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'chart' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => setSelectedView('calendar')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'calendar' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {selectedView === 'heatmap' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📅 学习热力图</h3>
          <p className="text-gray-600 mb-4">过去 7 天的学习时长分布</p>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                className={`
                  aspect-square rounded-lg
                  transition-all duration-200 hover:scale-105
                  ${day.value === 0
                    ? 'bg-gray-100 border-gray-200'
                    : day.value > 0.75
                      ? 'bg-red-500 text-white'
                      : day.value > 0.5
                        ? 'bg-orange-400 text-white'
                        : day.value > 0.25
                          ? 'bg-yellow-400 text-white'
                          : 'bg-green-400 text-white'
                  }
                `}
                title={`${day.date}: ${Math.round(day.value * 60)}分钟`}
              >
                {day.value > 0 ? (
                  <div className="text-3xl">
                    {day.value === 0 ? '-' : Math.round(day.value * 100)}
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">-</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'chart' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 XP 成长曲线</h3>
          <div className="h-96 bg-gray-50 rounded-xl p-4">
            <Recharts width="100%" height="100%">
              <LineChart
                width="100%"
                height="100%"
                data={xpChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  yAxisId="xp"
                  labelFormatter={(value) => `${Math.round(value)} XP`}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return (
                      <div className="bg-white p-2 rounded-lg shadow-lg">
                        <p className="font-bold text-gray-800">{props.date}</p>
                        <p className="text-sm text-gray-600">
                          获得: +{value} XP
                        </p>
                        <p className="text-xs text-gray-500">
                          总计: {props.total} XP
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Recharts>
          </div>
        </div>
      )}

      {selectedView === 'calendar' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📆 学习日历</h3>
          <p className="text-gray-600 mb-4">按日查看学习记录和成就</p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const date = new Date();
              date.setDate(date.getDate() - idx);
              const dateStr = date.toLocaleDateString('zh-CN');
              
              const dayData = studyData.find(d => d.date === dateStr);
              const dayAchievements = achievements.filter(a => {
                const achievementDate = a.unlockedAt.split('T')[0];
                return achievementDate === dateStr;
              });

              return (
                <div
                  key={idx}
                  className={`
                    aspect-square rounded-lg border-2 p-2
                    transition-all duration-200 hover:scale-105
                    ${dayAchievements.length > 0
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {date.getDate()}
                    </div>
                    {dayAchievements.length > 0 && (
                      <div className="text-2xl">
                        {dayAchievements.length}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 成就完成率 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{completionRate}%</div>
            <div className="text-2xl font-semibold">成就完成率</div>
          </div>
          <div className="text-center text-indigo-100 mt-2">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{studyData.reduce((sum, d) => sum + d.minutes, 0)}</div>
            <div className="text-2xl font-semibold">总学习时长（分钟）</div>
          </div>
          <div className="text-center text-blue-100 mt-2">
            近 7 天
          </div>
        </div>
      </div>
    </div>
  );
};
