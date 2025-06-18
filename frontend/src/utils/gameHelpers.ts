// 游戏辅助函数

export const generateRandomLetter = (letterSet?: string[]): string => {
  const letters = letterSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return letters[Math.floor(Math.random() * letters.length)];
};

export const generateMolePosition = () => {
  return {
    x: Math.random() * 80 + 10, // 10% - 90% 的位置
    y: Math.random() * 60 + 20, // 20% - 80% 的位置
  };
};

export const calculateMoleScore = (combo: number, baseScore: number = 10): number => {
  return baseScore + combo * 2; // 连击加分
};

export const isValidKeyPress = (key: string): boolean => {
  return /^[A-Za-z]$/.test(key);
};

export const calculateAccuracy = (hits: number, misses: number): number => {
  const total = hits + misses;
  return total > 0 ? Math.round((hits / total) * 100) : 0;
};

export const calculateWPM = (hits: number, timeElapsed: number): number => {
  if (timeElapsed <= 0) return 0;
  const minutes = timeElapsed / 60;
  return Math.round(hits / minutes);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getMoleSpawnInterval = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 2000;
    case 'medium': return 1500;
    case 'hard': return 1000;
    case 'expert': return 800;
    default: return 2000;
  }
};

export const getMaxSimultaneousMoles = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 2;
    case 'medium': return 3;
    case 'hard': return 4;
    case 'expert': return 5;
    default: return 2;
  }
};

export const getMoleLifetime = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 4000;
    case 'medium': return 3000;
    case 'hard': return 2500;
    case 'expert': return 2000;
    default: return 4000;
  }
};

export const getLetterSetByDifficulty = (difficulty: string): string[] => {
  switch (difficulty) {
    case 'easy': return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    case 'medium': return 'ABCDEFGHIJKLMNOP'.split('');
    case 'hard': return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    case 'expert': return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    default: return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  }
};