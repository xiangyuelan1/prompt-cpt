import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, TrendingUp, ArrowRight, Zap, Star, Swords, GraduationCap, Building, BookOpen } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
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

export const HomePage: React.FC = () => {
  const { challenges, currentUser } = useStore();
  const activeChallenges = challenges.filter(c => c.status === 'active');

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-6">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">实时竞赛平台</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-300 to-accent-purple bg-clip-text text-transparent">
            释放你的AI创造力
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            在这里，通过竞技挑战提升你的提示词技巧，与全球创作者一较高下
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              课程中心
            </Link>
            <Link
              to="/challenges"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Swords className="w-5 h-5" />
              开始挑战
            </Link>
            <Link
              to="/enterprise"
              className="px-8 py-4 rounded-xl bg-dark-100 border border-blue-500/30 text-white font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <Building className="w-5 h-5" />
              企业服务
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/courses"
              className="group bg-dark-300 rounded-xl p-6 border border-dark-400 hover:border-primary hover:shadow-lg transition-all"
            >
              <GraduationCap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                教育培训
              </h3>
              <p className="text-gray-400 text-sm">
                系统学习提示词工程，从入门到精通，快速提升AI应用能力
              </p>
            </Link>
            <Link
              to="/enterprise"
              className="group bg-dark-300 rounded-xl p-6 border border-dark-400 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <Building className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                企业服务
              </h3>
              <p className="text-gray-400 text-sm">
                企业级培训解决方案，提升团队AI应用能力
              </p>
            </Link>
            <Link
              to="/challenges"
              className="group bg-dark-300 rounded-xl p-6 border border-dark-400 hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <Swords className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                竞技挑战
              </h3>
              <p className="text-gray-400 text-sm">
                参与实时竞赛，与全球高手一较高下
              </p>
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { label: '进行中挑战', value: activeChallenges.length, icon: Trophy, color: 'text-primary-400' },
            { label: '总参与人数', value: '10,000+', icon: Users, color: 'text-accent-purple' },
            { label: '提交作品', value: '25,000+', icon: Star, color: 'text-accent-gold' },
            { label: '你的积分', value: currentUser?.points || 0, icon: TrendingUp, color: 'text-accent-emerald' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300"
            >
              <stat.icon className={clsx('w-8 h-8 mb-3', stat.color)} />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent-gold" />
              进行中的挑战
            </h2>
            <Link
              to="/challenges"
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.slice(0, 3).map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/challenges/${challenge.id}`}
                  className="block bg-dark-100 rounded-2xl overflow-hidden border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group"
                >
                  <div className={clsx('h-2 bg-gradient-to-r', categoryColors[challenge.category])} />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={clsx('px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r', categoryColors[challenge.category], 'text-white')}>
                        {categoryLabels[challenge.category]}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        {challenge.participants}人参与
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                      {challenge.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-accent-gold">
                        <Clock className="w-4 h-4" />
                        {dayjs(challenge.endTime).fromNow()}
                      </span>
                      {challenge.prize && (
                        <span className="text-primary-400 font-medium">
                          {challenge.prize}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {currentUser && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-accent-emerald" />
              你的战绩
            </h2>

            <div className="bg-dark-100 rounded-2xl p-8 border border-primary-500/10">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {currentUser.stats.totalSubmissions}
                  </div>
                  <div className="text-gray-400">总提交数</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-gold mb-2">
                    {currentUser.stats.totalWins}
                  </div>
                  <div className="text-gray-400">获得冠军</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2">
                    {currentUser.stats.totalScore.toLocaleString()}
                  </div>
                  <div className="text-gray-400">总积分</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-purple mb-2">
                    #{currentUser.stats.rank}
                  </div>
                  <div className="text-gray-400">当前排名</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-3xl">
                      {currentUser.avatar}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{currentUser.username}</div>
                      <div className="text-gray-400 text-sm">{currentUser.bio}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="px-6 py-3 rounded-xl bg-primary-500/20 text-primary-400 font-semibold hover:bg-primary-500/30 transition-all duration-300"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Star className="w-8 h-8 text-accent-gold" />
            如何参与
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: '选择挑战', desc: '浏览进行中的挑战，选择感兴趣的主题' },
              { step: '02', title: '编写提示词', desc: '使用编辑器编写你的最佳提示词' },
              { step: '03', title: '实时预览', desc: '通过预览功能测试提示词效果' },
              { step: '04', title: '提交参赛', desc: '提交作品，参与排名竞争' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-dark-100 rounded-2xl p-6 border border-primary-500/10"
              >
                <div className="text-5xl font-bold text-primary-500/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                
                {idx < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-primary-500/50" />
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
