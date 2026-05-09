# 提示词竞赛平台 - 技术架构文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**：PromptArena - 提示词竞赛平台
- **项目类型**：Web单页应用（SPA）
- **技术栈**：React 18 + TypeScript + Vite
- **目标平台**：桌面端优先，移动端适配

### 1.2 核心特性
- 挑战赛制与实时排名
- 混合评分系统（AI评分 + 社区投票）
- 实时预览功能
- 成就与积分系统
- 提示词模板库

## 2. 技术选型

### 2.1 前端框架
```typescript
{
  "核心框架": "React 18.2+",
  "类型系统": "TypeScript 5.0+",
  "构建工具": "Vite 5.0+",
  "路由管理": "React Router DOM v6"
}
```

### 2.2 UI与样式
```typescript
{
  "样式方案": "Tailwind CSS 3.4+",
  "动画库": "Framer Motion 10+",
  "图标库": "Lucide React",
  "代码编辑": "@monaco-editor/react"
}
```

### 2.3 状态管理
```typescript
{
  "全局状态": "React Context API + useReducer",
  "本地存储": "localStorage + 自定义Hook",
  "数据获取": "React Query（可选）"
}
```

### 2.4 工具库
```typescript
{
  "日期处理": "dayjs",
  "ID生成": "nanoid",
  "类名工具": "clsx"
}
```

## 3. 项目结构

```
prompt-arena/
├── public/
│   └── index.html
├── src/
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   └── styles/
│   ├── components/            # 通用组件
│   │   ├── common/            # 通用UI组件
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── Badge/
│   │   ├── layout/            # 布局组件
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── PageContainer/
│   │   ├── challenge/         # 挑战相关组件
│   │   │   ├── ChallengeCard/
│   │   │   ├── ChallengeList/
│   │   │   └── ChallengeDetail/
│   │   ├── editor/            # 编辑器组件
│   │   │   ├── PromptEditor/
│   │   │   ├── LivePreview/
│   │   │   └── EditorToolbar/
│   │   ├── leaderboard/       # 排行榜组件
│   │   │   ├── LeaderboardTable/
│   │   │   └── RankingCard/
│   │   ├── template/          # 模板库组件
│   │   │   ├── TemplateCard/
│   │   │   └── TemplateGrid/
│   │   └── achievement/       # 成就系统组件
│   │       ├── AchievementBadge/
│   │       └── ScoreDisplay/
│   ├── pages/                 # 页面组件
│   │   ├── Home/              # 首页
│   │   ├── Challenges/        # 挑战列表
│   │   ├── ChallengeDetail/   # 挑战详情
│   │   ├── Editor/            # 编辑器页
│   │   ├── Templates/         # 模板库
│   │   ├── Leaderboard/       # 排行榜
│   │   └── Profile/           # 个人中心
│   ├── contexts/              # React Context
│   │   ├── AuthContext.tsx
│   │   ├── ChallengeContext.tsx
│   │   └── ScoreContext.tsx
│   ├── hooks/                 # 自定义Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useSimulatedAI.ts
│   │   └── useScoring.ts
│   ├── utils/                 # 工具函数
│   │   ├── scoring.ts         # 评分算法
│   │   ├── storage.ts         # 存储工具
│   │   └── helpers.ts         # 辅助函数
│   ├── data/                  # 示例数据
│   │   ├── challenges.ts
│   │   ├── templates.ts
│   │   └── achievements.ts
│   ├── types/                 # TypeScript类型定义
│   │   ├── challenge.ts
│   │   ├── user.ts
│   │   └── template.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 4. 核心数据模型

### 4.1 挑战（Challenge）
```typescript
interface Challenge {
  id: string;
  title: string;                    // 挑战标题
  description: string;              // 详细描述
  category: 'writing' | 'coding' | 'business' | 'creative';
  startTime: Date;                  // 开始时间
  endTime: Date;                   // 结束时间
  status: 'upcoming' | 'active' | 'ended';
  requirements: string[];           // 提交要求
  scoringCriteria: {
    clarity: number;                // 清晰度权重
    creativity: number;              // 创意性权重
    practicality: number;            // 实用性权重
    communityVote: number;          // 社区投票权重
  };
  participants: number;              // 参与人数
  prize?: string;                   // 奖励说明
}
```

### 4.2 参赛作品（Submission）
```typescript
interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  prompt: string;                   // 提交的提示词
  preview: string;                  // 预览输出
  scores: {
    aiScore: number;                // AI评分
    communityScore: number;         // 社区评分
    totalScore: number;             // 总分
  };
  votes: number;                    // 获得的投票数
  rank: number;                     // 当前排名
  submittedAt: Date;
  rankingHistory: Array<{
    rank: number;
    timestamp: Date;
  }>;
}
```

### 4.3 提示词模板（Template）
```typescript
interface Template {
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
  usageCount: number;              // 使用次数
  favoriteCount: number;            // 收藏次数
  rating: number;                   // 平均评分
  createdAt: Date;
  source: 'challenge' | 'user' | 'admin';
}
```

### 4.4 用户（User）
```typescript
interface User {
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
  achievements: string[];           // 成就ID列表
  points: number;                   // 积分
  favorites: string[];              // 收藏的模板ID
  joinedAt: Date;
}
```

### 4.5 成就（Achievement）
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'contest' | 'quality' | 'community' | 'special';
  requirement: {
    type: 'submission' | 'win' | 'score' | 'vote' | '收藏';
    threshold: number;
  };
  points: number;                   // 奖励积分
}
```

