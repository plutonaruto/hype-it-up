import React, { useState } from 'react';
import { X, Shield, ExternalLink, BarChart3, Users, Zap, DollarSign } from 'lucide-react';
import type { VideoData } from '../types';

interface ContextCardProps {
  fundraiser: VideoData['fundraiser'];
  impact?: VideoData['impact'];
  onClose: () => void;
}

const ContextCard: React.FC<ContextCardProps> = ({ fundraiser, impact, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'ledger'>('overview');

  if (!fundraiser) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-gray-300 to-gray-100';
      case 'gold': return 'from-yellow-400 to-yellow-200';
      case 'silver': return 'from-gray-400 to-gray-200';
      default: return 'from-orange-600 to-orange-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      default: return '🥉';
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-sm max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-r ${getTierColor(fundraiser.hypeTier)} rounded-full flex items-center justify-center`}>
              <span className="text-xs">{getTierIcon(fundraiser.hypeTier)}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Verified Fundraiser</h3>
              <p className="text-gray-400 text-xs">{fundraiser.hypeTier.toUpperCase()} Tier</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'overview' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('impact')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'impact' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            Impact
          </button>
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'ledger' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
            }`}
          >
            Ledger
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">AI Verified</span>
              </div>
              
              {fundraiser.aiSummary && (
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <h4 className="text-white font-semibold mb-2">AI Analysis</h4>
                  <p className="text-gray-300 text-sm">{fundraiser.aiSummary}</p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Progress</span>
                    <span className="text-white text-sm">{Math.round((fundraiser.raised / fundraiser.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(fundraiser.raised / fundraiser.goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">${fundraiser.raised.toLocaleString()} raised</span>
                    <span className="text-gray-400">Goal: ${fundraiser.goal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium mb-1">Cause: {fundraiser.cause}</p>
                  <p className="text-blue-100 text-xs">Funds will be used for immediate relief and recovery efforts.</p>
                </div>
              </div>

              {fundraiser.externalLink && (
                <button 
                  onClick={() => window.open(fundraiser.externalLink, '_blank')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Donate Externally
                </button>
              )}
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Live Impact Counters</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <BarChart3 className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="text-white text-lg font-bold">{impact?.reachIncrease || 0}%</p>
                  <p className="text-gray-400 text-xs">Reach Boost</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-white text-lg font-bold">${impact?.donationsToday || 0}</p>
                  <p className="text-gray-400 text-xs">Today's Donations</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-lg font-bold">{impact?.totalReach?.toLocaleString() || '0'}</p>
                  <p className="text-gray-400 text-xs">Total Reach</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white text-lg font-bold">{Math.floor((impact?.donationsToday || 0) / 3)}</p>
                  <p className="text-gray-400 text-xs">Meals Funded</p>
                </div>
              </div>

              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                <h4 className="text-green-400 font-semibold mb-2">Milestone Achieved!</h4>
                <p className="text-green-100 text-sm">
                  This campaign reached 1,000 community boosts and unlocked trending status for 24 hours.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Hype Events Ledger</h4>
              
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">Paid Boost</span>
                    <span className="text-green-400 text-sm">$25.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">+5,000 reach delivered</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">Community Milestone</span>
                    <span className="text-purple-400 text-sm">Free</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">+10,000 reach unlocked</span>
                    <span className="text-gray-400">4 hours ago</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">Paid Boost</span>
                    <span className="text-green-400 text-sm">$10.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">+2,000 reach delivered</span>
                    <span className="text-gray-400">6 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Credits Spent:</span>
                    <span className="text-green-400">$35.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Community Boosts:</span>
                    <span className="text-purple-400">{impact?.communityBoosts ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Extra Reach:</span>
                    <span className="text-blue-400">17,000 people</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextCard;