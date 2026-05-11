import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronDown, Star, Users, Target, CheckCircle, Play } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useQuestions } from '../contexts/QuestionContext';
import { KnowledgeNode } from '../types/question';
import { clsx } from 'clsx';

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = node.children.length > 0;
  const progress = node.progress?.percentage || 0;

  return (
    <div className="relative">
      <motion.div
        className={clsx(
          'p-4 rounded-xl border transition-all cursor-pointer',
          level === 0 
            ? 'bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border-primary-500/30' 
            : 'bg-dark-100 border-primary-500/10 hover:border-primary-500/30'
        )}
        style={{ marginLeft: `${level * 24}px` }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            
            <div className="text-2xl">{node.icon}</div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">{node.name}</h3>
              <p className="text-gray-400 text-sm">{node.description}</p>
              
              {node.progress && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <div className="w-full bg-dark-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-purple h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-gray-400">{progress}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    已完成 {node.progress.completed}/{node.progress.total}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {node.questionIds.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Target className="w-4 h-4" />
                <span>{node.questionIds.length} 题</span>
              </div>
            )}
            
            {node.children.length === 0 && (
              <button className="px-4 py-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4" />
                开始学习
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const KnowledgeTreePage: React.FC = () => {
  const { knowledgeTree } = useQuestions();

  if (!knowledgeTree) {
    return (
      <PageContainer title="知识树" subtitle="系统学习提示词工程">
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">暂无知识树</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="知识树" subtitle={`学习 ${knowledgeTree.name}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 mb-8 border border-primary-500/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{knowledgeTree.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{knowledgeTree.name}</h1>
              <p className="text-gray-300">{knowledgeTree.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4 bg-dark-100 rounded-xl">
              <div className="text-3xl font-bold text-primary-400 mb-1">
                {knowledgeTree.totalQuestions}
              </div>
              <div className="text-gray-400 text-sm">题目总数</div>
            </div>
            <div className="text-center p-4 bg-dark-100 rounded-xl">
              <div className="text-3xl font-bold text-accent-purple mb-1">
                {knowledgeTree.totalUsers}
              </div>
              <div className="text-gray-400 text-sm">学习人数</div>
            </div>
            <div className="text-center p-4 bg-dark-100 rounded-xl">
              <div className="text-3xl font-bold text-accent-gold mb-1">
                {knowledgeTree.children.length}
              </div>
              <div className="text-gray-400 text-sm">知识模块</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {knowledgeTree.children.map((node) => (
            <TreeNode key={node.id} node={node} level={0} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-accent-gold" />
            推荐学习路径
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-white mb-2">入门路径</h3>
              <p className="text-gray-400 text-sm mb-4">
                适合初学者，从基础概念开始
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>基础概念</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>提示词结构</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>简单实操</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-100 rounded-2xl p-6 border border-primary-500/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">进阶路径</h3>
              <p className="text-gray-400 text-sm mb-4">
                有基础后，提升技巧和能力
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>创意写作</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>技术应用</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-emerald" />
                  <span>高级技巧</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-100 rounded-2xl p-6 border border-accent-gold/30">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">专家路径</h3>
              <p className="text-gray-400 text-sm mb-4">
                成为提示词工程专家
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold" />
                  <span>复杂任务</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold" />
                  <span>多模型协作</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold" />
                  <span>系统设计</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};
