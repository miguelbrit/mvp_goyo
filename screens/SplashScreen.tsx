import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 bg-white dark:bg-teal-900 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="animate-fade-in mb-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Activity size={64} className="text-primary" />
        </div>
      </div>
      <h1 className="font-heading text-4xl font-bold text-secondary animate-slide-up">Dr. Goyo</h1>
      <p className="mt-3 text-primary font-medium text-sm tracking-widest uppercase animate-slide-up-delayed">Tu salud, simplificada</p>
    </div>
  );
};