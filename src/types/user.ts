export interface User {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
  stats: {
    totalSubmissions: number;
    totalWins: number;
    totalScore: number;
    rank: number;
  };
  achievements: string[];
  points: number;
  favorites: string[];
  joinedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'contest' | 'quality' | 'community' | 'special';
  requirement: {
    type: 'submission' | 'win' | 'score' | 'vote' | '收藏';
    threshold: number;
  };
  points: number;
}
