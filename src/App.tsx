// src/App.tsx
import { useEffect, useState } from 'react';
import VideoFeed from './components/VideoFeed';
import CreatorScreen from './screens/CreatorScreen';
import BoostModal from './components/BoostModal';
import ImpactNotification from './components/ImpactNotification';
import type { VideoData } from './types';
import { prewarmModels, verifyClientSide } from './ai/localVerifier';

export default function App() {

  // useEffect(() => {
  //   (async () => {
  //     console.log('[SelfTest] prewarm start');
  //     await prewarmModels();
  //     console.log('[SelfTest] prewarm done');
  //     const out = await verifyClientSide({
  //       title: 'Emergency Vet Surgery for Mittens',
  //       description: 'Mittens needs urgent surgery after an accident. We are raising $2500.',
  //       goals: '$2500',
  //       category: 'medical',
  //       fundraiserUrl: 'https://www.gofundme.com/f/help-mittens',
  //     });
  //     console.log('[LOCAL VERIFIER SELFTEST]', out);
  //   })().catch(console.error);
  // }, []);

  useEffect(() => {
    const orig = window.fetch;
    window.fetch = async (...args) => {
      const [url, init] = args as [RequestInfo, RequestInit?];
      console.log('[FETCH]', url, init?.method || 'GET');
      const res = await orig(...args);
      console.log('[FETCH:RES]', url, res.status, res.headers.get('content-type'));
      return res;
    };
    return () => { window.fetch = orig; };
  }, []);

  useEffect (() => {
    prewarmModels();
  }, []);

  const [screen, setScreen] = useState<'home' | 'user' | 'creator'>('home');
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [showBoost, setShowBoost] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  const openBoost = (video: VideoData) => {
    setActiveVideo(video);
    setShowBoost(true);
  };

  const handleBoost = (type: 'donate' | 'community', amount?: number) => {
    setShowBoost(false);
    const reach = type === 'donate' ? Math.max(0, Math.round((amount ?? 0) * 200)) : 1000;
    const msg =
      type === 'donate'
        ? `Your Hype added +${reach} projected views.`
        : `Community support added +${reach} projected views.`;
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="relative w-[390px] h-[780px] sm:w-[420px] sm:h-[880px] rounded-[2rem] bg-black shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 z-50 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-black" />
        <div className="absolute inset-0">
          {screen === 'home' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
              <h1 className="mb-2 text-3xl font-bold text-white">Hype It Up</h1>
              <button
                onClick={() => setScreen('user')}
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
              >
                User
              </button>
              <button
                onClick={() => setScreen('creator')}
                className="rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white"
              >
                Creator
              </button>
            </div>
          )}

          {screen === 'user' && (
            <VideoFeed onCreateFundraiser={() => setScreen('creator')} onBoost={openBoost} />
          )}

          {screen === 'creator' && <CreatorScreen onClose={() => setScreen('home')} />}

          {showBoost && activeVideo && (
            <BoostModal
              video={activeVideo}
              onClose={() => setShowBoost(false)}
              onBoost={handleBoost}
            />
          )}

          {notif && <ImpactNotification message={notif} />}
        </div>
        <div className="absolute -left-1 top-24 h-24 w-1 rounded-r bg-white/10" />
        <div className="absolute -right-1 top-36 h-16 w-1 rounded-l bg-white/10" />
      </div>
    </div>
  );
}
