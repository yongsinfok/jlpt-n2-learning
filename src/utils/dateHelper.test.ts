import { describe, it, expect } from 'vitest';
import {
  formatDateToString,
  parseStringToDate,
  isToday,
  getDaysBetween,
  addDays,
  formatDuration,
  formatRelativeTime,
  calculateStreak,
} from './dateHelper';

describe('formatDateToString', () => {
  it('formats a date to YYYY-MM-DD', () => {
    const date = new Date(2026, 0, 5); // Jan 5, 2026
    expect(formatDateToString(date)).toBe('2026-01-05');
  });

  it('pads single-digit months and days', () => {
    const date = new Date(2026, 10, 1); // Nov 1, 2026
    expect(formatDateToString(date)).toBe('2026-11-01');
  });
});

describe('parseStringToDate', () => {
  it('parses YYYY-MM-DD string to Date', () => {
    const date = parseStringToDate('2026-01-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(15);
  });
});

describe('getDaysBetween', () => {
  it('returns correct difference in days', () => {
    const d1 = new Date(2026, 0, 1);
    const d2 = new Date(2026, 0, 4);
    expect(getDaysBetween(d1, d2)).toBe(3);
  });

  it('returns negative for reversed dates', () => {
    const d1 = new Date(2026, 0, 4);
    const d2 = new Date(2026, 0, 1);
    expect(getDaysBetween(d1, d2)).toBe(-3);
  });

  it('returns 0 for same date', () => {
    const d = new Date(2026, 5, 15);
    expect(getDaysBetween(d, d)).toBe(0);
  });
});

describe('addDays', () => {
  it('adds positive days', () => {
    const date = new Date(2026, 0, 1);
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(6);
  });

  it('does not mutate original date', () => {
    const date = new Date(2026, 0, 1);
    addDays(date, 5);
    expect(date.getDate()).toBe(1);
  });
});

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(120)).toBe('2分钟');
    expect(formatDuration(300)).toBe('5分钟');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3660)).toBe('1小时1分钟');
    expect(formatDuration(7325)).toBe('2小时2分钟');
  });
});

describe('formatRelativeTime', () => {
  it('returns 今天 for today', () => {
    expect(formatRelativeTime(new Date())).toBe('今天');
  });

  it('returns 昨天 for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeTime(yesterday)).toBe('昨天');
  });

  it('returns N天前 for days within a week', () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    expect(formatRelativeTime(d)).toBe('3天前');
  });
});

describe('calculateStreak', () => {
  it('returns 0 for null', () => {
    expect(calculateStreak(null)).toBe(0);
  });

  it('returns 1 for today', () => {
    expect(calculateStreak(new Date())).toBe(1);
  });

  it('returns 1 for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(calculateStreak(yesterday)).toBe(1);
  });

  it('returns 0 for older dates', () => {
    const old = new Date();
    old.setDate(old.getDate() - 5);
    expect(calculateStreak(old)).toBe(0);
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});
