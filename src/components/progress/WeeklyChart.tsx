/**
 * 本周学习图表组件
 * 显示本周每天的学习量（柱状图）
 */

import { BarChart3 } from 'lucide-react';

interface DailyData {
  /** 日期 */
  date: Date;
  /** 学习的语法点数量 */
  grammarCount: number;
  /** 学习的例句数量 */
  sentenceCount: number;
  /** 是否是今天 */
  isToday?: boolean;
}

interface WeeklyChartProps {
  /** 本周数据 */
  weeklyData: DailyData[];
  /** 数据类型 */
  dataType?: 'grammar' | 'sentence' | 'both';
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function WeeklyChart({
  weeklyData,
  dataType = 'both',
}: WeeklyChartProps) {
  const getMaxValue = (): number => {
    let max = 0;
    weeklyData.forEach((day) => {
      if (dataType === 'grammar') {
        max = Math.max(max, day.grammarCount);
      } else if (dataType === 'sentence') {
        max = Math.max(max, day.sentenceCount);
      } else {
        max = Math.max(max, day.grammarCount + day.sentenceCount);
      }
    });
    return max || 5; // 默认最大值为5，避免全0时没有参考
  };

  const getBarHeight = (value: number): number => {
    const max = getMaxValue();
    if (max === 0) return 0;
    return (value / max) * 100;
  };

  const getBarColor = (value: number, isToday: boolean): string => {
    if (value === 0) return 'bg-gray-200';
    if (isToday) return 'bg-gradient-to-t from-blue-500 to-blue-400';
    return 'bg-gradient-to-t from-blue-400 to-blue-300';
  };

  const getTotalCount = (day: DailyData): number => {
    if (dataType === 'grammar') return day.grammarCount;
    if (dataType === 'sentence') return day.sentenceCount;
    return day.grammarCount + day.sentenceCount;
  };

  const getTotalForWeek = (): number => {
    return weeklyData.reduce((sum, day) => sum + getTotalCount(day), 0);
  };

  const max = getMaxValue();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600 w-5 h-5" />
          <h3 className="font-semibold text-gray-900">本周学习</h3>
        </div>
        <div className="text-sm text-gray-600">
          总计: <span className="font-bold text-blue-600">{getTotalForWeek()}</span> {' '}
          {dataType === 'grammar' ? '个语法点' : dataType === 'sentence' ? '个例句' : '项'}
        </div>
      </div>

      {/* 图表 */}
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {weeklyData.map((day, index) => {
          const count = getTotalCount(day);
          const height = getBarHeight(count);

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* 数量标签 */}
              {count > 0 && (
                <span className={`text-xs font-medium ${
                  day.isToday ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {count}
                </span>
              )}

              {/* 柱状图 */}
              <div className="w-full flex-1 flex items-end justify-center bg-gray-50 rounded-t-lg relative overflow-hidden">
                <div
                  className={`
                    w-full max-w-[40px] rounded-t-lg transition-all duration-300
                    ${getBarColor(count, day.isToday || false)}
                  `}
                  style={{ height: `${height}%` }}
                />

                {/* 今天标记 */}
                {day.isToday && (
                  <div className="absolute inset-0 border-2 border-blue-300 rounded-t-lg pointer-events-none" />
                )}
              </div>

              {/* 星期标签 */}
              <span className={`text-xs font-medium ${
                day.isToday ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}>
                {WEEKDAYS[day.date.getDay()]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Y轴刻度 */}
      <div className="flex justify-between text-xs text-gray-400 px-2 mb-2">
        <span>{max}</span>
        <span>{Math.round(max / 2)}</span>
        <span>0</span>
      </div>

      {/* 空状态 */}
      {getTotalForWeek() === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">本周还没有学习记录</p>
          <p className="text-gray-400 text-xs mt-1">开始学习后这里会显示你的进度</p>
        </div>
      )}

      {/* 统计信息 */}
      {getTotalForWeek() > 0 && (
        <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">最多一天</p>
            <p className="text-lg font-bold text-blue-600">{max}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">学习天数</p>
            <p className="text-lg font-bold text-blue-600">
              {weeklyData.filter(d => getTotalCount(d) > 0).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">日均</p>
            <p className="text-lg font-bold text-blue-600">
              {Math.round(getTotalForWeek() / 7)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
