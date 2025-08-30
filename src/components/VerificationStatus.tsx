import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import type { VerificationResult } from '../types';

interface VerificationStatusProps {
  result: VerificationResult | null;
  onBack: () => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ result, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (result) {
      setIsLoading(false);
    }
  }, [result]);

  return (
    <div className="w-full h-full bg-black relative">
      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-40 flex items-center justify-between px-4 py-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">AI Verification</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="absolute top-28 left-0 right-0 bottom-0 px-4 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <h2 className="text-white text-2xl font-bold mb-4">Verifying Your Fundraiser</h2>
            <p className="text-gray-300 text-center max-w-sm">
              Our AI is analyzing your content to ensure authenticity and compliance with community guidelines.
            </p>
            
            <div className="mt-8 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-400 text-sm">This usually takes 2-3 minutes</p>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-sm">
            {result?.approved ? (
              <>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-white text-2xl font-bold mb-4">Verification Successful!</h2>
                <p className="text-gray-300 mb-6">{result.message}</p>
                
                {result.aiSummary && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-6">
                    <h3 className="text-green-400 font-semibold mb-2">AI Analysis</h3>
                    <p className="text-green-100 text-sm">{result.aiSummary}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button 
                    onClick={onBack}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold"
                  >
                    View Your Post
                  </button>
                  <p className="text-gray-400 text-xs">
                    Your fundraiser is now live with verification badge and boost features enabled.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-white text-2xl font-bold mb-4">Verification Failed</h2>
                <p className="text-gray-300 mb-6">{result?.message}</p>
                
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                  <h3 className="text-red-400 font-semibold mb-2">Common Issues</h3>
                  <ul className="text-red-100 text-sm space-y-1">
                    <li>• Insufficient documentation</li>
                    <li>• Unclear fundraising purpose</li>
                    <li>• Missing external verification</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Post as Regular Video
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;