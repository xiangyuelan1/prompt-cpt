import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Swords, BookOpen, BarChart3, User } from 'lucide-react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页', icon: Swords },
    { path: '/challenges', label: '挑战', icon: Trophy },
    { path: '/templates', label: '模板库', icon: BookOpen },
    { path: '/leaderboard', label: '排行榜', icon: BarChart3 },
  ];

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

          <nav className="hidden md:flex items-center gap-2">
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

          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-100 hover:bg-primary-500/20 transition-all duration-300"
          >
            <User className="w-5 h-5 text-primary-400" />
            <span className="hidden sm:inline text-gray-300">个人中心</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
