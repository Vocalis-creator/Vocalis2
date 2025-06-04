import React from 'react';
import { PlayIcon, PauseIcon, XIcon, RewindIcon, FastForwardIcon, MinimizeIcon } from 'lucide-react';
import { AudioTranscript } from './AudioTranscript';
import { AudioInteractions } from './AudioInteractions';
interface FullscreenAudioPlayerProps {
  title: string;
  isPlaying: boolean;
  currentTime: string;
  duration: string;
  progress: number;
  onClose: () => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}
export const FullscreenAudioPlayer = ({
  title,
  isPlaying,
  currentTime,
  duration,
  progress,
  onClose,
  onPlayPause,
  onSeek
}: FullscreenAudioPlayerProps) => {
  // Mock transcript data - in real app, this would come from props
  const transcript = ['Welcome to the Sistine Chapel tour.', "Let's begin by looking at the ceiling, Michelangelo's masterpiece.", 'The central panels depict scenes from the Book of Genesis.', "Notice the famous 'Creation of Adam' panel in the center."];
  return <div className="fixed inset-0 bg-navy-900 z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-navy-600">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <MinimizeIcon size={24} />
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AudioTranscript transcript={transcript} currentLineIndex={Math.floor(progress / 25)} // Mock progress
      />
        <AudioInteractions onAskQuestion={() => console.log('Ask question')} onChangeTopic={() => console.log('Change topic')} onDoubleClick={() => console.log('Double click')} />
      </div>
      {/* Controls */}
      <div className="border-t border-navy-600 bg-navy-800 p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-navy-600 rounded-full cursor-pointer" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percentage = (e.clientX - rect.left) / rect.width * 100;
          onSeek(Math.max(0, Math.min(100, percentage)));
        }}>
            <div className="h-full bg-gold-500 rounded-full transition-all duration-150" style={{
            width: `${progress}%`
          }} />
          </div>
          {/* Time */}
          <div className="w-full flex justify-between text-sm text-gray-400">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
          {/* Playback Controls */}
          <div className="flex items-center space-x-8">
            <button className="text-gray-400 hover:text-white" onClick={() => {
            const newProgress = Math.max(0, progress - 15);
            onSeek(newProgress);
          }}>
              <RewindIcon size={32} />
            </button>
            <button className="w-16 h-16 flex items-center justify-center rounded-full bg-gold-500 text-navy-900 hover:bg-gold-600" onClick={onPlayPause}>
              {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
            </button>
            <button className="text-gray-400 hover:text-white" onClick={() => {
            const newProgress = Math.min(100, progress + 15);
            onSeek(newProgress);
          }}>
              <FastForwardIcon size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>;
};