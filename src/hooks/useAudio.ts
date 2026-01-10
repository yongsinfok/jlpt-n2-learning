/**
 * 音频播放 Hook
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseAudioOptions {
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 播放速率 */
  playbackRate?: number;
  /** 播放结束回调 */
  onEnded?: () => void;
}

export interface UseAudioReturn {
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 音频时长（秒） */
  duration: number;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 播放 */
  play: () => void;
  /** 暂停 */
  pause: () => void;
  /** 切换播放/暂停 */
  toggle: () => void;
  /** 跳转到指定时间 */
  seek: (time: number) => void;
  /** 设置播放速率 */
  setPlaybackRate: (rate: number) => void;
}

/**
 * 音频播放 Hook
 * @param audioPath 音频文件路径
 * @param options 配置选项
 */
export function useAudio(
  audioPath: string,
  options: UseAudioOptions = {}
): UseAudioReturn {
  const { autoPlay = false, playbackRate = 1.0, onEnded } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频元素
  useEffect(() => {
    if (!audioPath) return;

    const audio = new Audio(audioPath);
    audio.playbackRate = playbackRate;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audioRef.current = audio;

    // 自动播放
    if (autoPlay) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioPath, playbackRate, autoPlay, onEnded]);

  // 播放
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, []);

  // 暂停
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // 切换播放/暂停
  const toggle = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }
  }, [isPlaying, play, pause]);

  // 跳转
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // 设置播放速率
  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  return {
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    seek,
    setPlaybackRate,
  };
}
