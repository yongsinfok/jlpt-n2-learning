/**
 * 日期处理工具函数
 */

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
export function getTodayString(): string {
  const today = new Date();
  return formatDateToString(today);
}

/**
 * 格式化日期为字符串 (YYYY-MM-DD)
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 解析日期字符串为 Date 对象
 */
export function parseStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 判断是否是今天
 */
export function isToday(date: Date): boolean {
  const today = getTodayString();
  return formatDateToString(date) === today;
}

/**
 * 判断是否是本周
 */
export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // 周日
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * 获取本周的日期数组
 */
export function getWeekDates(): Date[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // 周日

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
}

/**
 * 计算两个日期之间的天数差
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const timeDiff = date2.getTime() - date1.getTime();
  return Math.floor(timeDiff / msPerDay);
}

/**
 * 添加天数到日期
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 格式化时长（秒）为可读格式
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
}

/**
 * 格式化相对时间（如"3天前"）
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const daysDiff = getDaysBetween(date, now);

  if (daysDiff === 0) {
    return '今天';
  } else if (daysDiff === 1) {
    return '昨天';
  } else if (daysDiff < 7) {
    return `${daysDiff}天前`;
  } else if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks}周前`;
  } else {
    const months = Math.floor(daysDiff / 30);
    return `${months}个月前`;
  }
}

/**
 * 计算连续学习天数
 */
export function calculateStreak(lastStudyDate: Date | null): number {
  if (!lastStudyDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastStudyDate);
  lastDate.setHours(0, 0, 0, 0);

  const daysDiff = getDaysBetween(lastDate, today);

  // 如果最后学习日期是今天或昨天，连续有效
  if (daysDiff <= 1) {
    // TODO: 需要从数据库中查询历史连续天数
    return 1; // 这里简化处理，实际应该从数据库获取
  }

  return 0;
}
