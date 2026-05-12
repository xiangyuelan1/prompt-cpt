import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Swords, BookOpen, BarChart3, User, Zap, Settings, BookMarked, GraduationCap, Building, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navItems = [
    { path: '/', label: '首页', icon: Swords },
    { path: '/courses', label: '课程中心', icon: GraduationCap },
    { path: '/challenges', label: '题库', icon: BookMarked },
    { path: '/knowledge', label: '知识树', icon: BookOpen },
    { path: '/battle', label: '真人PK', icon: Zap },
    { path: '/templates', label: '模板库', icon: BookOpen },
    { path: '/leaderboard', label: '排行榜', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-200/95 backdrop-blur-md border-b border-primary-500/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
              PromptArena
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || 
                (path !== '/' && location.pathname.startsWith(path));
              
              return (
                <Link
                  key={path}
                  to={path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                    'hover:bg-primary-500/10',
                    isActive 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/enterprise"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all duration-300"
              >
                <Building className="w-5 h-5" />
                <span className="hidden sm:inline">企业后台</span>
              </Link>
            )}
            {isAuthenticated && user?.email === 'admin@admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">管理</span>
              </Link>
            )}

            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
              >
                登录 / 注册
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-100 hover:bg-primary-500/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <span className="hidden sm:inline text-gray-300">{user.username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-300 rounded-lg shadow-xl border border-dark-400 py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      个人中心
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-dark-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