## 5. 路由设计

### 5.1 路由结构
```typescript
const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/challenges',
    component: Challenges,
    meta: { title: '挑战列表' }
  },
  {
    path: '/challenges/:id',
    component: ChallengeDetail,
    meta: { title: '挑战详情' }
  },
  {
    path: '/challenges/:id/editor',
    component: Editor,
    meta: { title: '提交作品' }
  },
  {
    path: '/templates',
    component: Templates,
    meta: { title: '模板库' }
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
    meta: { title: '排行榜' }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { title: '个人中心' }
  }
];
```

### 5.2 路由守卫
- 编辑器页面需要登录验证
- 排行榜和模板库公开访问
- 个人中心需要登录

## 6. 状态管理架构

### 6.1 Context结构
```
AppContext
├── AuthContext           # 用户认证状态
│   ├── currentUser
│   ├── login()
│   ├── logout()
│   └── updateProfile()
│
├── ChallengeContext      # 挑战相关状态
│   ├── activeChallenges
│   ├── challengeDetails
│   ├── submissions
│   ├── submitPrompt()
│   └── fetchChallenges()
│
├── ScoreContext          # 评分与排名
│   ├── leaderboard
│   ├── userScore
│   ├── calculateScore()
│   └── updateRanking()
│
└── TemplateContext        # 模板库
    ├── templates
    ├── favorites
    ├── searchTemplates()
    └── toggleFavorite()
```

### 6.2 LocalStorage结构
```typescript
{
  "prompt-arena-user": User,
  "prompt-arena-submissions": Submission[],
  "prompt-arena-favorites": string[],
  "prompt-arena-achievements": string[]
}
```

## 7. 核心功能实现

### 7.1 AI评分模拟
```typescript
// useSimulatedAI.ts
const calculateAIScore = (prompt: string, preview: string): number => {
  const clarityScore = analyzeClarity(prompt);
  const creativityScore = analyzeCreativity(prompt);
  const practicalityScore = analyzePracticality(prompt, preview);
  
  return (
    clarityScore * 0.2 +
    creativityScore * 0.2 +
    practicalityScore * 0.3
  ) * 100;
};
```

### 7.2 实时预览模拟
```typescript
// useLivePreview.ts
const generatePreview = (prompt: string): string => {
  const keywords = extractKeywords(prompt);
  return simulateAIOutput(keywords);
};
```

### 7.3 排名计算
```typescript
// scoring.ts
const calculateFinalScore = (
  aiScore: number,
  communityScore: number
): number => {
  return aiScore * 0.6 + communityScore * 0.4;
};
```

## 8. 组件层级

