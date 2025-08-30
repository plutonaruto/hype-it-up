import { useState } from 'react';
import PhoneContainer from './components/PhoneContainer';
import VideoFeed from './components/VideoFeed';
import CreatorForm from './components/CreatorForm';
import VerificationStatus from './components/VerificationStatus';
import BoostModal from './components/BoostModal';
import ImpactNotification from './components/ImpactNotification';
import type { VideoData, VerificationResult } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'feed' | 'creator' | 'verification'>('feed');
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showImpactNotification, setShowImpactNotification] = useState(false);
  const [impactMessage, setImpactMessage] = useState('');

  const handleSubmitFundraiser = async (_formData: any) => {
    setCurrentView('verification');

    // Simulate AI verification process
    setTimeout(() => {
      const isApproved = Math.random() > 0.3; // 70% approval rate
      setVerificationResult({
        approved: isApproved,
        message: isApproved
          ? "Your fundraiser has been verified! AI analysis confirms legitimate cause and appropriate content."
          : "Verification incomplete. Please review submission guidelines and try again.",
        // Use undefined (not null) to satisfy string | undefined
        aiSummary: isApproved
          ? "Verified emergency relief campaign for hurricane victims with transparent fund allocation."
          : undefined,
      });
    }, 3000);
  };

  const handleBoost = (type: 'donate' | 'community', amount?: number) => {
    setShowBoostModal(false);

    // Use the params to avoid TS6133 and give better UX
    const tailored =
      type === 'donate'
        ? (amount
            ? `Your Paid Hype of ${amount} coins unlocked +${Math.floor(
                160 * (amount / 5)
              )} projected views.`
            : "Your Paid Hype boosted projected reach this hour.")
        : "Your Community Hype helped push this toward the next unlock window.";

    const messages = [
      tailored,
      "This campaign raised $1,200 today — enough for 400 meals. Thank you.",
      "Your support helped increase visibility by 150% in the last hour.",
      "Thanks to your boost, this fundraiser is trending in your area.",
    ];

    setImpactMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowImpactNotification(true);

    setTimeout(() => setShowImpactNotification(false), 4000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <PhoneContainer>
        {currentView === 'feed' && (
          <VideoFeed 
            onCreateFundraiser={() => setCurrentView('creator')}
            onBoost={(video) => {
              setSelectedVideo(video);
              setShowBoostModal(true);
            }}
          />
        )}
        
        {currentView === 'creator' && (
          <CreatorForm 
            onSubmit={handleSubmitFundraiser}
            onBack={() => setCurrentView('feed')}
          />
        )}
        
        {currentView === 'verification' && (
          <VerificationStatus 
            result={verificationResult}
            onBack={() => setCurrentView('feed')}
          />
        )}
        
        {showBoostModal && selectedVideo && (
          <BoostModal 
            video={selectedVideo}
            onClose={() => setShowBoostModal(false)}
            onBoost={handleBoost}
          />
        )}
        
        {showImpactNotification && (
          <ImpactNotification message={impactMessage} />
        )}
      </PhoneContainer>
    </div>
  );
}

export default App;