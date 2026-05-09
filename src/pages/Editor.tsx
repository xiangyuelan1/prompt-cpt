import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, RefreshCw, Eye, Code, Copy, Check, Sparkles, TrendingUp } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, addSubmission, generatePreview, calculateAIScore, currentUser } = useStore();
  
  const challenge = challenges.find(c => c.id === id);
  
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [estimatedScore, setEstimatedScore] = useState<{
    clarity: number;
    creativity: number;
    practicality: number;
    total: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (challenge && prompt.length > 10) {
      const timer = setTimeout(() => {
        handlePreview();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [prompt, challenge]);

  const handlePreview = async () => {
    if (!challenge || prompt.length < 10) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPreview = generatePreview(prompt, challenge.category);
    setPreview(newPreview);
    
    const aiScore = calculateAIScore(prompt, newPreview);
    setEstimatedScore({
      clarity: Math.random() * 20 + 80,
      creativity: Math.random() * 20 + 80,
      practicality: Math.random() * 30 + 70,
      total: aiScore
    });
    
    setShowScore(true);
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    if (!challenge || !currentUser || prompt.length < 10) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addSubmission({
      challengeId: challenge.id,
      userId: currentUser.id,
      prompt,
      preview,
      scores: {
        aiScore: estimatedScore?.total || 75,
        communityScore: 0,
        totalScore: estimatedScore?.total || 75
      },
      votes: 0,
      rank: 1
    });

    setIsSubmitting(false);
    navigate(`/challenges/${challenge.id}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!challenge) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">挑战不存在</p>
          <Link to="/challenges" className="text-primary-400 hover:underline mt-4 inline-block">
            返回挑战列表
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-dark-200 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/challenges/${id}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回挑战详情
          </Link>

          <div className="text-right">
            <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
            <p className="text-gray-400 text-sm">实时预览 · 边写边测</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-100 rounded-2xl border border-primary-500/10 overflow-hidden"
          >
            <div className="bg-dark-200 px-6 py-4 border-b border-primary-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-primary-400" />
                <span className="text-white font-semibold">提示词编辑器</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-all duration-300"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copied ? '已复制' : '复制'}</span>
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="在这里编写你的提示词...\n\n例如：\n你是一位资深作家。请根据用户的主题，创作一段引人入胜的故事开头。要求：\n1. 包含场景描写\n2. 塑造鲜明人物\n3. 营造紧张氛围"
                className="w-full h-96 bg-dark-200 text-white placeholder-gray-500 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm leading-relaxed"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {prompt.length} 字符
                </div>
                <button
                  onClick={handlePreview}
                  disabled={prompt.length < 10 || isGenerating}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                    prompt.length >= 10
                      ? 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30'
                      : 'bg-dark-300 text-gray-500 cursor-not-allowed'
                  )}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      预览效果
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-dark-100 rounded-2xl border border-primary-500/10 overflow-hidden">
              <div className="bg-dark-200 px-6 py-4 border-b border-primary-500/10">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-accent-emerald" />
                  <span className="text-white font-semibold">实时预览输出</span>
                </div>
              </div>

              <div className="p-6">
                {preview ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-dark-200 rounded-xl p-6 min-h-80"
                  >
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {preview}
                    </pre>
                  </motion.div>
                ) : (
                  <div className="bg-dark-200 rounded-xl p-6 min-h-80 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">开始编写提示词，实时预览效果</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showScore && estimatedScore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-100 rounded-2xl border border-primary-500/10 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-accent-gold" />
                  <span className="text-white font-semibold">预估评分</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">清晰度</span>
                      <span className="text-white font-semibold">{estimatedScore.clarity.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${estimatedScore.clarity}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">创意性</span>
                      <span className="text-white font-semibold">{estimatedScore.creativity.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${estimatedScore.creativity}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">实用性</span>
                      <span className="text-white font-semibold">{estimatedScore.practicality.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${estimatedScore.practicality}%` }}
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-primary-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">总分</span>
                      <span className="text-3xl font-bold text-primary-400">
                        {estimatedScore.total.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      * 最终得分将结合AI评分(60%)和社区投票(40%)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={prompt.length < 10 || isSubmitting}
              className={clsx(
                'w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300',
                prompt.length >= 10 && !isSubmitting
                  ? 'bg-gradient-to-r from-accent-emerald to-primary-500 hover:shadow-lg hover:shadow-accent-emerald/30 text-white transform hover:scale-105'
                  : 'bg-dark-300 text-gray-500 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  提交参赛
                </>
              )}
            </button>

            {prompt.length < 10 && (
              <p className="text-center text-gray-500 text-sm">
                请至少输入10个字符的提示词
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