### 8.1 布局层级
```
App
└── Layout
    ├── Header (固定顶部)
    ├── Sidebar (可选侧边栏)
    └── MainContent
        └── PageContainer
            └── [PageComponent]
                ├── [Section]
                │   └── [FeatureComponent]
                └── [DetailComponent]
```

### 8.2 关键组件通信
```
ChallengeDetail
├── ChallengeInfo
├── LeaderboardPreview
│   └── LeaderboardTable
│       └── RankingCard
└── ActionButtons
    └── → EditorPage

EditorPage
├── PromptEditor
│   ├── EditorToolbar
│   └── MonacoEditor
├── LivePreview
│   └── PreviewPanel
└── SubmissionForm
    └── ScorePreview
```

## 9. 样式系统

### 9.1 Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e'
        },
        accent: {
          gold: '#f59e0b',
          purple: '#8b5cf6'
        }
      }
    }
  }
};
```

### 9.2 CSS变量
```css
:root {
  --color-primary: #0ea5e9;
  --color-accent: #f59e0b;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
}
```

## 10. 实现计划

### Phase 1：项目初始化（预计代码量：500行）
- [ ] 初始化Vite + React + TypeScript项目
- [ ] 配置Tailwind CSS
- [ ] 设置项目结构和路由
- [ ] 实现通用UI组件库（Button, Card, Badge等）
- [ ] 创建布局组件（Header, PageContainer）

### Phase 2：核心页面（预计代码量：1500行）
- [ ] 首页/仪表盘
- [ ] 挑战列表页
- [ ] 挑战详情页
- [ ] 排行榜展示

### Phase 3：编辑器功能（预计代码量：1000行）
- [ ] Monaco Editor集成
- [ ] 实时预览系统
- [ ] 评分系统
- [ ] 作品提交功能

### Phase 4：增强功能（预计代码量：800行）
- [ ] 模板库页面
- [ ] 收藏功能
- [ ] 成就系统
- [ ] 个人中心

### Phase 5：优化完善（预计代码量：500行）
- [ ] 动画和过渡效果
- [ ] 响应式布局
- [ ] 数据持久化
- [ ] 示例数据填充

## 11. 技术要点

### 11.1 性能优化
- 使用React.memo优化重渲染
- 使用useMemo和useCallback减少计算
- 路由懒加载（React.lazy + Suspense）
- 图片优化和按需加载

### 11.2 用户体验
- 加载状态骨架屏
- 错误边界处理
- 空状态展示
- 操作反馈（Toast通知）
- 键盘快捷键支持

### 11.3 可访问性
- 语义化HTML标签
- ARIA属性支持
- 键盘导航支持
- 足够的颜色对比度

## 12. 开发规范

### 12.1 命名规范
- 组件：PascalCase（如ChallengeCard）
- 文件：kebab-case（如challenge-card.tsx）
- 函数：camelCase（如calculateScore）
- 常量：UPPER_SNAKE_CASE（如MAX_SUBMISSIONS）
- CSS类：kebab-case（Tailwind风格）

### 12.2 代码组织
```typescript
// 每个组件文件结构
import React from 'react';
import { clsx } from 'clsx';

interface ComponentProps {
  // 类型定义
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // 计算属性
  const computed = useMemo(() => {}, []);
  
  // 事件处理
  const handleClick = () => {};
  
  // 渲染
  return (
    <div className={clsx('class1', 'class2')}>
      {/* JSX */}
    </div>
  );
};
```

### 12.3 Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 13. 后续扩展

### 13.1 可扩展功能
- 真实AI API集成（OpenAI、Claude等）
- 用户认证系统（JWT）
- 实时多人竞赛模式
- 提示词版本管理
- 社区评论系统
- 举报和审核系统

### 13.2 数据迁移路径
- 当前：LocalStorage
- 下一步：LocalStorage + Mock API
- 最终：真实后端API

## 14. 部署方案

### 14.1 构建配置
```bash
npm run build  # 生产构建
npm run preview  # 本地预览生产构建
```

### 14.2 部署目标
- Vercel（推荐）
- Netlify
- GitHub Pages
- 任意静态文件托管

### 14.3 环境变量
```bash
VITE_APP_TITLE=PromptArena
VITE_APP_VERSION=1.0.0
```
