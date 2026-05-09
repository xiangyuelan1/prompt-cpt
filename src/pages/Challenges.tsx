import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Filter, Search } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type { ChallengeCategory, ChallengeStatus } from '../types/challenge';

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

const statusLabels = {
  upcoming: '即将开始',
  active: '进行中',
  ended: '已结束'
};

const statusColors = {
  upcoming: 'text-blue-400',
  active: 'text-green-400',
  ended: 'text-gray-400'
};

export const ChallengesPage: React.FC = () => {
  const { challenges } = useStore();
  const [filterCategory, setFilterCategory] = useState<ChallengeCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ChallengeStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChallenges = challenges.filter(challenge => {
    const matchCategory = filterCategory === 'all' || challenge.category === filterCategory;
    const matchStatus = filterStatus === 'all' || challenge.status === filterStatus;
    const matchSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <PageContainer title="挑战中心" subtitle="参与挑战，提升你的提示词技巧">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索挑战..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-100 border border-primary-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ChallengeCategory | 'all')}
              className="px-4 py-3 rounded-xl bg-dark-100 border border-primary-500/20 text-white focus:outline-none focus:border-primary-500 transition-colors"
            >
              <option value="all">全部分类</option>
              <option value="writing">写作</option>
              <option value="coding">编程</option>
              <option value="business">商业</option>
              <option value="creative">创意</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ChallengeStatus | 'all')}
              className="px-4 py-3 rounded-xl bg-dark-100 border border-primary-500/20 text-white focus:outline-none focus:border-primary-500 transition-colors"
            >
              <option value="all">全部状态</option>
              <option value="active">进行中</option>
              <option value="upcoming">即将开始</option>
              <option value="ended">已结束</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, idx) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
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
                    <span className={clsx('px-3 py-1 rounded-full text-xs font-medium bg-dark-200', statusColors[challenge.status])}>
                      {statusLabels[challenge.status]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {challenge.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants} 人参与</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {challenge.status === 'ended' 
                          ? `已于 ${dayjs(challenge.endTime).format('MM-DD HH:mm')} 结束`
                          : `${dayjs(challenge.startTime).format('MM-DD HH:mm')} - ${dayjs(challenge.endTime).format('MM-DD HH:mm')}`
                        }
                      </span>
                    </div>
                  </div>

                  {challenge.prize && challenge.status !== 'ended' && (
                    <div className="pt-4 border-t border-primary-500/10">
                      <div className="flex items-center gap-2 text-sm text-accent-gold">
                        <Trophy className="w-4 h-4" />
                        <span className="font-medium">{challenge.prize}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-primary-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {challenge.requirements.slice(0, 2).map((req, i) => (
                          <span key={i} className="px-2 py-1 rounded text-xs bg-primary-500/10 text-primary-300">
                            {req.slice(0, 15)}...
                          </span>
                        ))}
                      </div>
                      <span className="text-primary-400 text-sm font-medium group-hover:underline">
                        查看详情 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">没有找到符合条件的挑战</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
