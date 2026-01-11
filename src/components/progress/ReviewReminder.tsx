/**
 * 复习提醒组件
 * 显示需要复习的语法点和快速操作按钮
 */

import { Bell, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReviewItem {
  grammarId: string;
  grammarPoint: string;
  lessonNumber: number;
  daysSinceReview: number;
}

interface ReviewReminderProps {
  /** 需要复习的语法点列表 */
  reviewItems: ReviewItem[];
  /** 预计复习时间（分钟） */
  estimatedTime?: number;
  /** 是否显示详细信息 */
  showDetails?: boolean;
}

export function ReviewReminder({
  reviewItems,
  estimatedTime,
  showDetails = false,
}: ReviewReminderProps) {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || reviewItems.length === 0) {
    return null;
  }

  const handleStartReview = () => {
    navigate('/review');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const getUrgencyColor = (days: number): string => {
    if (days <= 0) return 'text-red-600 bg-red-50';
    if (days <= 2) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getUrgencyText = (days: number): string => {
    if (days <= 0) return '已到期';
    if (days === 1) return '昨天到期';
    return `${days}天前到期`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-amber-600 w-5 h-5" strokeWidth={2.5} />
          <h3 className="font-semibold text-gray-900">今日需要复习</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          关闭
        </button>
      </div>

      <p className="text-gray-700 mb-4">
        <span className="font-bold text-amber-700">{reviewItems.length}</span> 个语法点到期需要复习
        {estimatedTime && (
          <span className="text-gray-600 ml-2">
            · 预计 <Clock className="inline w-4 h-4 mx-1" />
            {estimatedTime} 分钟
          </span>
        )}
      </p>

      {/* 复习列表 */}
      {showDetails && reviewItems.length > 0 && (
        <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
          {reviewItems.slice(0, 5).map((item) => (
            <div
              key={item.grammarId}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.grammarPoint}</p>
                <p className="text-xs text-gray-500">课程 {item.lessonNumber}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.daysSinceReview)}`}>
                {getUrgencyText(item.daysSinceReview)}
              </div>
            </div>
          ))}
          {reviewItems.length > 5 && (
            <p className="text-xs text-gray-500 text-center py-2">
              还有 {reviewItems.length - 5} 个语法点需要复习...
            </p>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleStartReview}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
        >
          开始复习
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          推迟
        </button>
      </div>

      {reviewItems.length >= 5 && (
        <p className="text-xs text-amber-700 mt-3 text-center">
          积累较多，建议每天复习防止遗忘！
        </p>
      )}
    </div>
  );
}
