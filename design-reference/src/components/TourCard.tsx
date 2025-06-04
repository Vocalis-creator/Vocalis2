import React from 'react';
import { Button } from './Button';
import { ClockIcon } from 'lucide-react';
interface TourCardProps {
  title: string;
  description: string;
  duration: string;
  imageUrl: string;
  category: string;
  onPreview: () => void;
}
export const TourCard = ({
  title,
  description,
  duration,
  imageUrl,
  category,
  onPreview
}: TourCardProps) => {
  return <div className="flex-shrink-0 w-[280px] bg-navy-800 rounded-lg overflow-hidden border border-navy-600 mr-4">
      <div className="h-32 bg-cover bg-center" style={{
      backgroundImage: `url(${imageUrl})`
    }} />
      <div className="p-4">
        <div className="text-gold-400 text-xs mb-1">{category}</div>
        <h3 className="font-serif text-white text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm">
            <ClockIcon size={14} className="mr-1" />
            {duration}
          </div>
          <Button variant="secondary" onClick={onPreview}>
            Preview
          </Button>
        </div>
      </div>
    </div>;
};