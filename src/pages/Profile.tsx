import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, Heart, Calendar, Target, Zap } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';
import { clsx } from 'clsx';

export const ProfilePage: React.FC = () => {
  const { currentUser, achievements, submissions, templates } = useStore();

  if (!currentUser) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">请先登录</p>
        </div>
      </PageContainer>
    );
  }

  const userAchievements = achievements.filter(a => currentUser.achievements.includes(a.id));
  const favoriteTemplates = templates.filter(t => currentUser.favorites.includes(t.id));

  return (
    <PageContainer title="个人中心" subtitle="管理你的成就和数据">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 mb-8 border border-primary-500/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-6xl shadow-xl shadow-primary-500/30"
            >
              {currentUser.avatar}
            </motion.div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {currentUser.username}
              </h1>
              <p className="text-gray-400 mb-4">{currentUser.bio}</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>加入于 {dayjs(currentUser.joinedAt).format('YYYY-MM-DD')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: Trophy, value: currentUser.stats.totalWins, label: '冠军', color: 'text-accent-gold' },
                { icon: Star, value: currentUser.stats.totalSubmissions, label: '提交', color: 'text-primary-400' },
                { icon: TrendingUp, value: currentUser.points, label: '积分', color: 'text-accent-emerald' },
                { icon: Award, value: `#${currentUser.stats.rank}`, label: '排名', color: 'text-accent-purple' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-dark-100 rounded-xl px-6 py-4 text-center min-w-[100px]">
                  <stat.icon className={clsx('w-6 h-6 mx-auto mb-2', stat.color)} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-accent-gold" />
              <h2 className="text-2xl font-bold text-white">我的成就</h2>
              <span className="px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-sm">
                {userAchievements.length} / {achievements.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const isUnlocked = currentUser.achievements.includes(achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={clsx(
                      'p-4 rounded-xl border-2 transition-all duration-300',
                      isUnlocked
                        ? 'bg-gradient-to-br from-accent-gold/20 to-orange-600/20 border-accent-gold/50'
                        : 'bg-dark-200 border-primary-500/10 opacity-50'
                    )}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className={clsx(
                      'font-semibold mb-1',
                      isUnlocked ? 'text-white' : 'text-gray-500'
                    )}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {achievement.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3 text-accent-gold" />
                      <span className="text-accent-gold">+{achievement.points} 积分</span>
                    </div>
                    {!isUnlocked && (
                      <div className="mt-2 text-xs text-gray-500">
                        {achievement.requirement.type === 'submission' && `需提交 ${achievement.requirement.threshold} 次`}
                        {achievement.requirement.type === 'win' && `需获得 ${achievement.requirement.threshold} 次冠军`}
                        {achievement.requirement.type === 'score' && `需获得 ${achievement.requirement.threshold} 分`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">收藏的模板</h2>
              <span className="px-3 py-1 rounded-full bg-red-400/20 text-red-400 text-sm">
                {favoriteTemplates.length}
              </span>
            </div>

            {favoriteTemplates.length > 0 ? (
              <div className="space-y-4">
                {favoriteTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-dark-200 rounded-xl hover:bg-dark-200/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center text-xl">
                        {template.author.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white mb-1">{template.title}</div>
                        <div className="text-sm text-gray-400 line-clamp-2">
                          {template.description}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{template.usageCount} 使用</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-accent-gold fill-current" />
                            {template.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">暂无收藏</p>
                <p className="text-gray-500 text-sm mt-1">去模板库发现优质内容</p>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-bold text-white">我的提交</h2>
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm">
              {submissions.length}
            </span>
          </div>

          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.slice(0, 5).map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-4 bg-dark-200 rounded-xl hover:bg-dark-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        sub.rank === 1 && 'bg-accent-gold text-dark-200',
                        sub.rank === 2 && 'bg-gray-400 text-white',
                        sub.rank === 3 && 'bg-orange-600 text-white',
                        sub.rank > 3 && 'bg-dark-300 text-gray-400'
                      )}>
                        #{sub.rank}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          挑战 #{sub.challengeId}
                        </div>
                        <div className="text-xs text-gray-400">
                          {dayjs(sub.submittedAt).format('MM-DD HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-400">
                        {sub.scores.totalScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">总分</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-primary-500/10">
                    <pre className="text-gray-300 text-xs font-mono line-clamp-2 whitespace-pre-wrap">
                      {sub.prompt}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">暂无提交</p>
              <p className="text-gray-500 text-sm mt-1">去参加挑战吧！</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
};
