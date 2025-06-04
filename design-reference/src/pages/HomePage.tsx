import React from 'react';
import { Button } from '../components/Button';
import { HistoricalSiteCard } from '../components/HistoricalSiteCard';
import { MapPinIcon, HeadphonesIcon } from 'lucide-react';
interface HomePageProps {
  username?: string;
  onNavigate?: (page: string) => void;
}
export const HomePage = ({
  username = 'Explorer',
  onNavigate = () => {}
}: HomePageProps) => {
  const nearbySites = [{
    title: 'Roman Forum Ruins',
    distance: '0.3 miles',
    duration: '45 min',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000',
    rating: 4.8
  }, {
    title: 'Medieval Castle Tour',
    distance: '1.2 miles',
    duration: '60 min',
    imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1000',
    rating: 4.6
  }, {
    title: 'Ancient Harbor Walk',
    distance: '0.8 miles',
    duration: '30 min',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000',
    rating: 4.3
  }];
  return <div className="min-h-screen bg-navy-900 pb-20 pt-16">
      {/* Header */}
      <div className="px-6 pt-4 pb-4">
        <h1 className="text-2xl text-white">Welcome, {username}</h1>
        <p className="text-gray-400 text-sm">Discover history around you</p>
      </div>
      {/* Start Tour Button */}
      <div className="px-6 mb-8">
        <Button fullWidth className="py-4 text-lg shadow-lg shadow-gold-500/10" onClick={() => onNavigate('tour-customization')} // Skip tour selection page
      >
          <HeadphonesIcon size={20} className="mr-2" />
          Start a Tour
        </Button>
      </div>
      {/* Nearby Sites */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white">Nearby Sites</h2>
          <div className="flex items-center text-gold-400 text-sm">
            <MapPinIcon size={16} className="mr-1" />
            <span>Current Location</span>
          </div>
        </div>
        {nearbySites.map((site, index) => <HistoricalSiteCard key={index} title={site.title} distance={site.distance} duration={site.duration} imageUrl={site.imageUrl} rating={site.rating} />)}
      </div>
    </div>;
};