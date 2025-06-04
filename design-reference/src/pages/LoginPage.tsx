import React from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon } from 'lucide-react';
interface LoginPageProps {
  onNavigate: (page: string) => void;
}
export const LoginPage = ({
  onNavigate
}: LoginPageProps) => {
  return <div className="flex flex-col min-h-screen bg-navy-900 px-6">
      {/* Back Button */}
      <button onClick={() => onNavigate('profile')} className="absolute top-6 left-6 text-gold-400 hover:text-gold-300 z-10">
        <ArrowLeftIcon size={24} />
      </button>
      <div className="flex-1 flex flex-col justify-center items-center text-center pb-16">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">Vocalis</h1>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-4"></div>
          <p className="text-gold-300 italic">Your story begins here</p>
        </div>
        <div className="w-full max-w-xs space-y-4 mt-8">
          <Button fullWidth onClick={() => {
          onNavigate('interests');
        }}>
            Sign Up
          </Button>
          <Button variant="secondary" fullWidth onClick={() => {
          onNavigate('interests');
        }}>
            Log In
          </Button>
          <div className="mt-6 text-center">
            <button className="text-gray-400 text-sm hover:text-gold-300 p-2" onClick={() => onNavigate('interests')}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-navy-900/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560258730-dd11f2bb5905?q=80&w=1000')] bg-cover bg-center opacity-10" />
    </div>;
};