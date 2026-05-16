import { memo } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { Play, Pause } from 'lucide-react';

export interface AudioPlayerProps {
  audioPath: string;
  showProgress?: boolean;
  showPlaybackRate?: boolean;
  className?: string;
}

const PLAYBACK_RATES = [0.5, 1.0, 1.5, 2.0] as const;

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const AudioPlayer = memo(function AudioPlayer({
  audioPath,
  showProgress = true,
  showPlaybackRate = true,
  className = '',
}: AudioPlayerProps) {
  const { isPlaying, duration, currentTime, toggle, setPlaybackRate } = useAudio(audioPath);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={toggle}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
        aria-label={isPlaying ? '暂停' : '播放'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {showProgress && (
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-ink-mute w-10 text-right" aria-live="off">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 bg-surface-dim rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-accent h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-ink-mute w-10" aria-live="off">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {showPlaybackRate && (
        <div className="flex items-center gap-1" role="group" aria-label="播放速度">
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-2 py-1 text-xs rounded hover:bg-surface-hover transition-colors ${rate === 1.0 ? 'font-medium text-accent' : 'text-ink-mute'}`}
              aria-label={`${rate}x 速度`}
            >
              {rate.toFixed(1)}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
