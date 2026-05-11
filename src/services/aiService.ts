const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface AIRequest {
  prompt: string;
  category: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generatePreview(prompt: string, category: string): Promise<AIResponse> {
    if (!OPENAI_API_KEY) {
      return this.generateMockPreview(prompt, category);
    }

    try {
      const systemPrompt = this.getSystemPrompt(category);
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        usage: data.usage
      };
    } catch (error: any) {
      console.error('AI API Error:', error);
      return this.generateMockPreview(prompt, category);
    }
  }

  async scorePrompt(prompt: string, output: string): Promise<{
    clarity: number;
    creativity: number;
    practicality: number;
    total: number;
  }> {
    if (!OPENAI_API_KEY) {
      return this.calculateMockScore(prompt, output);
    }

    try {
      const evaluationPrompt = `你是一个提示词评估专家。请评估以下提示词的质量：

提示词：${prompt}

生成结果：${output}

请从以下维度评分（0-100）：
1. 清晰度：指令是否明确、无歧义
2. 创意性：是否具有独特思路和创新点
3. 实用性：在实际使用中的效果

请用JSON格式返回：
{
  "clarity": 分数,
  "creativity": 分数,
  "practicality": 分数,
  "total": 总分
}`;

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: evaluationPrompt }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const evaluation = JSON.parse(data.choices[0].message.content);
      return evaluation;
    } catch (error: any) {
      console.error('AI Scoring Error:', error);
      return this.calculateMockScore(prompt, output);
    }
  }

  private getSystemPrompt(category: string): string {
    const prompts: Record<string, string> = {
      writing: `你是一位资深创意写作导师。请根据用户提供的提示词，生成一段高质量的创意文本示例。要求：
- 内容符合提示词的意图
- 展示提示词的实际效果
- 文本质量高、有吸引力
- 字数控制在100-200字`,
      coding: `你是一位编程专家。请根据用户提供的提示词，生成一段代码示例。要求：
- 代码符合提示词描述的功能
- 注释清晰、代码规范
- 展示提示词的实际效果
- 支持多种编程语言风格`,
      business: `你是一位营销文案专家。请根据用户提供的提示词，生成一段营销文案示例。要求：
- 文案有吸引力、感染力
- 突出产品价值和卖点
- 包含明确的行动号召
- 展示提示词的实际效果`,
      creative: `你是一位艺术创作专家。请根据用户提供的提示词，生成一段创意内容示例。要求：
- 内容富有创意和艺术感
- 符合提示词的风格要求
- 展示提示词的实际效果
- 可以包含诗歌、故事、艺术描述等`
    };
    return prompts[category] || prompts.writing;
  }

  private generateMockPreview(prompt: string, category: string): AIResponse {
    const templates: Record<string, string[]> = {
      writing: [
        '在月光下的古老图书馆中，一位年轻的学者发现了尘封已久的手稿。他的指尖轻轻触碰纸面，突然间，文字仿佛活了过来，闪烁出金色的光芒。这是一个关于时间、记忆与命运交织的故事开端...',
        '暴风雨即将来临，海面上波涛汹涌。老渔夫站在礁石上，望着远方的灯塔，那是他唯一的希望。三十年的海上生涯，无数次的生死考验，此刻都化作了眼前这片壮阔的景象...',
        '城市霓虹灯下，她独自走在回家的路上。手机屏幕上显示着刚刚收到的消息，心跳不由得加速。这条消息将彻底改变她的生活轨迹...'
      ],
      coding: [
        '```javascript\n// 根据提示词生成的代码\nfunction processData(input) {\n  // 数据处理逻辑\n  const result = input.map(item => ({\n    ...item,\n    processed: true,\n    timestamp: Date.now()\n  }));\n  return result;\n}\n\n// 使用示例\nconst data = [\n  { id: 1, value: "示例数据" },\n  { id: 2, value: "测试数据" }\n];\n\nconsole.log(processData(data));\n```',
        '```python\n# Python 数据处理函数\ndef analyze_text(text):\n    words = text.split()\n    return {\n        "word_count": len(words),\n        "unique_words": len(set(words)),\n        "avg_word_length": sum(len(w) for w in words) / len(words)\n    }\n\n# 示例\nsample_text = "这是一个示例文本用于演示"\nresult = analyze_text(sample_text)\nprint(result)\n```'
      ],
      business: [
        '🎁 限时特惠 | 仅限今日\n\n告别繁琐，拥抱高效！我们的小工具让你的工作效率提升300%\n\n✨ 智能分析  ✨ 简单易用  ✨ 安全可靠\n\n👉 立即抢购 | 前100名享5折优惠\n\n已有100,000+用户验证，效果显著！',
        '💡 你还在为效率低下烦恼吗？\n\n我们的解决方案帮你：\n✓ 节省50%的时间成本\n✓ 降低80%的错误率\n✓ 提升200%的满意度\n\n立即体验，开启高效人生！'
      ],
      creative: [
        '《星河之梦》\n\n在无尽的黑暗中，\n我看见第一缕光。\n那是星辰的呼吸，\n是宇宙的心跳。\n\n每一颗流星坠落，\n都是一次永恒的告别，\n而我们仰望的目光，\n却永远追随着那道光芒。',
        '时间的裂缝\n\n午夜十二点，\n城市的时钟停摆。\n我看见时间的裂缝中，\n无数个我在并行生活。\n\n有的我已经成功，\n有的我已经放弃，\n而此刻的我，\n正站在分岔路口...'
      ]
    };

    const categoryTemplates = templates[category] || templates.writing;
    const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
    
    return {
      text: categoryTemplates[randomIndex],
      usage: {
        promptTokens: 50,
        completionTokens: 100,
        totalTokens: 150
      }
    };
  }

  private calculateMockScore(prompt: string, output: string): {
    clarity: number;
    creativity: number;
    practicality: number;
    total: number;
  } {
    const clarity = Math.min(100, Math.max(60, prompt.length * 0.8 + Math.random() * 20));
    const creativity = Math.min(100, Math.max(60, 70 + Math.random() * 30));
    const practicality = Math.min(100, Math.max(60, output.length * 0.5 + Math.random() * 30));
    
    return {
      clarity: Math.round(clarity * 10) / 10,
      creativity: Math.round(creativity * 10) / 10,
      practicality: Math.round(practicality * 10) / 10,
      total: Math.round((clarity * 0.2 + creativity * 0.2 + practicality * 0.3) * 10) / 10
    };
  }
}

export const aiService = AIService.getInstance();
