import React from 'react';
interface InterestTagProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}
export const InterestTag = ({
  name,
  icon,
  isSelected,
  onClick
}: InterestTagProps) => {
  return <button className={`flex items-center space-x-2 rounded-full px-4 py-2 mr-2 mb-2 transition-all ${isSelected ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-gray-300 border border-navy-600 hover:bg-navy-600'}`} onClick={onClick}>
      <span className="text-lg">{icon}</span>
      <span>{name}</span>
    </button>;
};