import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, ArrowLeft, Star, CheckCircle, Swords, TrendingUp } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';
import { clsx } from 'clsx';

const categoryColors = {
  writing: 'from-purple-500 to-pink-500',
  coding: 'from-blue-500 to-cyan-500',
  business: 'from-orange-500 to-yellow-500',
  creative: 'from-green-500 to-emerald-500'
};

const categoryLabels = {
  writing: '写作',
  coding: '编程',
  business: '商业',
  creative: '创意'
};

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, submissions } = useStore();
  
  const challenge = challenges.find(c => c.id === id);
  
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

  const challengeSubmissions = submissions.filter(s => s.challengeId === challenge.id)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);

  const timeRemaining = dayjs(challenge.endTime).diff(dayjs(), 'hour');
  const isEnding = timeRemaining < 24;

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回挑战列表
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-100 rounded-2xl overflow-hidden border border-primary-500/10"
            >
              <div className={clsx('h-2 bg-gradient-to-r', categoryColors[challenge.category])} />
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className={clsx('px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r', categoryColors[challenge.category], 'text-white')}>
                    {categoryLabels[challenge.category]}
                  </span>
                  <span className={clsx('px-4 py-2 rounded-full text-sm font-medium',
                    challenge.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    challenge.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  )}>
                    {challenge.status === 'active' ? '进行中' : challenge.status === 'upcoming' ? '即将开始' : '已结束'}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  {challenge.title}
                </h1>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {challenge.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span>{challenge.participants} 人参与</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Trophy className="w-5 h-5 text-accent-gold" />
                    <span>{challenge.prize || '荣誉奖励'}</span>
                  </div>
                </div>

                <div className="bg-dark-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className={clsx('w-5 h-5', isEnding ? 'text-red-400' : 'text-accent-gold')} />
                    <div>
                      <div className="text-white font-medium">
                        {challenge.status === 'ended' ? '挑战已结束' : 
                          timeRemaining > 0 ? `剩余 ${Math.floor(timeRemaining / 24)} 天 ${timeRemaining % 24} 小时` : '即将结束'
                        }
                      </div>
                      <div className="text-gray-400 text-sm">
                        {dayjs(challenge.startTime).format('MM-DD HH:mm')} - {dayjs(challenge.endTime).format('MM-DD HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>

                {challenge.status !== 'ended' && (
                  <Link
                    to={`/challenges/${challenge.id}/editor`}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <Swords className="w-5 h-5" />
                    立即参赛
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-100 rounded-2xl p-8 border border-primary-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-accent-emerald" />
                提交要求
              </h2>

              <div className="space-y-4">
                {challenge.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-accent-emerald" />
                    </div>
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-100 rounded-2xl p-8 border border-primary-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-accent-gold" />
                评分标准
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-white font-medium">清晰度</span>
                  </div>
                  <span className="text-primary-400 font-bold">{challenge.scoringCriteria.clarity}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-white font-medium">创意性</span>
                  </div>
                  <span className="text-primary-400 font-bold">{challenge.scoringCriteria.creativity}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-white font-medium">实用性</span>
                  </div>
                  <span className="text-primary-400 font-bold">{challenge.scoringCriteria.practicality}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-white font-medium">社区投票</span>
                  </div>
                  <span className="text-primary-400 font-bold">{challenge.scoringCriteria.communityVote}%</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-primary-500/10">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500/20 to-accent-purple/20 rounded-xl">
                  <span className="text-white font-semibold">AI评分权重</span>
                  <span className="text-2xl font-bold text-primary-400">60%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl mt-3">
                  <span className="text-white font-semibold">社区投票权重</span>
                  <span className="text-2xl font-bold text-pink-400">40%</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent-gold" />
                实时排行榜
              </h2>

              {challengeSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {challengeSubmissions.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
                        idx === 0 ? 'bg-accent-gold/20 border border-accent-gold/30' :
                        idx === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                        idx === 2 ? 'bg-orange-600/20 border border-orange-600/30' :
                        'bg-dark-200 hover:bg-dark-200/80'
                      )}
                    >
                      <div className={clsx(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        idx === 0 ? 'bg-accent-gold text-dark-200' :
                        idx === 1 ? 'bg-gray-400 text-white' :
                        idx === 2 ? 'bg-orange-600 text-white' :
                        'bg-dark-300 text-gray-400'
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          用户 {sub.userId.slice(-4)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {sub.votes} 票 · {sub.scores.totalScore.toFixed(1)} 分
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">暂无提交</p>
                  <p className="text-gray-500 text-sm mt-1">成为第一个参与者吧！</p>
                </div>
              )}

              {challengeSubmissions.length > 0 && (
                <Link
                  to="/leaderboard"
                  className="block mt-4 text-center text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  查看完整排行榜 →
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-6 border border-primary-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">💡 提示</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  使用具体的指令和约束条件
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  提供清晰的输出格式示例
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  考虑提示词的泛化能力
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  测试不同场景的效果
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
