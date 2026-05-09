import { Challenge } from '../types/challenge';
import { Template } from '../types/template';
import { Achievement, User } from '../types/user';

export const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: '最佳小说开头提示词挑战',
    description: '创建一个能够生成引人入胜的小说开头的提示词。要求能够设定场景、塑造人物、营造氛围，并留下悬念吸引读者继续阅读。',
    category: 'writing',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '生成的开头需要包含场景描写',
      '至少涉及一个角色的心理活动',
      '营造出紧张的氛围或悬念',
      '字数控制在100-200字'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 20,
      practicality: 30,
      communityVote: 30
    },
    participants: 128,
    prize: '第一名：500积分 + 限量徽章'
  },
  {
    id: '2',
    title: '代码注释优化挑战',
    description: '编写一个能够生成高质量代码注释的提示词。要求注释清晰、准确、易懂，能够帮助其他开发者快速理解代码逻辑。',
    category: 'coding',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '支持多种编程语言',
      '注释风格符合业界标准',
      '能够解释复杂逻辑',
      '包含使用示例'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 20,
      practicality: 30,
      communityVote: 30
    },
    participants: 89,
    prize: '第一名：500积分 + 限量徽章'
  },
  {
    id: '3',
    title: '营销文案生成挑战',
    description: '创建一个能够生成吸引人的营销文案的提示词。需要能够突出产品卖点、引发情感共鸣、促进购买决策。',
    category: 'business',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    requirements: [
      '文案需要有吸引力',
      '突出产品核心价值',
      '包含明确的行动号召',
      '适合社交媒体传播'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 20,
      practicality: 30,
      communityVote: 30
    },
    participants: 0,
    prize: '第一名：500积分 + 限量徽章'
  },
  {
    id: '4',
    title: '诗歌创作助手挑战',
    description: '设计一个能够创作优美诗歌的提示词助手。支持多种诗歌风格，包括古体诗、现代诗、词等。要求意境深远、韵律优美。',
    category: 'creative',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'ended',
    requirements: [
      '支持多种诗歌体裁',
      '意境表达清晰',
      '韵律节奏感强',
      '富有创意和个性'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 20,
      practicality: 30,
      communityVote: 30
    },
    participants: 256,
    prize: '第一名：500积分 + 限量徽章'
  }
];

export const sampleTemplates: Template[] = [
  {
    id: '1',
    title: '创意写作助手',
    description: '帮助你创作各种类型的创意文本，包括小说、散文、剧本等。',
    prompt: '你是一位经验丰富的创意写作导师。请根据用户提供的[主题]和[风格偏好]，创作一段[字数]的创意文本。要求：[具体要求1]、[具体要求2]、[具体要求3]。',
    category: 'writing',
    tags: ['创意', '写作', '小说', '教学'],
    author: {
      id: '1',
      name: '写作达人',
      avatar: '👨‍🏫'
    },
    usageCount: 1256,
    favoriteCount: 328,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    source: 'challenge'
  },
  {
    id: '2',
    title: '代码审查专家',
    description: '自动审查代码，发现潜在问题并提供优化建议。',
    prompt: '你是一位资深的代码审查专家。请审查以下代码，重点关注：[审查重点1]、[审查重点2]、[审查重点3]。对于每个问题，请提供问题描述、严重程度和具体的修复建议。',
    category: 'coding',
    tags: ['代码', '审查', '优化', '质量'],
    author: {
      id: '2',
      name: '代码大师',
      avatar: '👨‍💻'
    },
    usageCount: 892,
    favoriteCount: 245,
    rating: 4.6,
    createdAt: new Date('2024-01-20'),
    source: 'challenge'
  },
  {
    id: '3',
    title: '数据分析报告生成器',
    description: '根据数据生成专业的数据分析报告，包含洞察和建议。',
    prompt: '你是一位数据分析师。请基于提供的数据集，分析并生成一份结构化的分析报告。报告应包括：1. 关键指标概览；2. 趋势分析；3. 异常发现；4. 业务洞察；5. 行动建议。请使用专业但易懂的语言。',
    category: 'business',
    tags: ['数据', '分析', '报告', '商业'],
    author: {
      id: '3',
      name: '数据专家',
      avatar: '👩‍🔬'
    },
    usageCount: 634,
    favoriteCount: 189,
    rating: 4.7,
    createdAt: new Date('2024-02-01'),
    source: 'user'
  }
];

export const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: '初次参赛',
    description: '完成第一次挑战提交',
    icon: '🎯',
    category: 'contest',
    requirement: { type: 'submission', threshold: 1 },
    points: 50
  },
  {
    id: '2',
    title: '常胜将军',
    description: '在挑战中获得第一名',
    icon: '🏆',
    category: 'contest',
    requirement: { type: 'win', threshold: 1 },
    points: 500
  },
  {
    id: '3',
    title: '高材生',
    description: '提示词获得90分以上',
    icon: '🎓',
    category: 'quality',
    requirement: { type: 'score', threshold: 90 },
    points: 200
  },
  {
    id: '4',
    title: '人气选手',
    description: '作品获得100次投票',
    icon: '💖',
    category: 'community',
    requirement: { type: 'vote', threshold: 100 },
    points: 150
  },
  {
    id: '5',
    title: '收藏达人',
    description: '收藏50个优质模板',
    icon: '📚',
    category: 'community',
    requirement: { type: '收藏', threshold: 50 },
    points: 100
  }
];

export const sampleUser: User = {
  id: 'user-1',
  username: 'AI爱好者',
  avatar: '🤖',
  bio: '热爱AI，专注于提示词优化',
  stats: {
    totalSubmissions: 12,
    totalWins: 3,
    totalScore: 2850,
    rank: 15
  },
  achievements: ['1', '2', '3'],
  points: 1250,
  favorites: ['1', '2'],
  joinedAt: new Date('2024-01-01')
};
