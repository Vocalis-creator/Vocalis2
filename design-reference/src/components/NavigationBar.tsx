import React from 'react';
import { HomeIcon, UserIcon } from 'lucide-react';
interface NavigationBarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}
export const NavigationBar = ({
  activePage,
  onNavigate
}: NavigationBarProps) => {
  const navItems = [{
    id: 'home',
    icon: HomeIcon,
    label: 'Home'
  }, {
    id: 'profile',
    icon: UserIcon,
    label: 'Profile'
  }];
  return <div className="fixed top-0 left-0 right-0 bg-navy-800 border-b border-navy-600 px-4 py-0.5 z-40">
      <div className="flex justify-around items-center">
        {navItems.map(item => {
        const isActive = activePage === item.id;
        const Icon = item.icon;
        return <button key={item.id} className={`flex flex-col items-center py-1.5 px-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} onClick={() => onNavigate(item.id)}>
              <Icon size={20} className={`mb-0.5 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
              <span className="text-xs">{item.label}</span>
            </button>;
      })}
      </div>
    </div>;
};