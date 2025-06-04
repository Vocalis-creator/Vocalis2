import React, { useEffect } from 'react';
interface SplashScreenProps {
  onComplete: () => void;
}
export const SplashScreen = ({
  onComplete
}: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return <div className="fixed inset-0 bg-navy-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-5xl text-white mb-2">Vocalis</h1>
        <div className="w-16 h-1 bg-gold-500 mx-auto"></div>
      </div>
    </div>;
};