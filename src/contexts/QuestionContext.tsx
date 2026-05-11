import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Question, Discussion, KnowledgeTree, KnowledgeNode } from '../types/question';

interface QuestionContextType {
  questions: Question[];
  discussions: Discussion[];
  knowledgeTree: KnowledgeTree | null;
  createQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  approveQuestion: (id: string) => void;
  rejectQuestion: (id: string) => void;
  addDiscussion: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'replies'>) => void;
  likeDiscussion: (id: string) => void;
  likeQuestion: (id: string) => void;
  starQuestion: (id: string) => void;
  getQuestionsByCategory: (category: string) => Question[];
  getQuestionsByAuthor: (authorId: string) => Question[];
  getDiscussionsByQuestion: (questionId: string) => Discussion[];
  searchQuestions: (keyword: string) => Question[];
  getOfficialQuestions: () => Question[];
  getFeaturedQuestions: () => Question[];
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: '小说开头生成器',
    description: '创建一个能够生成引人入胜的小说开头的提示词',
    category: 'creative-writing',
    difficulty: 'medium',
    tags: ['小说', '创意', '开头'],
    requiredSkills: ['文学创作', '叙事技巧'],
    prompt: '你是一位资深小说家。请为用户提供的[主题]创作一个引人入胜的小说开头。要求：\n1. 设定具体场景\n2. 塑造鲜明人物\n3. 营造悬念氛围\n4. 控制在150-200字',
    referenceAnswer: '优秀的小说开头应该包含：\n- 具体的时间和地点设定\n- 主人公的初步刻画\n- 核心冲突的暗示\n- 生动的感官描写',
    authorId: 'admin',
    authorName: '管理员',
    authorAvatar: '👑',
    status: 'approved',
    stats: { likes: 234, stars: 89, attempts: 1523, averageScore: 78.5 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    publishedAt: new Date('2024-01-01'),
    childIds: [],
    metadata: {
      estimatedTime: '30分钟',
      points: 100,
      isOfficial: true,
      isFeatured: true
    }
  },
  {
    id: 'q2',
    title: '代码注释优化',
    description: '编写一个能够生成高质量代码注释的提示词',
    category: 'coding',
    difficulty: 'easy',
    tags: ['代码', '注释', '文档'],
    requiredSkills: ['编程', '文档写作'],
    prompt: '你是一位代码审查专家。请为以下代码生成清晰、准确的注释。注释应该：\n1. 解释代码目的\n2. 说明关键逻辑\n3. 标注注意事项\n4. 提供使用示例',
    authorId: 'admin',
    authorName: '管理员',
    authorAvatar: '👑',
    status: 'approved',
    stats: { likes: 156, stars: 67, attempts: 892, averageScore: 82.3 },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    publishedAt: new Date('2024-01-02'),
    childIds: [],
    metadata: {
      estimatedTime: '20分钟',
      points: 80,
      isOfficial: true,
      isFeatured: true
    }
  }
];

const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'd1',
    questionId: 'q1',
    authorId: 'user1',
    authorName: '写作新手',
    authorAvatar: '✍️',
    content: '这个提示词很好用！我用它在小说比赛中获得了第一名！',
    likes: 45,
    replies: [],
    createdAt: new Date('2024-01-10'),
    isPinned: true,
    isOfficial: false
  }
];

