import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon, LoaderIcon, MapPinIcon, HelpCircleIcon } from 'lucide-react';
import { AudioTrack } from '../hooks/useAudioPlayer';
interface TourCustomizationPageProps {
  onNavigate: (page: string) => void;
  onStartTour?: (track: AudioTrack) => void;
  location?: string;
}
interface TooltipInfo {
  id: string | null;
  text: string;
  position: {
    x: number;
    y: number;
  };
}
export const TourCustomizationPage = ({
  onNavigate,
  onStartTour = () => {},
  location = 'Sistine Chapel'
}: TourCustomizationPageProps) => {
  const [duration, setDuration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [includeRoute, setIncludeRoute] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    id: null,
    text: '',
    position: {
      x: 0,
      y: 0
    }
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const topics = ["Michelangelo's Techniques", 'Biblical Narratives', 'Renaissance Art History', 'Architectural Details', 'Restoration History', 'Papal History', 'Symbolism & Hidden Messages', 'Contemporary Impact', 'Famous Visitors', 'Construction Timeline', 'Cultural Significance', 'Art Conservation'];
  const tooltipData = {
    location: 'Enter the specific location you want to learn about',
    duration: 'Set how long you want your audio tour to be',
    topics: "Select topics you're interested in learning about",
    route: 'If selected, tour will include guidance on where to walk'
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltip({
          id: null,
          text: '',
          position: {
            x: 0,
            y: 0
          }
        });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };
  const handleGenerateTour = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Start the audio tour directly instead of navigating to tour-playback
      onStartTour({
        title: `${location} Tour`,
        url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration: 240 // 4 minutes in seconds
      });
    }, 2000);
  };
  const showTooltip = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setTooltip({
      id,
      text: tooltipData[id as keyof typeof tooltipData] || '',
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    });
  };
  return <div className="min-h-screen bg-navy-900 pb-20 pt-10">
      <div className="relative px-6">
        {/* Back Button */}
        <button onClick={() => onNavigate('home')} className="text-gold-400 hover:text-gold-300 mb-6">
          <ArrowLeftIcon size={24} />
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">{location}</h1>
          <p className="text-gray-400">Customize your tour experience</p>
        </div>
        {/* Location Input */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <label className="block text-white">Location</label>
            <button className="ml-2 text-gold-400 hover:text-gold-300" onClick={e => showTooltip('location', e)}>
              <HelpCircleIcon size={16} />
            </button>
          </div>
          <div className="flex items-center">
            <input type="text" value={location} className="flex-1 bg-navy-700 text-white p-3 rounded-l-lg border border-navy-600 focus:outline-none focus:border-gold-400" placeholder="Enter a location" />
            <button className="bg-navy-700 p-3 rounded-r-lg border border-l-0 border-navy-600 text-gold-400">
              <MapPinIcon size={20} />
            </button>
          </div>
        </div>
        {/* Duration Slider */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <label className="block text-white">
              Tour Duration: {duration} minutes
            </label>
            <button className="ml-2 text-gold-400 hover:text-gold-300" onClick={e => showTooltip('duration', e)}>
              <HelpCircleIcon size={16} />
            </button>
          </div>
          <input type="range" min="15" max="120" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-gold-500" />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>15m</span>
            <span>2h</span>
          </div>
        </div>
        {/* Topics Selection */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-white">Tour Focus</h2>
            <button className="ml-2 text-gold-400 hover:text-gold-300" onClick={e => showTooltip('topics', e)}>
              <HelpCircleIcon size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map(topic => <button key={topic} onClick={() => toggleTopic(topic)} className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedTopics.includes(topic) ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'}`}>
                {topic}
              </button>)}
          </div>
        </div>
        {/* Include Route Checkbox */}
        <div className="flex items-center mb-8">
          <input type="checkbox" id="includeRoute" checked={includeRoute} onChange={() => setIncludeRoute(!includeRoute)} className="w-5 h-5 accent-gold-500 bg-navy-700 border-navy-600 rounded" />
          <label htmlFor="includeRoute" className="ml-2 text-white">
            Include route recommendation
          </label>
          <button className="ml-2 text-gold-400 hover:text-gold-300" onClick={e => showTooltip('route', e)}>
            <HelpCircleIcon size={16} />
          </button>
        </div>
        {/* Generate Button */}
        <Button fullWidth onClick={handleGenerateTour} disabled={isLoading} className="py-4">
          {isLoading ? <>
              <LoaderIcon size={20} className="animate-spin mr-2" />
              Generating Your Tour...
            </> : 'Generate Tour'}
        </Button>
        {/* Tooltip */}
        {tooltip.id && <div ref={tooltipRef} className="absolute bg-navy-700 border border-navy-600 p-3 rounded-md shadow-lg z-50 max-w-xs" style={{
        top: `${tooltip.position.y}px`,
        left: `${tooltip.position.x}px`,
        transform: 'translateY(-50%)'
      }}>
            <p className="text-white text-sm">{tooltip.text}</p>
          </div>}
      </div>
    </div>;
};