import React from 'react';
import { Header } from '../components/Header';
interface SearchPageProps {
  onNavigate?: (page: string) => void;
}
export const SearchPage = ({
  onNavigate = () => {}
}: SearchPageProps) => {
  return <div className="flex flex-col items-center justify-center min-h-screen bg-navy-900 px-6">
      <Header onNavigate={onNavigate} />
      <h2 className="font-serif text-2xl text-gold-400 mb-4">Search</h2>
      <p className="text-gray-300 text-center">
        The search page would allow users to find specific historical tours and
        content.
      </p>
    </div>;
};