// src/components/VideoFeed.tsx
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
        avatar:
          'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: true
      },
      content: {
        title: 'Hurricane Relief Fundraiser',
        description:
          'Help families rebuild after Hurricane Maria devastated our community. Every donation counts! #HurricaneRelief #MutualAid',
        videoUrl: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg',
        thumbnail: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg'
      },
      fundraiser: {
        goal: 50000,
        raised: 23400,
        cause: 'Disaster Relief',
        externalLink: 'https://gofundme.com/hurricane-relief',
        verified: true,
        aiSummary:
          'Verified emergency relief campaign for hurricane victims with transparent fund allocation.',
        hypeTier: 'gold'
      },
      engagement: { likes: 12400, comments: 856, shares: 1200, boosts: 890 },
      impact: { reachIncrease: 340, donationsToday: 1200, totalReach: 45600, communityBoosts: 150 }
    },
    {
      id: '2',
      creator: {
        username: 'local_food_bank',
        avatar:
          'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: true
      },
      content: {
        title: 'Community Food Drive',
        description:
          'Feeding families in need this holiday season. Your support makes a difference! #FoodDrive #Community',
        videoUrl: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg',
        thumbnail: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg'
      },
      fundraiser: {
        goal: 15000,
        raised: 8900,
        cause: 'Food Security',
        verified: true,
        aiSummary:
          'Legitimate food bank initiative with established track record and community partnerships.',
        hypeTier: 'silver'
      },
      engagement: { likes: 8900, comments: 423, shares: 670, boosts: 445 }
    },
    {
      id: '3',
      creator: {
        username: 'dance_moves_daily',
        avatar:
          'https://images.pexels.com/photos/3853663/pexels-photo-3853663.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        verified: false
      },
      content: {
        title: 'Latest Dance Challenge',
        description: 'New moves for the weekend! Who can do this? #DanceChallenge #Trending',
        videoUrl: 'https://images.pexels.com/photos/3692739/pexels-photo-3692739.jpeg',
        thumbnail: 'https://images.pexels.com/photos/3692739/pexels-photo-3692739.jpeg'
      },
      engagement: { likes: 5600, comments: 234, shares: 180, boosts: 0 }
    }
  ];

  const currentVideo = mockVideos[currentVideoIndex];

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideoIndex < mockVideos.length - 1) {
      setCurrentVideoIndex((i) => i + 1);
      setShowContextCard(false);
    } else if (direction === 'down' && currentVideoIndex > 0) {
      setCurrentVideoIndex((i) => i - 1);
      setShowContextCard(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video Content */}
      <div className="absolute inset-0">
        <img
          src={currentVideo.content.thumbnail}
          alt={currentVideo.content.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-12 left-0 right-0 z-40 flex justify-center">
        <div className="flex space-x-4 text-lg font-semibold text-white">
          <span className="opacity-60">Following</span>
          <span className="border-b-2 border-white pb-1">For You</span>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute bottom-24 right-4 z-40 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-white">{currentVideo.engagement.likes.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-white">{currentVideo.engagement.comments}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Share className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-white">{currentVideo.engagement.shares}</span>
        </div>

        {/* Boost Button - only for verified fundraisers */}
        {currentVideo.fundraiser?.verified && (
          <div className="flex flex-col items-center">
            <div
              className="mb-1 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-transform hover:scale-110"
              onClick={() => onBoost(currentVideo)}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">{currentVideo.engagement.boosts}</span>
          </div>
        )}

        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={() => setShowContextCard((s) => !s)}
        >
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <MoreHorizontal className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="absolute bottom-24 left-4 right-20 z-40">
        <div className="mb-3 flex items-center">
          <img
            src={currentVideo.creator.avatar}
            alt={currentVideo.creator.username}
            className="mr-3 h-12 w-12 rounded-full border-2 border-white"
          />
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-white">{currentVideo.creator.username}</span>
              {currentVideo.creator.verified && (
                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
            <span className="text-sm text-white/80">{currentVideo.content.title}</span>
          </div>
        </div>

        <p className="mb-3 text-sm leading-relaxed text-white">
          {currentVideo.content.description}
        </p>

        {/* Fundraiser Progress - only for verified fundraisers */}
        {currentVideo.fundraiser?.verified && (
          <div className="mb-3 rounded-lg bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Fundraiser Progress</span>
              <span className="text-sm text-green-400">{currentVideo.fundraiser.hypeTier.toUpperCase()}</span>
            </div>
            <div className="mb-2 h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{
                  width: `${(currentVideo.fundraiser.raised / currentVideo.fundraiser.goal) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white">
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
          className="flex h-8 w-14 items-center justify-center rounded-lg bg-white"
        >
          <Plus className="h-5 w-5 text-black" />
        </button>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-2 top-1/2 z-40 -translate-y-1/2 transform">
        <div className="flex flex-col space-y-2">
          {mockVideos.map((_, index) => (
            <div
              key={index}
              className={`h-8 w-1 rounded-full ${index === currentVideoIndex ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Area */}
      <div
        className="absolute inset-0 z-30"
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const onEnd = (ev: TouchEvent) => {
            const endY = ev.changedTouches[0].clientY;
            const diff = startY - endY;
            if (Math.abs(diff) > 50) handleSwipe(diff > 0 ? 'up' : 'down');
          };
          window.addEventListener('touchend', onEnd, { once: true });
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          handleSwipe(y < rect.height / 2 ? 'down' : 'up');
        }}
      />
    </div>
  );
};

export default VideoFeed;