const INITIAL_KNOWLEDGE_TREE: KnowledgeTree = {
  id: 'kt1',
  name: 'AI提示词工程',
  description: '系统学习AI提示词工程的知识体系',
  icon: '🧠',
  children: [
    {
      id: 'kn1',
      name: '基础概念',
      description: '了解AI和提示词的基本概念',
      icon: '📚',
      parentId: 'kt1',
      children: [
        {
          id: 'kn1-1',
          name: '什么是AI提示词',
          description: '学习提示词的定义和作用',
          icon: '💡',
          parentId: 'kn1',
          children: [],
          questionIds: ['q1'],
          difficulty: 'easy'
        },
        {
          id: 'kn1-2',
          name: '提示词的基本结构',
          description: '了解提示词的组成部分',
          icon: '🏗️',
          parentId: 'kn1',
          children: [],
          questionIds: ['q2'],
          difficulty: 'easy'
        }
      ],
      questionIds: ['q1', 'q2'],
      difficulty: 'easy',
      progress: { completed: 0, total: 5, percentage: 0 }
    },
    {
      id: 'kn2',
      name: '创意写作',
      description: '学习创意类提示词的编写技巧',
      icon: '✍️',
      parentId: 'kt1',
      children: [
        {
          id: 'kn2-1',
          name: '小说创作',
          description: '用AI辅助小说创作',
          icon: '📖',
          parentId: 'kn2',
          children: [],
          questionIds: ['q1'],
          difficulty: 'medium'
        }
      ],
      questionIds: ['q1'],
      difficulty: 'medium',
      progress: { completed: 0, total: 8, percentage: 0 }
    },
    {
      id: 'kn3',
      name: '技术应用',
      description: '编程和技术文档类提示词',
      icon: '💻',
      parentId: 'kt1',
      children: [
        {
          id: 'kn3-1',
          name: '代码生成',
          description: '用AI生成高质量代码',
          icon: '🔧',
          parentId: 'kn3',
          children: [],
          questionIds: ['q2'],
          difficulty: 'medium'
        },
        {
          id: 'kn3-2',
          name: '代码审查',
          description: 'AI辅助代码审查和优化',
          icon: '🔍',
          parentId: 'kn3',
          children: [],
          questionIds: [],
          difficulty: 'hard'
        }
      ],
      questionIds: ['q2'],
      difficulty: 'medium',
      progress: { completed: 0, total: 10, percentage: 0 }
    }
  ],
  totalQuestions: 24,
  totalUsers: 1256
};

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  const [knowledgeTree, setKnowledgeTree] = useState<KnowledgeTree | null>(INITIAL_KNOWLEDGE_TREE);

  useEffect(() => {
    const stored = localStorage.getItem('prompt-arena-questions');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setQuestions(data.questions || INITIAL_QUESTIONS);
        setDiscussions(data.discussions || INITIAL_DISCUSSIONS);
      } catch (e) {
        console.error('Failed to load questions:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prompt-arena-questions', JSON.stringify({
      questions,
      discussions
    }));
  }, [questions, discussions]);

  const createQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: `q-${nanoid()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        likes: 0,
        stars: 0,
        attempts: 0,
        averageScore: 0
      }
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates, updatedAt: new Date() } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const approveQuestion = (id: string) => {
    updateQuestion(id, { 
      status: 'approved',
      publishedAt: new Date()
    });
  };

  const rejectQuestion = (id: string) => {
    updateQuestion(id, { status: 'rejected' });
  };

  const addDiscussion = (discussionData: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'replies'>) => {
    const newDiscussion: Discussion = {
      ...discussionData,
      id: `d-${nanoid()}`,
      createdAt: new Date(),
      likes: 0,
      replies: []
    };
    setDiscussions(prev => [...prev, newDiscussion]);
  };

  const likeDiscussion = (id: string) => {
    setDiscussions(prev => prev.map(d => 
      d.id === id ? { ...d, likes: d.likes + 1 } : d
    ));
  };

  const likeQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, stats: { ...q.stats, likes: q.stats.likes + 1 } } : q
    ));
  };

  const starQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, stats: { ...q.stats, stars: q.stats.stars + 1 } } : q
    ));
  };

  const getQuestionsByCategory = (category: string) => {
    return questions.filter(q => q.category === category && q.status === 'approved');
  };

  const getQuestionsByAuthor = (authorId: string) => {
    return questions.filter(q => q.authorId === authorId);
  };

  const getDiscussionsByQuestion = (questionId: string) => {
    return discussions.filter(d => d.questionId === questionId);
  };

  const searchQuestions = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return questions.filter(q => 
      q.status === 'approved' && (
        q.title.toLowerCase().includes(lowerKeyword) ||
        q.description.toLowerCase().includes(lowerKeyword) ||
        q.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      )
    );
  };

  const getOfficialQuestions = () => {
    return questions.filter(q => q.metadata.isOfficial && q.status === 'approved');
  };

  const getFeaturedQuestions = () => {
    return questions.filter(q => q.metadata.isFeatured && q.status === 'approved');
  };

  return (
    <QuestionContext.Provider value={{
      questions,
      discussions,
      knowledgeTree,
      createQuestion,
      updateQuestion,
      deleteQuestion,
      approveQuestion,
      rejectQuestion,
      addDiscussion,
      likeDiscussion,
      likeQuestion,
      starQuestion,
      getQuestionsByCategory,
      getQuestionsByAuthor,
      getDiscussionsByQuestion,
      searchQuestions,
      getOfficialQuestions,
      getFeaturedQuestions
    }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within QuestionProvider');
  }
  return context;
};
