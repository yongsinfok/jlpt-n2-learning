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
    if (days <= 0) return 'text-accent bg-surface-dim';
    if (days <= 2) return 'text-accent/80 bg-surface-dim';
    return 'text-amber bg-surface-dim';
  };

  const getUrgencyText = (days: number): string => {
    if (days <= 0) return '已到期';
    if (days === 1) return '昨天到期';
    return `${days}天前到期`;
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-amber w-5 h-5" strokeWidth={2.5} />
          <h3 className="font-semibold text-ink">今日需要复习</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-ink-faint hover:text-ink-soft text-sm transition-colors"
        >
          关闭
        </button>
      </div>

      <p className="text-ink-soft mb-4">
        <span className="font-bold text-amber">{reviewItems.length}</span> 个语法点到期需要复习
        {estimatedTime && (
          <span className="text-ink-soft ml-2">
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
              className="flex items-center justify-between bg-surface rounded-lg p-3 border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-ink">{item.grammarPoint}</p>
                <p className="text-xs text-ink-mute">课程 {item.lessonNumber}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.daysSinceReview)}`}>
                {getUrgencyText(item.daysSinceReview)}
              </div>
            </div>
          ))}
          {reviewItems.length > 5 && (
            <p className="text-xs text-ink-mute text-center py-2">
              还有 {reviewItems.length - 5} 个语法点需要复习...
            </p>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleStartReview}
          className="flex-1 bg-amber hover:bg-amber/80 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
        >
          开始复习
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2.5 text-ink-soft hover:text-ink hover:bg-surface-dim rounded-lg transition-colors font-medium"
        >
          推迟
        </button>
      </div>

      {reviewItems.length >= 5 && (
        <p className="text-xs text-amber mt-3 text-center">
          积累较多，建议每天复习防止遗忘！
        </p>
      )}
    </div>
  );
}
