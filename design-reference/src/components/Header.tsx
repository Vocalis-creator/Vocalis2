import React from 'react';
import { UserIcon } from 'lucide-react';
interface HeaderProps {
  onNavigate: (page: string) => void;
}
export const Header = ({
  onNavigate
}: HeaderProps) => {
  return <div className="absolute top-0 right-0 p-4 z-40">
      <button onClick={() => onNavigate('login')} className="w-10 h-10 flex items-center justify-center rounded-full bg-navy-800 text-gold-400 hover:bg-navy-700 border border-navy-600">
        <UserIcon size={20} />
      </button>
    </div>;
};