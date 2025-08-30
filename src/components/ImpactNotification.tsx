import React, { useEffect, useState } from 'react';
import { TrendingUp, Heart } from 'lucide-react';

interface ImpactNotificationProps {
  message: string;
}

const ImpactNotification: React.FC<ImpactNotificationProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`absolute top-32 left-4 right-4 z-50 transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Impact Update</h4>
            <p className="text-white/90 text-sm">{message}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-white/70 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ImpactNotification;