import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Save, Send, Eye } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useQuestions } from '../contexts/QuestionContext';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';

export const CreateQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createQuestion } = useQuestions();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'creative-writing',
    difficulty: 'medium' as const,
    tags: '',
    prompt: '',
    referenceAnswer: '',
    estimatedTime: '30分钟',
    points: 100
  });

  const [preview, setPreview] = useState(false);

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">请先登录</h2>
          <p className="text-gray-400 mb-4">登录后才能创建题目</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold"
          >
            去登录
          </button>
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = (asDraft: boolean) => {
    if (!formData.title || !formData.prompt) {
      alert('请填写标题和提示词要求');
      return;
    }

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    createQuestion({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      tags,
      requiredSkills: [],
      prompt: formData.prompt,
      referenceAnswer: formData.referenceAnswer || undefined,
      authorId: user!.id,
      authorName: user!.username,
      authorAvatar: user!.avatar,
      status: asDraft ? 'draft' : 'pending',
      childIds: [],
      metadata: {
        estimatedTime: formData.estimatedTime,
        points: formData.points,
        isOfficial: false,
        isFeatured: false
      }
    });

    alert(asDraft ? '草稿已保存！' : '题目已提交，等待审核！');
    navigate('/questions');
  };

  return (
    <PageContainer title="创建题目" subtitle="设计你自己的提示词挑战">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-100 rounded-2xl p-8 border border-primary-500/20"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">新题目</h2>
            <button
              onClick={() => setPreview(!preview)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                preview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-dark-200 text-gray-400 hover:text-white'
              )}
            >
              <Eye className="w-4 h-4" />
              {preview ? '编辑模式' : '预览模式'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                题目标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：小说开头生成器"
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                题目描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细描述这个题目的要求和使用场景..."
                rows={3}
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  分类
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="creative-writing">创意写作</option>
                  <option value="coding">编程技术</option>
                  <option value="business">商业营销</option>
                  <option value="creative">创意艺术</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  难度
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                  <option value="expert">专家</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="例如：小说, 创意, 开头"
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                提示词要求 *
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="描述对提示词的具体要求，例如：&#10;- 角色设定&#10;- 输出格式&#10;- 风格要求"
                rows={6}
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                参考答案（可选）
              </label>
              <textarea
                value={formData.referenceAnswer}
                onChange={(e) => setFormData({ ...formData, referenceAnswer: e.target.value })}
                placeholder="提供一个优秀的提示词示例..."
                rows={4}
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none font-mono"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  预计完成时间
                </label>
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="例如：30分钟"
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  奖励积分
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleSubmit(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-dark-200 hover:bg-dark-300 text-white font-semibold transition-colors"
              >
                <Save className="w-5 h-5" />
                保存草稿
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Send className="w-5 h-5" />
                提交审核
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};
