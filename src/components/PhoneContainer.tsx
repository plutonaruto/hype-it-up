import React from 'react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-gray-300/10">
        {/* Screen */}
        <div className="bg-black rounded-[2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 text-white text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-xs">9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm relative">
                <div className="absolute inset-0.5 bg-white rounded-sm w-4/5"></div>
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="w-[375px] h-[812px] bg-black relative overflow-hidden">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneContainer;