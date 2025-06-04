import React, { useState } from 'react';
import { PlayIcon, PauseIcon, XIcon, ExpandIcon } from 'lucide-react';
import { FullscreenAudioPlayer } from './FullscreenAudioPlayer';
interface AudioPlayerProps {
  title: string;
  isPlaying: boolean;
  currentTime: string;
  duration: string;
  progress: number;
  onClose: () => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}
export const AudioPlayer = ({
  title,
  isPlaying,
  currentTime,
  duration,
  progress,
  onClose,
  onPlayPause,
  onSeek
}: AudioPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    onSeek(percent * 100);
  };
  if (isFullscreen) {
    return <FullscreenAudioPlayer title={title} isPlaying={isPlaying} currentTime={currentTime} duration={duration} progress={progress} onClose={() => setIsFullscreen(false)} onPlayPause={onPlayPause} onSeek={onSeek} />;
  }
  return <div className="fixed bottom-0 left-0 right-0 bg-navy-800 border-t border-navy-600 p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-white font-medium truncate pr-4">{title}</h4>
          <div className="text-gray-400 text-sm">
            {currentTime} / {duration}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gold-500 text-navy-900 hover:bg-gold-600" onClick={onPlayPause}>
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
          <button onClick={() => setIsFullscreen(true)} className="text-gray-400 hover:text-white">
            <ExpandIcon size={20} />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>
      </div>
      <div className="mt-3 h-1 bg-navy-600 rounded-full cursor-pointer" onClick={handleProgressClick}>
        <div className="h-full bg-gold-500 rounded-full transition-all duration-150" style={{
        width: `${progress}%`
      }} />
      </div>
    </div>;
};