export interface VideoData {
  id: string;
  creator: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
  };
  fundraiser?: {
    goal: number;
    raised: number;
    cause: string;
    externalLink?: string;
    verified: boolean;
    aiSummary?: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    boosts: number;
  };
  impact?: {
    reachIncrease: number;
    donationsToday: number;
    totalReach: number;
    communityBoosts: number;
  };
}

export interface VerificationResult {
  approved: boolean;
  message: string;
  aiSummary?: string;
}

export interface BoostOption {
  type: 'donate' | 'community';
  title: string;
  description: string;
  icon: string;
  action: string;
}