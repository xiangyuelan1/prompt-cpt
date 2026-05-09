export type ChallengeCategory = 'writing' | 'coding' | 'business' | 'creative';
export type ChallengeStatus = 'upcoming' | 'active' | 'ended';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  startTime: Date;
  endTime: Date;
  status: ChallengeStatus;
  requirements: string[];
  scoringCriteria: {
    clarity: number;
    creativity: number;
    practicality: number;
    communityVote: number;
  };
  participants: number;
  prize?: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  prompt: string;
  preview: string;
  scores: {
    aiScore: number;
    communityScore: number;
    totalScore: number;
  };
  votes: number;
  rank: number;
  submittedAt: Date;
  rankingHistory: Array<{
    rank: number;
    timestamp: Date;
  }>;
}
