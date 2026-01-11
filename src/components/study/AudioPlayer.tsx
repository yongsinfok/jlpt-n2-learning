/**
 * 音频播放器组件
 */

import { useAudio } from '@/hooks/useAudio';
import { Play, Pause, FastForward } from 'lucide-react';

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
 */
export function AudioPlayer({
  audioPath,
  showProgress = true,
  showPlaybackRate = true,
  className = '',
}: AudioPlayerProps) {
  const { isPlaying, duration, currentTime, toggle, setPlaybackRate } = useAudio(audioPath);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
          <span className="text-xs text-gray-500 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {/* 播放速度控制 */}
      {showPlaybackRate && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPlaybackRate(0.5)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="0.5x 速度"
          >
            0.5x
          </button>
          <button
            onClick={() => setPlaybackRate(1.0)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors font-medium"
            aria-label="1.0x 速度"
          >
            1.0x
          </button>
          <button
            onClick={() => setPlaybackRate(1.5)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="1.5x 速度"
          >
            1.5x
          </button>
          <button
            onClick={() => setPlaybackRate(2.0)}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
            aria-label="2.0x 速度"
          >
            2.0x
          </button>
        </div>
      )}
    </div>
  );
}
