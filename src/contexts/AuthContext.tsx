import React, { useState, createContext, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  experience: number;
  stats: {
    totalSubmissions: number;
    totalWins: number;
    totalBattles: number;
    winRate: number;
    rating: number;
  };
  achievements: string[];
  points: number;
  favorites: string[];
  joinedAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'prompt-arena-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        userData.joinedAt = new Date(userData.joinedAt);
        userData.lastLogin = new Date(userData.lastLogin);
        setUser(userData);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUsers = JSON.parse(localStorage.getItem('prompt-arena-users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('邮箱或密码错误');
    }

    const userData: User = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      avatar: foundUser.avatar || '🤖',
      level: foundUser.level || 1,
      experience: foundUser.experience || 0,
      stats: foundUser.stats || {
        totalSubmissions: 0,
        totalWins: 0,
        totalBattles: 0,
        winRate: 0,
        rating: 1000
      },
      achievements: foundUser.achievements || [],
      points: foundUser.points || 0,
      favorites: foundUser.favorites || [],
      joinedAt: new Date(foundUser.joinedAt),
      lastLogin: new Date()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUsers = JSON.parse(localStorage.getItem('prompt-arena-users') || '[]');
    
    if (storedUsers.find((u: any) => u.email === email)) {
      throw new Error('该邮箱已被注册');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      avatar: '🤖',
      level: 1,
      experience: 0,
      stats: {
        totalSubmissions: 0,
        totalWins: 0,
        totalBattles: 0,
        winRate: 0,
        rating: 1000
      },
      achievements: [],
      points: 100,
      favorites: [],
      joinedAt: new Date().toISOString()
    };

    storedUsers.push(newUser);
    localStorage.setItem('prompt-arena-users', JSON.stringify(storedUsers));

    const userData: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      level: newUser.level,
      experience: newUser.experience,
      stats: newUser.stats,
      achievements: newUser.achievements,
      points: newUser.points,
      favorites: newUser.favorites,
      joinedAt: new Date(newUser.joinedAt),
      lastLogin: new Date()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
