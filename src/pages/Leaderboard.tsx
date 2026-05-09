import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Star, Users, Filter } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

export const LeaderboardPage: React.FC = () => {
  const { submissions, currentUser } = useStore();
  const [filterChallenge, setFilterChallenge] = useState('all');

  const allSubmissions = [...submissions].sort((a, b) => b.scores.totalScore - a.scores.totalScore);

  const topSubmissions = allSubmissions.slice(0, 100);

  const userRank = currentUser 
    ? allSubmissions.findIndex(s => s.userId === currentUser.id) + 1 
    : null;

  return (
    <PageContainer title="排行榜" subtitle="查看实时排名和优秀作品">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topSubmissions.slice(0, 3).map((sub, idx) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={clsx(
                'rounded-2xl p-8 text-center border-2',
                idx === 0 && 'bg-gradient-to-br from-accent-gold/20 to-orange-600/20 border-accent-gold/50 order-first md:-mt-8',
                idx === 1 && 'bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-400/50',
                idx === 2 && 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-600/50'
              )}
            >
              <div className={clsx(
                'w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4',
                idx === 0 && 'bg-gradient-to-br from-accent-gold to-orange-500 shadow-lg shadow-accent-gold/30',
                idx === 1 && 'bg-gradient-to-br from-gray-300 to-gray-500',
                idx === 2 && 'bg-gradient-to-br from-orange-400 to-orange-600'
              )}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                #{idx + 1}
              </div>
              
              <div className="text-xl font-bold text-white mb-1">
                用户 {sub.userId.slice(-4)}
              </div>
              
              <div className="text-3xl font-bold text-primary-400 mb-2">
                {sub.scores.totalScore.toFixed(1)} 分
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {sub.votes} 票
                </span>
                <span>
                  AI: {sub.scores.aiScore.toFixed(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {userRank && userRank > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  #{userRank}
                </div>
                <div>
                  <div className="text-white font-semibold">你的当前排名</div>
                  <div className="text-gray-400 text-sm">继续加油，还有{userRank - 1}位用户在你前面</div>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-primary-400" />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-dark-100 rounded-2xl border border-primary-500/10 overflow-hidden"
        >
          <div className="bg-dark-200 px-6 py-4 border-b border-primary-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal className="w-6 h-6 text-accent-gold" />
                <h2 className="text-xl font-bold text-white">完整排名</h2>
              </div>
              <span className="text-gray-400 text-sm">
                共 {topSubmissions.length} 个作品
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200">
                <tr className="text-left text-gray-400 text-sm">
                  <th className="px-6 py-4 font-medium">排名</th>
                  <th className="px-6 py-4 font-medium">用户</th>
                  <th className="px-6 py-4 font-medium">总分</th>
                  <th className="px-6 py-4 font-medium">AI评分</th>
                  <th className="px-6 py-4 font-medium">投票数</th>
                  <th className="px-6 py-4 font-medium">提交时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-500/10">
                {topSubmissions.map((sub, idx) => {
                  const isCurrentUser = currentUser?.id === sub.userId;
                  
                  return (
                    <tr
                      key={sub.id}
                      className={clsx(
                        'hover:bg-dark-200/50 transition-colors',
                        isCurrentUser && 'bg-primary-500/10'
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            idx === 0 && 'bg-accent-gold text-dark-200',
                            idx === 1 && 'bg-gray-400 text-white',
                            idx === 2 && 'bg-orange-600 text-white',
                            idx > 2 && 'bg-dark-300 text-gray-400'
                          )}>
                            {idx + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-lg">
                            🤖
                          </div>
                          <div>
                            <div className={clsx(
                              'font-semibold',
                              isCurrentUser ? 'text-primary-400' : 'text-white'
                            )}>
                              用户 {sub.userId.slice(-4)}
                              {isCurrentUser && <span className="ml-2 text-xs">(你)</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold text-primary-400">
                          {sub.scores.totalScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">
                          {sub.scores.aiScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-300">
                          <Star className="w-4 h-4 text-accent-gold fill-current" />
                          {sub.votes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {topSubmissions.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">暂无排名数据</p>
              <p className="text-gray-500 text-sm mt-2">快去参加挑战吧！</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
};
