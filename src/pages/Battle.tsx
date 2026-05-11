import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Clock, Zap, X, Trophy, TrendingUp } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useBattle } from '../contexts/BattleContext';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const BattlePage: React.FC = () => {
  const { matchmaking, startMatchmaking, cancelMatchmaking, submitBattlePrompt, getBattleHistory, getBattleStats } = useBattle();
  const { challenges } = useStore();
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [battlePrompt, setBattlePrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastBattle, setLastBattle] = useState<any>(null);

  const stats = getBattleStats();
  const history = getBattleHistory();
  const activeChallenges = challenges.filter(c => c.status === 'active');

  const handleStartBattle = () => {
    if (!selectedChallenge) {
      alert('请选择一个挑战');
      return;
    }
    startMatchmaking(selectedChallenge);
  };

  const handleSubmit = async () => {
    if (!battlePrompt.trim()) {
      alert('请输入你的提示词');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBattlePrompt(selectedChallenge, battlePrompt);
      const updatedHistory = getBattleHistory();
      setLastBattle(updatedHistory[0]);
      setShowResult(true);
      setBattlePrompt('');
      setSelectedChallenge('');
    } catch (error) {
      console.error('Battle submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="对战竞技" subtitle="与AI对手实时PK，提升你的提示词技巧">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Swords className="w-8 h-8 text-primary-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">实时对战</h2>
                  <p className="text-gray-400">选择一个挑战，与AI对手一决高下</p>
                </div>
              </div>

              {!matchmaking.isSearching && !showResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      选择挑战主题
                    </label>
                    <select
                      value={selectedChallenge}
                      onChange={(e) => setSelectedChallenge(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="">请选择挑战</option>
                      {activeChallenges.map(challenge => (
                        <option key={challenge.id} value={challenge.id}>
                          {challenge.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      输入你的提示词
                    </label>
                    <textarea
                      value={battlePrompt}
                      onChange={(e) => setBattlePrompt(e.target.value)}
                      placeholder="在这里编写你的提示词..."
                      className="w-full h-40 px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none font-mono text-sm"
                    />
                  </div>

                  <button
                    onClick={handleStartBattle}
                    disabled={!selectedChallenge || !battlePrompt.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    开始对战
                  </button>
                </div>
              ) : showResult && lastBattle ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">
                    {lastBattle.winner === 'you' ? '🏆' : lastBattle.winner === 'opponent' ? '😅' : '🤝'}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {lastBattle.winner === 'you' ? '恭喜获胜！' : lastBattle.winner === 'opponent' ? '惜败，再接再厉' : '平局'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-6">
                    <div className="bg-dark-200 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">你的得分</div>
                      <div className="text-4xl font-bold text-primary-400">
                        {lastBattle.yourScore}
                      </div>
                    </div>
                    <div className="bg-dark-200 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">对手得分</div>
                      <div className="text-4xl font-bold text-accent-purple">
                        {lastBattle.opponentScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResult(false)}
                      className="flex-1 py-3 rounded-xl bg-primary-500/20 text-primary-400 font-semibold hover:bg-primary-500/30 transition-colors"
                    >
                      再战一局
                    </button>
                    <button
                      onClick={() => navigate('/leaderboard')}
                      className="flex-1 py-3 rounded-xl bg-accent-purple/20 text-accent-purple font-semibold hover:bg-accent-purple/30 transition-colors"
                    >
                      查看排行榜
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-ping" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                      <Users className="w-12 h-12 text-white animate-bounce" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    正在匹配对手...
                  </h3>
                  <p className="text-gray-400 mb-4">
                    已等待 {matchmaking.estimatedWaitTime} 秒
                  </p>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <Clock className="w-4 h-4" />
                    <span>预计等待时间：5-15秒</span>
                  </div>

                  <button
                    onClick={cancelMatchmaking}
                    className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <X className="w-5 h-5" />
                    取消匹配
                  </button>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-accent-gold" />
                对战历史
              </h3>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.slice(0, 5).map((battle) => (
                    <div
                      key={battle.id}
                      className="p-4 bg-dark-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {battle.winner === 'you' ? '🏆' : battle.winner === 'opponent' ? '😅' : '🤝'}
                        </div>
                        <div>
                          <div className="text-white font-medium">vs {battle.opponentName}</div>
                          <div className="text-gray-400 text-sm">
                            {new Date(battle.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-400">
                          {battle.yourScore}
                        </div>
                        <div className="text-xs text-gray-500">
                          vs {battle.opponentScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Swords className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">暂无对战记录</p>
                  <p className="text-gray-500 text-sm mt-1">开始你的第一场对战吧！</p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-accent-gold" />
                对战数据
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-accent-gold/20 to-orange-600/20 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">总对战数</div>
                  <div className="text-3xl font-bold text-white">{stats.totalBattles}</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-accent-emerald/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent-emerald">{stats.wins}</div>
                    <div className="text-xs text-gray-400">胜</div>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
                    <div className="text-xs text-gray-400">负</div>
                  </div>
                  <div className="p-3 bg-gray-500/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">{stats.draws}</div>
                    <div className="text-xs text-gray-400">平</div>
                  </div>
                </div>

                <div className="p-4 bg-dark-200 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">胜率</div>
                  <div className="text-3xl font-bold text-primary-400">{stats.winRate}%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-accent-purple/10 to-primary-500/10 rounded-2xl p-6 border border-primary-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">💡 对战技巧</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  提示词要清晰明确，避免歧义
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  提供具体的约束条件和示例
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  考虑输出格式的规范性
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  测试不同风格的效果
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-emerald">✓</span>
                  参考优秀模板不断优化
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
