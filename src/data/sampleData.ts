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
  },
  {
    id: '5',
    title: '技术文档写作挑战',
    description: '创建一个能够生成专业技术文档的提示词。要求格式规范、内容准确、语言清晰，适合开发者阅读。',
    category: 'coding',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '文档结构清晰',
      '包含代码示例',
      '解释详细准确',
      '适合API文档风格'
    ],
    scoringCriteria: {
      clarity: 25,
      creativity: 15,
      practicality: 30,
      communityVote: 30
    },
    participants: 67,
    prize: '第一名：400积分 + 高级徽章'
  },
  {
    id: '6',
    title: '社交媒体帖子生成挑战',
    description: '设计一个能够生成吸引人的社交媒体帖子的提示词。要求符合平台调性、互动性强、传播性好。',
    category: 'business',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '符合微博/小红书风格',
      '包含适当的话题标签',
      '语言生动有趣',
      '能引发用户互动'
    ],
    scoringCriteria: {
      clarity: 15,
      creativity: 25,
      practicality: 30,
      communityVote: 30
    },
    participants: 145,
    prize: '第一名：600积分 + 达人徽章'
  },
  {
    id: '7',
    title: '对话系统设计挑战',
    description: '创建一个能够模拟特定角色或人物对话的提示词。要求语言风格一致、性格鲜明、对话自然流畅。',
    category: 'creative',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '角色性格鲜明',
      '对话自然流畅',
      '语言风格一致',
      '能保持角色设定'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 25,
      practicality: 25,
      communityVote: 30
    },
    participants: 92,
    prize: '第一名：550积分 + 创意徽章'
  },
  {
    id: '8',
    title: '产品描述优化挑战',
    description: '编写一个能够生成优质电商产品描述的提示词。要求突出产品特点、激发购买欲望、语言专业且有吸引力。',
    category: 'business',
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'ended',
    requirements: [
      '突出产品卖点',
      '语言专业且生动',
      '适合电商平台',
      '能提升转化率'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 20,
      practicality: 30,
      communityVote: 30
    },
    participants: 189,
    prize: '第一名：500积分 + 营销达人徽章'
  },
  {
    id: '9',
    title: '代码审查助手挑战',
    description: '创建一个能够进行代码审查的提示词。要求能够发现潜在问题、提供改进建议、评估代码质量。',
    category: 'coding',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    requirements: [
      '能识别代码问题',
      '提供改进建议',
      '评估代码质量',
      '包含最佳实践'
    ],
    scoringCriteria: {
      clarity: 25,
      creativity: 15,
      practicality: 30,
      communityVote: 30
    },
    participants: 0,
    prize: '第一名：450积分 + 代码专家徽章'
  },
  {
    id: '10',
    title: '故事续写助手挑战',
    description: '设计一个能够根据给定开头续写故事的提示词。要求保持风格一致、情节合理、富有创意。',
    category: 'writing',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    requirements: [
      '保持原风格',
      '情节自然发展',
      '人物性格一致',
      '富有创意和惊喜'
    ],
    scoringCriteria: {
      clarity: 20,
      creativity: 25,
      practicality: 25,
      communityVote: 30
    },
    participants: 0,
    prize: '第一名：500积分 + 故事大师徽章'
  },
  {
    id: '11',
    title: '数据报告生成挑战',
    description: '创建一个能够生成专业数据分析报告的提示词。要求结构清晰、洞察深刻、建议可行。',
    category: 'business',
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'ended',
    requirements: [
      '报告结构完整',
      '数据分析深入',
      '洞察有见地',
      '建议可执行'
    ],
    scoringCriteria: {
      clarity: 25,
      creativity: 15,
      practicality: 30,
      communityVote: 30
    },
    participants: 134,
    prize: '第一名：500积分 + 数据分析师徽章'
  },
  {
    id: '12',
    title: '创意广告脚本挑战',
    description: '设计一个能够生成短视频广告脚本的提示词。要求前3秒抓人眼球、节奏紧凑、有记忆点。',
    category: 'creative',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    requirements: [
      '开头有吸引力',
      '节奏紧凑',
      '有明确卖点',
      '适合短视频平台'
    ],
    scoringCriteria: {
      clarity: 15,
      creativity: 30,
      practicality: 25,
      communityVote: 30
    },
    participants: 178,
    prize: '第一名：600积分 + 创意鬼才徽章'
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
  },
  {
    id: '4',
    title: '社交媒体营销助手',
    description: '生成吸引人的社交媒体帖子和互动内容。',
    prompt: '你是一位社交媒体营销专家。请根据产品[产品名称]和目标受众[受众描述]，创建一条社交媒体帖子。要求：1. 前3秒抓人眼球；2. 突出产品核心卖点；3. 包含相关话题标签；4. 引导用户互动。',
    category: 'business',
    tags: ['社交媒体', '营销', '推广', '互动'],
    author: {
      id: '4',
      name: '营销高手',
      avatar: '📢'
    },
    usageCount: 1089,
    favoriteCount: 367,
    rating: 4.9,
    createdAt: new Date('2024-02-10'),
    source: 'admin'
  },
  {
    id: '5',
    title: '诗歌创作助手',
    description: '创作各种风格的诗歌，包括古体诗和现代诗。',
    prompt: '你是一位诗人。请根据主题[主题]和风格[风格：古体诗/现代诗/词]，创作一首诗歌。要求：1. 意境深远；2. 韵律优美；3. 富有情感；4. 符合指定的风格要求。',
    category: 'creative',
    tags: ['诗歌', '创作', '文学', '艺术'],
    author: {
      id: '5',
      name: '诗词达人',
      avatar: '✒️'
    },
    usageCount: 756,
    favoriteCount: 298,
    rating: 4.8,
    createdAt: new Date('2024-02-15'),
    source: 'challenge'
  },
  {
    id: '6',
    title: '对话角色扮演助手',
    description: '模拟特定角色进行对话，保持角色性格一致。',
    prompt: '你将扮演[角色名称]。[角色背景描述]。请保持角色性格[性格特点]，语言风格[语言风格]，根据用户的输入进行自然的对话。',
    category: 'creative',
    tags: ['对话', '角色扮演', '聊天', '创意'],
    author: {
      id: '6',
      name: '创意写手',
      avatar: '🎭'
    },
    usageCount: 567,
    favoriteCount: 189,
    rating: 4.5,
    createdAt: new Date('2024-02-20'),
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
  },
  {
    id: '6',
    title: '对战新手',
    description: '完成第一次对战',
    icon: '⚔️',
    category: 'contest',
    requirement: { type: 'submission', threshold: 1 },
    points: 30
  },
  {
    id: '7',
    title: '连胜达人',
    description: '对战取得5连胜',
    icon: '🔥',
    category: 'contest',
    requirement: { type: 'win', threshold: 5 },
    points: 300
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
