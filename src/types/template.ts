export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  usageCount: number;
  favoriteCount: number;
  rating: number;
  createdAt: Date;
  source: 'challenge' | 'user' | 'admin';
}
