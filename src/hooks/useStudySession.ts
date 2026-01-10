/**
 * 学习会话 Hook
 * 用于跟踪一次学习会话的状态
 */

import { useState, useCallback, useRef } from 'react';
import { useProgress } from './useProgress';

export interface StudySessionOptions {
  /** 自动记录时长 */
  autoTrack?: boolean;
  /** 会话结束回调 */
  onSessionEnd?: (duration: number, sentencesLearned: number) => void;
}

/**
 * 学习会话 Hook
 */
export function useStudySession(options: StudySessionOptions = {}) {
  const { autoTrack = true, onSessionEnd } = options;
  const { addStudyTime, updateStudyStreak } = useProgress();

  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionSentences, setSessionSentences] = useState<Set<string>>(new Set());

  const intervalRef = useRef<number | null>(null);

  /**
   * 开始学习会话
   */
  const startSession = useCallback(() => {
    setIsActive(true);
    setStartTime(Date.now());
    setSessionSentences(new Set());

    // 自动记录时长
    if (autoTrack) {
      intervalRef.current = window.setInterval(() => {
        if (startTime) {
          addStudyTime(1); // 每秒增加1秒
        }
      }, 1000);
    }
  }, [autoTrack, startTime, addStudyTime]);

  /**
   * 结束学习会话
   */
  const endSession = useCallback(async () => {
    if (!startTime) return 0;

    const duration = Math.floor((Date.now() - startTime) / 1000);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 更新连续学习天数
    await updateStudyStreak(1);

    setIsActive(false);
    setStartTime(null);

    onSessionEnd?.(duration, sessionSentences.size);

    return duration;
  }, [startTime, sessionSentences.size, addStudyTime, updateStudyStreak, onSessionEnd]);

  /**
   * 记录学习的例句
   */
  const trackSentence = useCallback((sentenceId: string) => {
    setSessionSentences(prev => new Set(prev).add(sentenceId));
  }, []);

  /**
   * 获取会话统计
   */
  const getSessionStats = useCallback(() => {
    if (!startTime) return { duration: 0, sentencesCount: 0 };

    return {
      duration: Math.floor((Date.now() - startTime) / 1000),
      sentencesCount: sessionSentences.size,
    };
  }, [startTime, sessionSentences.size]);

  /**
   * 获取会话时长（秒）
   */
  const getDuration = useCallback(() => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  return {
    isActive,
    startTime,
    startSession,
    endSession,
    trackSentence,
    getSessionStats,
    getDuration,
    sessionSentencesCount: sessionSentences.size,
  };
}
