import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Globe, Shield, Database, Bell, Save, Check } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../contexts/AuthContext';

interface AIConfig {
  provider: 'openai' | 'anthropic' | 'azure' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface PlatformConfig {
  siteName: string;
  siteDescription: string;
  allowUserQuestions: boolean;
  requireApproval: boolean;
  defaultPoints: number;
  maintenanceMode: boolean;
}

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'openai',
    apiKey: localStorage.getItem('ai-api-key') || '',
    baseUrl: localStorage.getItem('ai-base-url') || 'https://api.openai.com/v1',
    model: localStorage.getItem('ai-model') || 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 2000
  });

  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    siteName: 'PromptArena',
    siteDescription: '提示词竞赛平台 - 释放AI创造力',
    allowUserQuestions: true,
    requireApproval: true,
    defaultPoints: 100,
    maintenanceMode: false
  });

  if (user?.email !== 'admin@admin') {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">访问被拒绝</h2>
          <p className="text-gray-400">您没有管理员权限</p>
        </div>
      </PageContainer>
    );
  }

  const handleSaveAI = () => {
    localStorage.setItem('ai-api-key', aiConfig.apiKey);
    localStorage.setItem('ai-base-url', aiConfig.baseUrl);
    localStorage.setItem('ai-model', aiConfig.model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePlatform = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageContainer title="管理员设置" subtitle="配置平台和AI模型">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-100 rounded-2xl border border-primary-500/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 px-6 py-4 border-b border-primary-500/20">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-bold text-white">AI模型配置</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  AI服务商
                </label>
                <select
                  value={aiConfig.provider}
                  onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value as any })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="openai">OpenAI (GPT)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="azure">Azure OpenAI</option>
                  <option value="custom">自定义API</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  模型名称
                </label>
                <input
                  type="text"
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                  placeholder="gpt-3.5-turbo"
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={aiConfig.baseUrl}
                onChange={(e) => setAiConfig({ ...aiConfig, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature: {aiConfig.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  最大Token数
                </label>
                <input
                  type="number"
                  value={aiConfig.maxTokens}
                  onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAI}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? '已保存' : '保存AI配置'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-100 rounded-2xl border border-primary-500/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-accent-purple/10 to-accent-gold/10 px-6 py-4 border-b border-primary-500/20">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-accent-purple" />
              <h2 className="text-xl font-bold text-white">平台配置</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  网站名称
                </label>
                <input
                  type="text"
                  value={platformConfig.siteName}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, siteName: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  默认积分
                </label>
                <input
                  type="number"
                  value={platformConfig.defaultPoints}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, defaultPoints: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                网站描述
              </label>
              <textarea
                value={platformConfig.siteDescription}
                onChange={(e) => setPlatformConfig({ ...platformConfig, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/20 rounded-xl text-white focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platformConfig.allowUserQuestions}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, allowUserQuestions: e.target.checked })}
                  className="w-5 h-5 rounded border-primary-500/30 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-white">允许用户创建题目</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platformConfig.requireApproval}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, requireApproval: e.target.checked })}
                  className="w-5 h-5 rounded border-primary-500/30 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-white">用户题目需要审核</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platformConfig.maintenanceMode}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 rounded border-primary-500/30 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-white">维护模式</span>
              </label>
            </div>

            <button
              onClick={handleSavePlatform}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-purple hover:bg-accent-purple/80 text-white font-semibold transition-all"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? '已保存' : '保存平台配置'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-100 rounded-2xl border border-primary-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-accent-emerald" />
            <h2 className="text-xl font-bold text-white">数据管理</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
              导出所有数据
            </button>
            <button className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors">
              清理缓存
            </button>
            <button className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors">
              查看日志
            </button>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};
