import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  getDueReviews,
  isReviewDueToday,
  getReviewPriority,
} from './reviewAlgorithm';
import type { UserProgress } from '@/types';

const baseProgress: UserProgress = {
  id: 'user_progress',
  currentLessonId: 1,
  currentGrammarPoint: '',
  learnedSentences: [],
  learnedGrammar: [],
  completedLessons: [],
  totalStudyTime: 0,
  studyStreak: 0,
  lastStudyDate: new Date(),
};

describe('calculateNextReview', () => {
  it('increases level when correct', () => {
    const result = calculateNextReview(2, true);
    expect(result.nextLevel).toBe(3);
  });

  it('decreases level when incorrect (min 1)', () => {
    const result = calculateNextReview(3, false);
    expect(result.nextLevel).toBe(2);
  });

  it('does not exceed level 5', () => {
    const result = calculateNextReview(5, true);
    expect(result.nextLevel).toBe(5);
  });

  it('does not go below level 1', () => {
    const result = calculateNextReview(1, false);
    expect(result.nextLevel).toBe(1);
  });

  it('sets next review date in the future', () => {
    const result = calculateNextReview(1, true);
    expect(result.nextReviewDate.getTime()).toBeGreaterThan(Date.now() - 1000);
  });

  it('interval matches REVIEW_INTERVALS for each level', () => {
    const intervals = [0, 1, 3, 7, 15, 30];
    for (let level = 1; level <= 5; level++) {
      const result = calculateNextReview(level, true);
      const nextLevel = Math.min(level + 1, 5);
      const daysDiff = Math.round(
        (result.nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(intervals[nextLevel]);
    }
  });
});

describe('getDueReviews', () => {
  it('returns grammar IDs with past review dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 2);

    const progress = {
      ...baseProgress,
      learnedGrammar: [
        { grammarId: 'gp1', firstLearnedDate: past, lastReviewedDate: past, nextReviewDate: past, reviewCount: 1, masteryLevel: 1 },
      ],
    };

    const due = getDueReviews(progress.learnedGrammar);
    expect(due).toContain('gp1');
  });

  it('excludes grammar with future review date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);

    const progress = {
      ...baseProgress,
      learnedGrammar: [
        { grammarId: 'gp2', firstLearnedDate: new Date(), lastReviewedDate: new Date(), nextReviewDate: future, reviewCount: 0, masteryLevel: 2 },
      ],
    };

    const due = getDueReviews(progress.learnedGrammar);
    expect(due).not.toContain('gp2');
  });

  it('returns empty array for empty learned grammar', () => {
    expect(getDueReviews([])).toEqual([]);
  });
});

describe('isReviewDueToday', () => {
  it('returns true when review date is today', () => {
    const grammar = [
      { grammarId: 'gp1', firstLearnedDate: new Date(), lastReviewedDate: new Date(), nextReviewDate: new Date(), reviewCount: 0, masteryLevel: 1 },
    ];
    expect(isReviewDueToday('gp1', grammar)).toBe(true);
  });

  it('returns false for non-existent grammar', () => {
    expect(isReviewDueToday('nonexistent', [])).toBe(false);
  });
});

describe('getReviewPriority', () => {
  it('returns 0 for non-existent grammar', () => {
    expect(getReviewPriority('nonexistent', [])).toBe(0);
  });

  it('returns higher priority for overdue items', () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);

    const grammar = [
      { grammarId: 'gp1', firstLearnedDate: past, lastReviewedDate: past, nextReviewDate: past, reviewCount: 1, masteryLevel: 1 },
    ];

    const priority = getReviewPriority('gp1', grammar);
    expect(priority).toBeGreaterThan(100);
  });
});
