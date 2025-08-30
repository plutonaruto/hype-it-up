import React, { useState } from 'react';
import { X, Zap, Heart, DollarSign, Users, TrendingUp } from 'lucide-react';
import type { VideoData } from '../types';

interface BoostModalProps {
  video: VideoData;
  onClose: () => void;
  onBoost: (type: 'donate' | 'community', amount?: number) => void;
}

const BoostModal: React.FC<BoostModalProps> = ({ video, onClose, onBoost }) => {
  const [selectedTab, setSelectedTab] = useState<'info' | 'donate' | 'community'>('info');
  const [donationAmount, setDonationAmount] = useState(5);

  const donationOptions = [1, 5, 10, 25, 50, 100];

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
      <div className="bg-gray-900 rounded-t-3xl w-full max-h-[80%] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-bold">Boost This Fundraiser</h2>
          <button onClick={onClose} className="text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setSelectedTab('info')}
            className={`flex-1 py-3 text-sm font-medium ${
              selectedTab === 'info' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            About
          </button>
          <button 
            onClick={() => setSelectedTab('donate')}
            className={`flex-1 py-3 text-sm font-medium ${
              selectedTab === 'donate' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            Donate
          </button>
          <button 
            onClick={() => setSelectedTab('community')}
            className={`flex-1 py-3 text-sm font-medium ${
              selectedTab === 'community' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            Community
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {selectedTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">How Boosting Works</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Boost verified fundraisers to increase their reach and help them achieve their goals faster.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <p className="text-white text-sm font-medium">Monetary Donations</p>
                      <p className="text-gray-400 text-xs">Direct financial support that increases ad promotion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-white text-sm font-medium">Community Boost</p>
                      <p className="text-gray-400 text-xs">Free support that unlocks reach milestones</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Current Impact</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-white text-lg font-bold">{video.impact?.reachIncrease || 0}%</p>
                    <p className="text-gray-400 text-xs">Reach Increase</p>
                  </div>
                  <div>
                    <p className="text-white text-lg font-bold">{video.impact?.totalReach?.toLocaleString() || '0'}</p>
                    <p className="text-gray-400 text-xs">Total Reach</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'donate' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white text-lg font-bold mb-2">Support with Coins</h3>
                <p className="text-gray-300 text-sm">
                  Your donation directly funds ad promotion to increase reach
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {donationOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      donationAmount === amount
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <DollarSign className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                    <span className="text-white text-sm font-semibold">${amount}</span>
                  </button>
                ))}
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">Impact Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated reach boost:</span>
                    <span className="text-green-400">+{donationAmount * 200} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Promotion duration:</span>
                    <span className="text-blue-400">{Math.ceil(donationAmount / 2)} hours</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onBoost('donate', donationAmount)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center"
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate ${donationAmount}
              </button>
            </div>
          )}

          {selectedTab === 'community' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-white text-lg font-bold mb-2">Community Boost</h3>
                <p className="text-gray-300 text-sm">
                  Free support that helps unlock reach milestones for the campaign
                </p>
              </div>

              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3">Next Milestone</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">Community Boosts</span>
                    <span className="text-purple-400 font-semibold">{video.engagement.boosts}/1000</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${(video.engagement.boosts / 1000) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {1000 - video.engagement.boosts} more boosts needed to unlock 24h trending boost
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Your Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Increases algorithm priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Helps reach milestone rewards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Shows community support</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onBoost('community')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Boost for Free
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoostModal;