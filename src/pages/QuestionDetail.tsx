import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Clock, Users, Target, MessageSquare, Send, ThumbsUp, Award } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useQuestions } from '../contexts/QuestionContext';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { clsx } from 'clsx';

dayjs.extend(relativeTime);

export const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { questions, getDiscussionsByQuestion, addDiscussion, likeQuestion, starQuestion } = useQuestions();
  
  const question = questions.find(q => q.id === id);
  const discussions = getDiscussionsByQuestion(id || '');
  
  const [newComment, setNewComment] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  if (!question) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">题目不存在</p>
          <Link to="/questions" className="text-primary-400 hover:underline mt-4 inline-block">
            返回题库
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleSubmitComment = () => {
    if (!isAuthenticated || !user || !newComment.trim()) return;
    
    addDiscussion({
      questionId: question.id,
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      content: newComment,
      isPinned: false,
      isOfficial: false
    });
    
    setNewComment('');
  };

  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-orange-400 bg-orange-400/10',
    expert: 'text-red-400 bg-red-400/10'
  };

  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家'
  };

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link
            to="/questions"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回题库
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-100 rounded-2xl p-8 border border-primary-500/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', difficultyColors[question.difficulty])}>
                    {difficultyLabels[question.difficulty]}
                  </span>
                  {question.metadata.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent-gold/20 text-accent-gold">
                      ⭐ 精选
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likeQuestion(question.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{question.stats.likes}</span>
                  </button>
                  <button
                    onClick={() => starQuestion(question.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold transition-colors"
                  >
                    <Star className="w-5 h-5" />
                    <span>{question.stats.stars}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {question.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-lg">
                    {question.authorAvatar}
                  </div>
                  <span className="text-gray-300">{question.authorName}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">
                  {dayjs(question.createdAt).fromNow()}
                </span>
              </div>

              <p className="text-gray-300 text-lg mb-6">
                {question.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-primary-500/10 text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-dark-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent-emerald" />
                  提示词要求
                </h3>
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {question.prompt}
                </pre>
              </div>

              {question.referenceAnswer && (
                <div>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-3"
                  >
                    <Award className="w-5 h-5" />
                    {showAnswer ? '隐藏参考答案' : '查看参考答案'}
                  </button>
                  
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-bold text-accent-gold mb-3">参考答案</h3>
                      <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                        {question.referenceAnswer}
                      </pre>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-accent-purple" />
                <h2 className="text-xl font-bold text-white">社区讨论</h2>
                <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm">
                  {discussions.length}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="发表你的看法或分享经验..."
                    className="w-full h-24 px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="mt-3 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    发布评论
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-dark-200 rounded-xl text-center">
                  <Link to="/auth" className="text-primary-400 hover:text-primary-300">
                    登录后参与讨论
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className={clsx(
                      'p-4 bg-dark-200 rounded-xl',
                      discussion.isPinned && 'border border-accent-gold/30'
                    )}
                  >
                    {discussion.isPinned && (
                      <div className="text-xs text-accent-gold mb-2">📌 精华评论</div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-xl">
                        {discussion.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{discussion.authorName}</span>
                          {discussion.isOfficial && (
                            <span className="px-2 py-0.5 rounded text-xs bg-primary-500/20 text-primary-400">
                              官方
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">
                            {dayjs(discussion.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{discussion.content}</p>
                        <button
                          onClick={() => {}}
                          className="flex items-center gap-1 text-gray-400 hover:text-primary-400 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {discussions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">暂无讨论</p>
                    <p className="text-gray-500 text-sm mt-1">成为第一个参与者吧！</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">题目信息</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">尝试次数</span>
                  <span className="text-white font-semibold">{question.stats.attempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">平均分</span>
                  <span className="text-white font-semibold">{question.stats.averageScore.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">预计时间</span>
                  <span className="text-white font-semibold">{question.metadata.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">奖励积分</span>
                  <span className="text-accent-gold font-semibold">+{question.metadata.points}</span>
                </div>
              </div>

              <Link
                to={`/editor/${question.id}`}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                开始挑战
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-accent-purple/10 to-primary-500/10 rounded-2xl p-6 border border-primary-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-3">💡 提示</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  仔细阅读题目要求
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  参考优秀提示词模板
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  多测试不同场景
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  参考社区讨论
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
