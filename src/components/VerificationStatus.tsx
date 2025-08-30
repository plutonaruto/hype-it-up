import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Shield,
  Hash
} from 'lucide-react';
import type { VerificationResult } from '../types';

interface VerificationStatusProps {
  result: VerificationResult | null;
  onBack: () => void;
}

const ScoreBar = ({ label, value }: { label: string; value?: number }) => {
  if (value === undefined || value === null) return null;
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  const color =
    pct >= 75 ? 'from-green-500 to-emerald-400'
    : pct >= 50 ? 'from-yellow-500 to-amber-400'
    : 'from-red-500 to-rose-500';

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span className="text-white">{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const Pill = ({ children, color = 'gray' }: { children: React.ReactNode; color?: 'gray'|'green'|'red'|'blue'|'yellow' }) => {
  const map: Record<string, string> = {
    gray: 'bg-gray-800 text-gray-200 border-gray-700',
    green: 'bg-green-900/30 text-green-300 border-green-500/40',
    red: 'bg-red-900/30 text-red-300 border-red-500/40',
    blue: 'bg-blue-900/30 text-blue-300 border-blue-500/40',
    yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/40',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${map[color]}`}>
      {children}
    </span>
  );
};

const VerificationStatus: React.FC<VerificationStatusProps> = ({ result, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (result) setIsLoading(false); }, [result]);

  return (
    <div className="w-full h-full bg-black relative">
      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-40 flex items-center justify-between px-4 py-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">AI Verification</h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="absolute top-28 left-0 right-0 bottom-0 px-4 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 animate-pulse" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">Verifying Your Fundraiser</h2>
            <p className="text-gray-300 text-center max-w-sm">
              Our AI is analyzing your content to ensure authenticity and compliance with community guidelines.
            </p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <p className="text-gray-400 text-sm">This usually takes a moment</p>
            </div>
          </div>
        ) : result?.approved ? (
          // ---------- SUCCESS ----------
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-white text-2xl font-bold mb-2">Verification Successful</h2>

            {'verificationTier' in result && (
              <div className="mb-4">
                <Pill color="green">
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  {result.verificationTier}
                </Pill>
              </div>
            )}

            <p className="text-gray-300 mb-6">{result.message}</p>

            {result.aiSummary && (
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-4 text-left">
                <h3 className="text-green-400 font-semibold mb-2">AI Summary</h3>
                <p className="text-green-100 text-sm">{result.aiSummary}</p>
              </div>
            )}

            {'hashtags' in result && result.hashtags?.length > 0 && (
              <div className="mb-4 text-left">
                <h4 className="text-white font-semibold mb-2">Suggested Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((t, i) => (
                    <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200 border border-gray-700">
                      <Hash className="w-3 h-3" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-white font-semibold mb-3">Scores</h4>
              <ScoreBar label="Consistency" value={result.scores?.consistency} />
              <ScoreBar label="Reliability" value={result.scores?.reliability} />
            </div>

            {Array.isArray(result.reasons) && result.reasons.length > 0 && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6 text-left">
                <h4 className="text-yellow-300 font-semibold mb-2">Notes</h4>
                <ul className="list-disc list-inside text-yellow-100 text-sm space-y-1">
                  {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
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
          </div>
        ) : (
          // ---------- FAILURE ----------
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8 mx-auto">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-white text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-300 mb-4">{result?.message}</p>

            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4 text-left">
              <h3 className="text-red-300 font-semibold mb-2">Why it failed</h3>
              <ul className="list-disc list-inside text-red-100 text-sm space-y-1">
                {Array.isArray(result?.reasons) && result!.reasons.length > 0 ? (
                  result!.reasons.map((r, i) => <li key={i}>{r}</li>)
                ) : (
                  <li>AI did not provide detailed reasons.</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 mb-6 text-left">
              <div className="mb-2">
                <Pill color="yellow">
                  Step: {('step' in (result || {})) ? (result as any).step : 'unknown'}
                </Pill>
              </div>
              <ScoreBar label="Consistency" value={result?.scores?.consistency} />
              <ScoreBar label="Reliability" value={result?.scores?.reliability} />
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
                Edit Submission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
