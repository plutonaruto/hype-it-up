import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Zap } from 'lucide-react';
import { VideoData } from '../types';
import ContextCard from './ContextCard';

interface VideoFeedProps {
  onCreateFundraiser: () => void;
  onBoost: (video: VideoData) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onCreateFundraiser, onBoost }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showContextCard, setShowContextCard] = useState(false);

  const mockVideos: VideoData[] = [
    {
      id: '1',
      creator: {
        username: 'helpinghand_rescue',
        avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: true
      },
      content: {
        title: 'Hurricane Relief Fundraiser',
        description: 'Help families rebuild after Hurricane Maria devastated our community. Every donation counts! #HurricaneRelief #MutualAid',
        videoUrl: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg',
        thumbnail: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg'
      },
      fundraiser: {
        goal: 50000,
        raised: 23400,
        cause: 'Disaster Relief',
        externalLink: 'https://gofundme.com/hurricane-relief',
        verified: true,
        aiSummary: 'Verified emergency relief campaign for hurricane victims with transparent fund allocation.',
        tier: 'gold'
      },
      engagement: {
        likes: 12400,
        comments: 856,
        shares: 1200,
        boosts: 890
      },
      impact: {
        reachIncrease: 340,
        donationsToday: 1200,
        totalReach: 45600,
        communityBoosts: 150
      }
    },
    {
      id: '2',
      creator: {
        username: 'local_food_bank',
        avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: true
      },
      content: {
        title: 'Community Food Drive',
        description: 'Feeding families in need this holiday season. Your support makes a difference! #FoodDrive #Community',
        videoUrl: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg',
        thumbnail: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg'
      },
      fundraiser: {
        goal: 15000,
        raised: 8900,
        cause: 'Food Security',
        verified: true,
        aiSummary: 'Legitimate food bank initiative with established track record and community partnerships.',
        tier: 'silver'
      },
      engagement: {
        likes: 8900,
        comments: 423,
        shares: 670,
        boosts: 445
      }
    },
    {
      id: '3',
      creator: {
        username: 'dance_moves_daily',
        avatar: 'https://images.pexels.com/photos/3853663/pexels-photo-3853663.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: false
      },
      content: {
        title: 'Latest Dance Challenge',
        description: 'New moves for the weekend! Who can do this? #DanceChallenge #Trending',
        videoUrl: 'https://images.pexels.com/photos/3692739/pexels-photo-3692739.jpeg',
        thumbnail: 'https://images.pexels.com/photos/3692739/pexels-photo-3692739.jpeg'
      },
      engagement: {
        likes: 5600,
        comments: 234,
        shares: 180,
        boosts: 0
      }
    }
  ];

  const currentVideo = mockVideos[currentVideoIndex];

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideoIndex < mockVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (direction === 'down' && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video Content */}
      <div className="absolute inset-0">
        <img 
          src={currentVideo.content.thumbnail}
          alt={currentVideo.content.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-12 left-0 right-0 z-40 flex justify-center">
        <div className="flex space-x-4 text-white text-lg font-semibold">
          <span className="opacity-60">Following</span>
          <span className="border-b-2 border-white pb-1">For You</span>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 z-40 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs">{currentVideo.engagement.likes.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs">{currentVideo.engagement.comments}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
            <Share className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs">{currentVideo.engagement.shares}</span>
        </div>

        {/* Boost Button - Only for verified fundraisers */}
        {currentVideo.fundraiser?.verified && (
          <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-1 cursor-pointer transform hover:scale-110 transition-transform"
              onClick={() => onBoost(currentVideo)}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs">{currentVideo.engagement.boosts}</span>
          </div>
        )}
        
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowContextCard(!showContextCard)}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="absolute bottom-24 left-4 right-20 z-40">
        <div className="flex items-center mb-3">
          <img 
            src={currentVideo.creator.avatar}
            alt={currentVideo.creator.username}
            className="w-12 h-12 rounded-full border-2 border-white mr-3"
          />
          <div>
            <div className="flex items-center">
              <span className="text-white font-semibold">{currentVideo.creator.username}</span>
              {currentVideo.creator.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full ml-2 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <span className="text-white/80 text-sm">{currentVideo.content.title}</span>
          </div>
        </div>
        
        <p className="text-white text-sm leading-relaxed mb-3">
          {currentVideo.content.description}
        </p>

        {/* Fundraiser Progress - Only for verified fundraisers */}
        {currentVideo.fundraiser?.verified && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-medium">Fundraiser Progress</span>
              <span className="text-green-400 text-sm">{currentVideo.fundraiser.tier.toUpperCase()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                style={{ width: `${(currentVideo.fundraiser.raised / currentVideo.fundraiser.goal) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-white text-xs">
              <span>${currentVideo.fundraiser.raised.toLocaleString()} raised</span>
              <span>Goal: ${currentVideo.fundraiser.goal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Context Card */}
      {showContextCard && currentVideo.fundraiser?.verified && (
        <ContextCard 
          fundraiser={currentVideo.fundraiser}
          impact={currentVideo.impact}
          onClose={() => setShowContextCard(false)}
        />
      )}

      {/* Creator Button */}
      <div className="absolute bottom-8 right-4 z-40">
        <button 
          onClick={onCreateFundraiser}
          className="w-14 h-8 bg-white rounded-lg flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-2">
          {mockVideos.map((_, index) => (
            <div 
              key={index}
              className={`w-1 h-8 rounded-full ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Swipe Area */}
      <div 
        className="absolute inset-0 z-30"
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchEnd = (endEvent: TouchEvent) => {
            const endY = endEvent.changedTouches[0].clientY;
            const diff = startY - endY;
            if (Math.abs(diff) > 50) {
              handleSwipe(diff > 0 ? 'up' : 'down');
            }
            document.removeEventListener('touchend', handleTouchEnd);
          };
          document.addEventListener('touchend', handleTouchEnd);
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          if (y < rect.height / 2) {
            handleSwipe('down');
          } else {
            handleSwipe('up');
          }
        }}
      ></div>
    </div>
  );
};

export default VideoFeed;