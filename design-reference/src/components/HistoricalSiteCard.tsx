import React from 'react';
interface HistoricalSiteProps {
  title: string;
  distance: string;
  duration: string;
  imageUrl: string;
  rating: number;
}
export const HistoricalSiteCard = ({
  title,
  distance,
  duration,
  imageUrl,
  rating
}: HistoricalSiteProps) => {
  return <div className="rounded-lg overflow-hidden bg-navy-800 border border-navy-600 mb-4">
      <div className="h-36 bg-cover bg-center" style={{
      backgroundImage: `url(${imageUrl})`
    }} />
      <div className="p-4">
        <h3 className="font-serif text-lg text-white mb-1">{title}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span>{distance}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <div className="text-gold-400">★</div>
            <span className="ml-1 text-sm text-gray-300">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>;
};