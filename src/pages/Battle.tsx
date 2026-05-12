import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Clock, Zap, X, Trophy, TrendingUp, CheckCircle, UserPlus, Wifi } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useBattle } from '../contexts/BattleContext';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

type BattleStep = 'select' | 'matchmaking' | 'battle' | 'result';

export const BattlePage: React.FC = () => {
  const { matchmaking, startMatchmaking, cancelMatchmaking, submitBattlePrompt, getBattleHistory, getBattleStats } = useBattle();
  const { challenges } = useStore();
  const navigate = useNavigate();
  const [battleStep, setBattleStep] = useState<BattleStep>('select');
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [battlePrompt, setBattlePrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastBattle, setLastBattle] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState(127);

  const stats = getBattleStats();
  const history = getBattleHistory();
  const activeChallenges = challenges.filter(c => c.status === 'active');

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(100, Math.min(200, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMatchmaking = () => {
    if (!selectedChallenge) {
      alert('请选择一个挑战主题');
      return;
    }
    setBattleStep('matchmaking');
    startMatchmaking(selectedChallenge);
    setTimeout(() => {
      setBattleStep('battle');
    }, 3000);
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
      setBattleStep('result');
      setBattlePrompt('');
    } catch (error) {
      console.error('Battle submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setBattleStep('select');
    setSelectedChallenge('');
    setBattlePrompt('');
    setLastBattle(null);
  };

  return (
    <PageContainer title="对战竞技" subtitle="与AI对手实时PK，提升你的提示词技巧">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 rounded-xl p-4 mb-6 border border-primary-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-accent-emerald" />
              <span className="text-gray-300">同时在线</span>
              <span className="text-white font-bold text-xl">{onlineUsers}</span>
              <span className="text-gray-400">人</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">系统正常</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { step: 1, label: '选择主题', icon: CheckCircle },
              { step: 2, label: '匹配对手', icon: UserPlus },
              { step: 3, label: '答题挑战', icon: Swords },
              { step: 4, label: '查看结果', icon: Trophy },
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = battleStep === 'select' && item.step === 1 ||
                              battleStep === 'matchmaking' && item.step === 2 ||
                              battleStep === 'battle' && item.step === 3 ||
                              battleStep === 'result' && item.step === 4;
              const isCompleted = (battleStep === 'matchmaking' && item.step < 2) ||
                                (battleStep === 'battle' && item.step < 3) ||
                                (battleStep === 'result' && item.step < 4);

              return (
                <React.Fragment key={item.step}>
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                      isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' :
                      isCompleted ? 'bg-accent-emerald text-white' :
                      'bg-dark-400 text-gray-500'
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className={clsx(
                      'mt-2 text-sm font-medium',
                      isActive ? 'text-primary-400' : isCompleted ? 'text-accent-emerald' : 'text-gray-500'
                    )}>
                      {item.label}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={clsx(
                      'flex-1 h-1 mx-4 rounded-full transition-all',
                      isCompleted ? 'bg-accent-emerald' : 'bg-dark-400'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {battleStep === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Swords className="w-8 h-8 text-primary-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">选择挑战主题</h2>
                    <p className="text-gray-400">选择一个主题开始匹配对手</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      挑战主题
                    </label>
                    <select
                      value={selectedChallenge}
                      onChange={(e) => setSelectedChallenge(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="">请选择挑战主题</option>
                      {activeChallenges.map(challenge => (
                        <option key={challenge.id} value={challenge.id}>
                          {challenge.title} - {challenge.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedChallenge && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-dark-200 rounded-xl p-4"
                    >
                      <h4 className="text-white font-semibold mb-2">
                        {activeChallenges.find(c => c.id === selectedChallenge)?.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        {activeChallenges.find(c => c.id === selectedChallenge)?.description}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-500">
                          参与人数：{activeChallenges.find(c => c.id === selectedChallenge)?.participants}
                        </span>
                        <span className="text-accent-gold">
                          奖励：{activeChallenges.find(c => c.id === selectedChallenge)?.prize}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={handleStartMatchmaking}
                    disabled={!selectedChallenge}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    开始匹配对手
                  </button>
                </div>
              </motion.div>
            )}

            {battleStep === 'matchmaking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-12 border border-primary-500/20 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-ping opacity-20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                    <Users className="w-16 h-16 text-white animate-bounce" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  正在为你匹配对手...
                </h3>
                <p className="text-gray-400 mb-8">
                  正在搜索与你水平相近的对手
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>预计等待时间：3-8秒</span>
                </div>

                <button
                  onClick={() => {
                    cancelMatchmaking();
                    setBattleStep('select');
                  }}
                  className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2 mx-auto"
                >
                  <X className="w-5 h-5" />
                  取消匹配
                </button>
              </motion.div>
            )}

            {battleStep === 'battle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Swords className="w-8 h-8 text-primary-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">对战挑战</h2>
                    <p className="text-gray-400">编写最佳提示词，击败你的对手</p>
                  </div>
                </div>

                {selectedChallenge && (
                  <div className="bg-accent-emerald/10 border border-accent-emerald/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-accent-emerald">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">匹配成功！</span>
                    </div>
                    <p className="text-gray-300 mt-2">
                      对手：<span className="text-white font-semibold">AI-Battle-Bot #{Math.floor(Math.random() * 9999)}</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      挑战主题：{activeChallenges.find(c => c.id === selectedChallenge)?.title}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      随机抽取题目
                    </label>
                    <div className="bg-dark-200 rounded-xl p-4 border border-primary-500/20">
                      <p className="text-white font-medium mb-2">
                        {activeChallenges.find(c => c.id === selectedChallenge)?.title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {activeChallenges.find(c => c.id === selectedChallenge)?.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      你的提示词
                    </label>
                    <textarea
                      value={battlePrompt}
                      onChange={(e) => setBattlePrompt(e.target.value)}
                      placeholder="在这里编写你的提示词，记住要清晰、具体、有创意..."
                      className="w-full h-48 px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none font-mono text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!battlePrompt.trim() || isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-emerald to-green-500 text-white font-bold hover:shadow-lg hover:shadow-accent-emerald/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    {isSubmitting ? '提交中...' : '提交挑战'}
                  </button>
                </div>
              </motion.div>
            )}

            {battleStep === 'result' && lastBattle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20"
              >
                <div className="text-center mb-8">
                  <div className="text-8xl mb-6">
                    {lastBattle.winner === 'you' ? '🏆' : lastBattle.winner === 'opponent' ? '😅' : '🤝'}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">
                    {lastBattle.winner === 'you' ? '恭喜获胜！' : lastBattle.winner === 'opponent' ? '惜败，再接再厉' : '平局'}
                  </h3>
                  <p className="text-gray-400">
                    {lastBattle.winner === 'you' ? '你击败了对手，展现了出色的提示词技巧！' : '这次略有遗憾，下次一定能赢！'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                  <div className="bg-dark-200 rounded-xl p-6 text-center">
                    <div className="text-sm text-gray-400 mb-2">你的得分</div>
                    <div className="text-5xl font-bold text-accent-emerald">
                      {lastBattle.yourScore}
                    </div>
                  </div>
                  <div className="bg-dark-200 rounded-xl p-6 text-center">
                    <div className="text-sm text-gray-400 mb-2">对手得分</div>
                    <div className="text-5xl font-bold text-accent-purple">
                      {lastBattle.opponentScore}
                    </div>
                  </div>
                </div>

                <div className="bg-dark-200 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold mb-3">对战详情</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">挑战主题</span>
                      <span className="text-white">{activeChallenges.find(c => c.id === selectedChallenge)?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">对战时间</span>
                      <span className="text-white">{new Date(lastBattle.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">得分差距</span>
                      <span className={lastBattle.winner === 'you' ? 'text-accent-emerald' : 'text-accent-purple'}>
                        {Math.abs(lastBattle.yourScore - lastBattle.opponentScore)} 分
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Swords className="w-5 h-5" />
                    再战一局
                  </button>
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex-1 py-4 rounded-xl bg-accent-purple/20 text-accent-purple font-semibold hover:bg-accent-purple/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    查看排行榜
                  </button>
                </div>
              </motion.div>
            )}

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
