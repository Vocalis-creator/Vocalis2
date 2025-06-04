import React from 'react';
import { ArrowLeftIcon, PlayIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioTrack } from '../hooks/useAudioPlayer';
interface TourPlaybackPageProps {
  onNavigate: (page: string) => void;
  onStartTour: (track: AudioTrack) => void;
  location?: string;
}
export const TourPlaybackPage = ({
  onNavigate,
  onStartTour,
  location = 'Sistine Chapel'
}: TourPlaybackPageProps) => {
  const handleStartTour = () => {
    onStartTour({
      title: `${location} Tour`,
      url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
      duration: 240 // 4 minutes in seconds
    });
  };
  return <div className="min-h-screen bg-navy-900 pb-20 pt-6">
      <div className="relative px-6">
        {/* Back Button */}
        <button onClick={() => onNavigate('tour-customization')} className="text-gold-400 hover:text-gold-300 mb-6">
          <ArrowLeftIcon size={24} />
        </button>
        {/* Content */}
        <div className="text-center">
          <h1 className="font-serif text-3xl text-white mb-2">{location}</h1>
          <p className="text-gray-400">Your personalized audio guide</p>
        </div>
        {/* Tour Content Preview */}
        <div className="mt-8 p-6 bg-navy-800 rounded-lg border border-navy-600">
          <h2 className="text-white font-medium mb-4">Tour Overview</h2>
          <div className="space-y-4 text-gray-400">
            <p>1. Introduction to the Sistine Chapel</p>
            <p>2. Michelangelo's Ceiling Masterpiece</p>
            <p>3. The Last Judgment</p>
            <p>4. Hidden Symbols and Messages</p>
            <p>5. Modern Conservation Efforts</p>
          </div>
        </div>
        {/* Start Tour Button */}
        <div className="mt-8">
          <Button fullWidth onClick={handleStartTour} className="py-4">
            <PlayIcon size={20} className="mr-2" />
            Begin Audio Tour
          </Button>
        </div>
      </div>
    </div>;
};