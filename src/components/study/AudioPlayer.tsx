/**
 * 音频播放器组件 - 优化版本
 * 使用 React.memo 避免不必要的重渲染
 */

import { memo, useMemo } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { Play, Pause } from 'lucide-react';

export interface AudioPlayerProps {
  /** 音频文件路径 */
  audioPath: string;
  /** 是否显示进度条 */
  showProgress?: boolean;
  /** 是否显示播放速度控制 */
  showPlaybackRate?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 音频播放器组件
 * 使用 memo 优化，避免音频路径不变时重渲染
 */
export const AudioPlayer = memo(function AudioPlayer({
  audioPath,
  showProgress = true,
  showPlaybackRate = true,
  className = '',
}: AudioPlayerProps) {
  const { isPlaying, duration, currentTime, toggle, setPlaybackRate } = useAudio(audioPath);

  // 缓存进度计算
  const progress = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [duration, currentTime]);

  // 缓存时间格式化函数
  const formatTime = useMemo(() => {
    return (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
  }, []);

  // 缓存播放速度设置函数
  const handleSetPlaybackRate = useMemo(() => {
    return (rate: number) => () => setPlaybackRate(rate);
  }, [setPlaybackRate]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 播放/暂停按钮 */}
      <button
        onClick={toggle}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
        aria-label={isPlaying ? '暂停' : '播放'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {/* 进度条 */}
      {showProgress && (
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-gray-500 w-10 text-right" aria-live="off">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-primary h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10" aria-live="off">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {/* 播放速度控制 */}
      {showPlaybackRate && (
        <div className="flex items-center gap-1" role="group" aria-label="播放速度">
          <button
            onClick={handleSetPlaybackRate(0.5)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="0.5x 速度"
          >
            0.5x
          </button>
          <button
            onClick={handleSetPlaybackRate(1.0)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors font-medium"
            aria-label="1.0x 速度"
          >
            1.0x
          </button>
          <button
            onClick={handleSetPlaybackRate(1.5)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="1.5x 速度"
          >
            1.5x
          </button>
          <button
            onClick={handleSetPlaybackRate(2.0)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="2.0x 速度"
          >
            2.0x
          </button>
        </div>
      )}
    </div>
  );
});
