export interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  requiredSkills: string[];
  prompt: string;
  referenceAnswer?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  stats: {
    likes: number;
    stars: number;
    attempts: number;
    averageScore: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  parentId?: string;
  childIds: string[];
  metadata: {
    estimatedTime: string;
    points: number;
    isOfficial: boolean;
    isFeatured: boolean;
  };
}

export interface Discussion {
  id: string;
  questionId: string;
  parentId?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  replies: Discussion[];
  createdAt: Date;
  isPinned: boolean;
  isOfficial: boolean;
}

export interface KnowledgeNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  children: KnowledgeNode[];
  questionIds: string[];
  difficulty: string;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface KnowledgeTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  children: KnowledgeNode[];
  totalQuestions: number;
  totalUsers: number;
}
