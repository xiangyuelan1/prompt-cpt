import { create } from 'zustand';
import { Challenge, Submission } from '../types/challenge';
import { User, Achievement } from '../types/user';
import { Template } from '../types/template';
import { sampleChallenges, sampleTemplates, sampleAchievements, sampleUser } from '../data/sampleData';
import { nanoid } from 'nanoid';

interface AppState {
  challenges: Challenge[];
  submissions: Submission[];
  templates: Template[];
  achievements: Achievement[];
  currentUser: User | null;
  
  setCurrentUser: (user: User | null) => void;
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'rankingHistory'>) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  voteSubmission: (id: string) => void;
  toggleFavorite: (templateId: string) => void;
  getSubmissionsByChallenge: (challengeId: string) => Submission[];
  calculateAIScore: (prompt: string, preview: string) => number;
  generatePreview: (prompt: string, category: string) => string;
}

export const useStore = create<AppState>((set, get) => ({
  challenges: sampleChallenges,
  submissions: [],
  templates: sampleTemplates,
  achievements: sampleAchievements,
  currentUser: sampleUser,

  setCurrentUser: (user) => set({ currentUser: user }),

  addSubmission: (submissionData) => {
    const newSubmission: Submission = {
      ...submissionData,
      id: nanoid(),
      submittedAt: new Date(),
      rankingHistory: [{ rank: submissionData.rank, timestamp: new Date() }]
    };

    set((state) => ({
      submissions: [...state.submissions, newSubmission]
    }));

    const state = get();
    const challengeSubmissions = state.getSubmissionsByChallenge(submissionData.challengeId);
    const ranked = challengeSubmissions.sort((a, b) => b.scores.totalScore - a.scores.totalScore);
    
    ranked.forEach((sub, index) => {
      if (sub.rank !== index + 1) {
        get().updateSubmission(sub.id, { 
          rank: index + 1,
          rankingHistory: [...sub.rankingHistory, { rank: index + 1, timestamp: new Date() }]
        });
      }
    });
  },

  updateSubmission: (id, updates) => set((state) => ({
    submissions: state.submissions.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    )
  })),

  voteSubmission: (id) => set((state) => ({
    submissions: state.submissions.map(sub => 
      sub.id === id ? { ...sub, votes: sub.votes + 1 } : sub
    )
  })),

  toggleFavorite: (templateId) => set((state) => {
    if (!state.currentUser) return state;
    
    const isFavorited = state.currentUser.favorites.includes(templateId);
    return {
      currentUser: {
        ...state.currentUser,
        favorites: isFavorited 
          ? state.currentUser.favorites.filter(id => id !== templateId)
          : [...state.currentUser.favorites, templateId]
      }
    };
  }),

  getSubmissionsByChallenge: (challengeId) => {
    return get().submissions.filter(sub => sub.challengeId === challengeId);
  },

  calculateAIScore: (prompt, preview) => {
    const clarityScore = Math.min(prompt.length / 100, 1) * 0.2 * 100;
    const creativityScore = (Math.random() * 0.3 + 0.7) * 20;
    const practicalityScore = (Math.random() * 0.3 + 0.7) * 30;
    
    return Math.round((clarityScore + creativityScore + practicalityScore) * 10) / 10;
  },

  generatePreview: (prompt, category) => {
    const templates: Record<string, string[]> = {
      writing: [
        '在古老的城堡深处，一个年轻人正凝视着窗外的星空。他的眼中闪烁着对未知的渴望，手中紧握着一封来自远方的信。月光透过彩色玻璃窗洒落，为这个神秘的时刻增添了几分魔幻色彩。',
        '暴风雨来临前的城市，霓虹灯在雨幕中摇曳。街角的咖啡馆里，她第一次注意到了他——那个总是独自坐在角落，用钢笔在泛黄纸张上书写的人。',
        '最后一班地铁缓缓驶入站台，站台上空无一人。他看了看手表，距离午夜只剩三分钟。而就在这时，手机屏幕亮了起来...'
      ],
      coding: [
        '```javascript\n// 生成斐波那契数列\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// 时间复杂度: O(2^n)\n// 空间复杂度: O(n)\n```',
        '```python\n# 数据清洗函数\ndef clean_data(df):\n    # 去除重复行\n    df = df.drop_duplicates()\n    # 处理缺失值\n    df = df.fillna(method="ffill")\n    return df\n```',
        '```typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\n// 类型安全的用户验证\nfunction validateUser(user: unknown): user is User {\n  return typeof user === "object" && user !== null && "id" in user;\n}\n```'
      ],
      business: [
        '🔥 限时特惠 | 立即抢购\n\n告别繁琐，拥抱高效！我们的小工具让工作效率提升300%\n\n✨ 智能分析  ✨ 简单易用  ✨ 安全可靠\n\n👉 立即体验 | 7天无理由退款',
        '💡 你还在为繁琐的工作流程烦恼吗？\n\n我们的解决方案帮你：\n✓ 节省50%的时间\n✓ 降低80%的错误率\n✓ 提升200%的工作满意度\n\n已有10万+用户信赖，选择我们就是选择成功！',
        '🎁 新用户专属福利\n\n首月免费使用\n专业客服7×24小时在线\n永久保存您的数据\n\n立即注册，开启智能办公新时代！'
      ],
      creative: [
        '春夜\n\n月照花林皆似霰，\n风传细雨润无声。\n独坐幽篁听风语，\n一壶清茶伴余生。',
        '数字时代的孤独\n\n代码在屏幕上闪烁\n如同夜空中孤独的星\n我们在信息的海洋中漂浮\n却找不到心灵的港湾\n\n键盘敲击声响起\n是机器的呼吸\n还是灵魂的呐喊？',
        '相见欢\n\n春风又绿江南岸\n明月何时照我还\n\n独上高楼，望尽天涯路\n衣带渐宽终不悔\n为伊消得人憔悴'
      ]
    };

    const categoryTemplates = templates[category] || templates.writing;
    const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
    return categoryTemplates[randomIndex];
  }
}));
