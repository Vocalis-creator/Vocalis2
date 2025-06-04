import React from 'react';
import { Button } from '../components/Button';
import { TourCard } from '../components/TourCard';
import { ArrowLeftIcon, MapPinIcon } from 'lucide-react';
interface TourSelectionPageProps {
  onNavigate: (page: string) => void;
}
export const TourSelectionPage = ({
  onNavigate
}: TourSelectionPageProps) => {
  const handleChooseLocation = () => {
    onNavigate('tour-customization');
  };
  const recommendedTours = [{
    title: "Ancient Rome's Daily Life",
    description: 'Walk through the Roman Forum and discover how ancient Romans lived, worked, and socialized in the heart of the empire.',
    duration: '45 min',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000',
    category: 'Ancient Life'
  }, {
    title: 'Medieval Weapons & Warfare',
    description: 'Explore the evolution of medieval weaponry and battle tactics through this immersive castle tour.',
    duration: '30 min',
    imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1000',
    category: 'War & Weaponry'
  }, {
    title: 'Greek Gods & Legends',
    description: 'Journey through ancient temples and discover the fascinating stories of Greek mythology and its enduring influence.',
    duration: '35 min',
    imageUrl: 'https://images.unsplash.com/photo-1608037521244-f1c6c7635194?q=80&w=1000',
    category: 'Mythology'
  }];
  return <div className="min-h-screen bg-navy-900 pb-20 pt-16">
      {/* Background Map Decoration */}
      <div className="fixed inset-0 opacity-5 bg-cover bg-center pointer-events-none" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000')"
    }} />
      {/* Content */}
      <div className="relative">
        {/* Back Button */}
        <button onClick={() => onNavigate('home')} className="absolute top-20 left-6 text-gold-400 hover:text-gold-300">
          <ArrowLeftIcon size={24} />
        </button>
        {/* Header */}
        <div className="pt-10 px-6 text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">
            Begin Your Story
          </h1>
          <p className="text-gray-400">
            Choose a location or let us find one near you
          </p>
        </div>
        {/* Main Actions */}
        <div className="px-6 space-y-4 mb-12">
          <Button fullWidth className="py-4 text-lg bg-gold-500/90 backdrop-blur-sm" onClick={handleChooseLocation}>
            <MapPinIcon size={20} className="mr-2" />
            Find Tours Near Me
          </Button>
        </div>
        {/* Recommended Tours */}
        <div className="px-6">
          <h2 className="font-serif text-xl text-white mb-4">
            Recommended Tours
          </h2>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6">
            {recommendedTours.map((tour, index) => <TourCard key={index} {...tour} onPreview={() => {}} />)}
          </div>
        </div>
      </div>
    </div>;
};