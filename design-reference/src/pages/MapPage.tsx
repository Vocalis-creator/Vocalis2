import React from 'react';
import { Header } from '../components/Header';
interface MapPageProps {
  onNavigate?: (page: string) => void;
}
export const MapPage = ({
  onNavigate = () => {}
}: MapPageProps) => {
  return <div className="flex flex-col items-center justify-center min-h-screen bg-navy-900 px-6">
      <Header onNavigate={onNavigate} />
      <h2 className="font-serif text-2xl text-gold-400 mb-4">Map</h2>
      <p className="text-gray-300 text-center">
        The map view would display historical sites around the user's location.
      </p>
    </div>;
};