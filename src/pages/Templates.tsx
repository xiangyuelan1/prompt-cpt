import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Star, Heart, Copy, Check, Users, Filter } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';
import { clsx } from 'clsx';

export const TemplatesPage: React.FC = () => {
  const { templates, currentUser, toggleFavorite } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = templates.filter(template => {
    const matchSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleCopy = (template: typeof templates[0]) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PageContainer title="模板库" subtitle="浏览和收藏优质提示词模板">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-100 border border-primary-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-dark-100 border border-primary-500/20 text-white focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="all">全部分类</option>
            <option value="writing">写作</option>
            <option value="coding">编程</option>
            <option value="business">商业</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => {
            const isFavorited = currentUser?.favorites.includes(template.id) || false;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-dark-100 rounded-2xl overflow-hidden border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center text-2xl">
                        {template.author.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{template.title}</div>
                        <div className="text-gray-400 text-sm">{template.author.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-300',
                        isFavorited 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-dark-200 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                      )}
                    >
                      <Heart className={clsx('w-5 h-5', isFavorited && 'fill-current')} />
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-primary-500/10 text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-dark-200 rounded-xl p-4 mb-4">
                    <pre className="text-gray-300 text-xs font-mono line-clamp-4 whitespace-pre-wrap">
                      {template.prompt}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-primary-500/10">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {template.usageCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {template.favoriteCount}
                      </span>
                      <span className="flex items-center gap-1 text-accent-gold">
                        <Star className="w-4 h-4 fill-current" />
                        {template.rating}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(template)}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                        copiedId === template.id
                          ? 'bg-accent-emerald/20 text-accent-emerald'
                          : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                      )}
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">没有找到符合条件的模板</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
