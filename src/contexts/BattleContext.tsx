import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Battle {
  id: string;
  challengeId: string;
  opponentId: string;
  opponentName: string;
  yourPrompt: string;
  opponentPrompt: string;
  yourScore: number;
  opponentScore: number;
  winner: 'you' | 'opponent' | 'draw';
  timestamp: Date;
  category: string;
}

interface MatchmakingState {
  isSearching: boolean;
  estimatedWaitTime: number;
  searchStartTime: Date | null;
}

interface BattleContextType {
  battles: Battle[];
  matchmaking: MatchmakingState;
  startMatchmaking: (challengeId: string) => void;
  cancelMatchmaking: () => void;
  submitBattlePrompt: (challengeId: string, prompt: string) => Promise<void>;
  getBattleHistory: () => Battle[];
  getBattleStats: () => {
    totalBattles: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  };
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [matchmaking, setMatchmaking] = useState<MatchmakingState>({
    isSearching: false,
    estimatedWaitTime: 0,
    searchStartTime: null
  });
  const [matchmakingTimer, setMatchmakingTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('prompt-arena-battles');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setBattles(data.map((b: any) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load battles:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (battles.length > 0) {
      localStorage.setItem('prompt-arena-battles', JSON.stringify(battles));
    }
  }, [battles]);

  const startMatchmaking = (challengeId: string) => {
    setMatchmaking({
      isSearching: true,
      estimatedWaitTime: 0,
      searchStartTime: new Date()
    });

    const timer = setInterval(() => {
      setMatchmaking(prev => ({
        ...prev,
        estimatedWaitTime: Math.floor((Date.now() - (prev.searchStartTime?.getTime() || Date.now())) / 1000)
      }));
    }, 1000);

    setMatchmakingTimer(timer);

    setTimeout(() => {
      if (matchmakingTimer) {
        clearInterval(matchmakingTimer);
      }
      cancelMatchmaking();
    }, 60000);
  };

  const cancelMatchmaking = () => {
    if (matchmakingTimer) {
      clearInterval(matchmakingTimer);
      setMatchmakingTimer(null);
    }
    setMatchmaking({
      isSearching: false,
      estimatedWaitTime: 0,
      searchStartTime: null
    });
  };

  const submitBattlePrompt = async (challengeId: string, prompt: string) => {
    if (!user) {
      throw new Error('请先登录');
    }

    cancelMatchmaking();

    await new Promise(resolve => setTimeout(resolve, 1500));

    const opponentScore = Math.random() * 30 + 70;
    const yourScore = Math.random() * 30 + 70;
    
    const winner: 'you' | 'opponent' | 'draw' = 
      yourScore > opponentScore ? 'you' : 
      yourScore < opponentScore ? 'opponent' : 'draw';

    const opponentNames = [
      'AI大师', '提示词达人', '写作高手', '代码专家', 
      '营销精英', '创意天才', '文案高手', '创意写手'
    ];
    const categories = ['writing', 'coding', 'business', 'creative'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const battle: Battle = {
      id: `battle-${Date.now()}`,
      challengeId,
      opponentId: `ai-opponent-${Date.now()}`,
      opponentName: opponentNames[Math.floor(Math.random() * opponentNames.length)],
      yourPrompt: prompt,
      opponentPrompt: '对手的提示词内容已隐藏',
      yourScore: Math.round(yourScore * 10) / 10,
      opponentScore: Math.round(opponentScore * 10) / 10,
      winner,
      timestamp: new Date(),
      category
    };

    setBattles(prev => [battle, ...prev]);

    if (user) {
      const updatedBattles = [...battles, battle];
      const wins = updatedBattles.filter(b => b.winner === 'you').length;
      const losses = updatedBattles.filter(b => b.winner === 'opponent').length;
      const draws = updatedBattles.filter(b => b.winner === 'draw').length;
      const winRate = updatedBattles.length > 0 
        ? Math.round((wins / updatedBattles.length) * 100) 
        : 0;

      localStorage.setItem('prompt-arena-battles', JSON.stringify(updatedBattles.map(b => ({
        ...b,
        timestamp: b.timestamp.toISOString()
      }))));
    }
  };

  const getBattleHistory = () => {
    return battles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getBattleStats = () => {
    const totalBattles = battles.length;
    const wins = battles.filter(b => b.winner === 'you').length;
    const losses = battles.filter(b => b.winner === 'opponent').length;
    const draws = battles.filter(b => b.winner === 'draw').length;
    const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

    return { totalBattles, wins, losses, draws, winRate };
  };

  return (
    <BattleContext.Provider value={{
      battles,
      matchmaking,
      startMatchmaking,
      cancelMatchmaking,
      submitBattlePrompt,
      getBattleHistory,
      getBattleStats
    }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error('useBattle must be used within BattleProvider');
  }
  return context;
};
