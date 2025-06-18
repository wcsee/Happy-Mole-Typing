import { GameLevel, GameSession } from '../types/game';
import { generateId } from '../utils/helpers';

// 本地游戏关卡数据
const LOCAL_LEVELS: GameLevel[] = [
  {
    id: 1,
    name: '新手训练',
    description: '适合初学者的简单关卡，鼹鼠移动较慢，给你充足的反应时间。',
    difficulty: 'easy',
    timeLimit: 120,
    targetScore: 500,
    moleCount: 2,
    maxMoles: 2,
    moleSpeed: 3000,
    letterSet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    isUnlocked: true,
    completed: false,
    order: 1
  },
  {
    id: 2,
    name: '基础挑战',
    description: '稍微增加难度，鼹鼠数量增加，需要更快的反应速度。',
    difficulty: 'easy',
    timeLimit: 90,
    targetScore: 800,
    moleCount: 3,
    maxMoles: 3,
    moleSpeed: 2500,
    letterSet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    isUnlocked: true,
    completed: false,
    order: 2
  },
  {
    id: 3,
    name: '速度考验',
    description: '中等难度，鼹鼠移动更快，字母范围扩大。',
    difficulty: 'medium',
    timeLimit: 75,
    targetScore: 1200,
    moleCount: 4,
    maxMoles: 4,
    moleSpeed: 2000,
    letterSet: 'ABCDEFGHIJKLMNOP'.split(''),
    isUnlocked: true,
    completed: false,
    order: 3
  },
  {
    id: 4,
    name: '高手进阶',
    description: '困难模式，需要极快的反应速度和准确性。',
    difficulty: 'hard',
    timeLimit: 60,
    targetScore: 2000,
    moleCount: 5,
    maxMoles: 5,
    moleSpeed: 1500,
    letterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    isUnlocked: true,
    completed: false,
    order: 4
  },
  {
    id: 5,
    name: '终极挑战',
    description: '专家级别，最高难度的挑战，只有真正的高手才能完成。',
    difficulty: 'expert',
    timeLimit: 45,
    targetScore: 3000,
    moleCount: 6,
    maxMoles: 6,
    moleSpeed: 1000,
    letterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    isUnlocked: true,
    completed: false,
    order: 5
  }
];

export const localGameService = {
  // 获取本地关卡列表
  async getLevels(): Promise<GameLevel[]> {
    // 模拟异步操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(LOCAL_LEVELS);
      }, 100);
    });
  },

  // 获取指定关卡
  async getLevel(levelId: number): Promise<GameLevel> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const level = LOCAL_LEVELS.find(l => l.id === levelId);
        if (level) {
          resolve(level);
        } else {
          reject(new Error('Level not found'));
        }
      }, 100);
    });
  },

  // 开始游戏（本地模式）
  async startGame(levelId: number): Promise<GameSession> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const level = LOCAL_LEVELS.find(l => l.id === levelId);
        if (!level) {
          reject(new Error('Level not found'));
          return;
        }

        const session: GameSession = {
          id: generateId(),
          levelId: level.id,
          userId: 'guest', // 游客用户
          startTime: Date.now(),
          endTime: undefined,
          score: 0,
          accuracy: 0,
          hitCount: 0,
          missCount: 0,
          totalMoles: 0,
          averageReactionTime: 0,
          wpm: 0,
          hits: 0,
          misses: 0,
          maxCombo: 0,
          timeElapsed: 0,
          isCompleted: false,
          isLocal: true
        };

        resolve(session);
      }, 100);
    });
  },

  // 结束游戏（本地模式）
  async endGame(sessionId: string, sessionData: Partial<GameSession>): Promise<GameSession> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedSession: GameSession = {
          id: sessionId,
          levelId: sessionData.levelId || 1,
          userId: 'guest',
          startTime: sessionData.startTime || Date.now(),
          endTime: Date.now(),
          score: sessionData.score || 0,
          accuracy: sessionData.accuracy || 0,
          hitCount: sessionData.hits || 0,
          missCount: sessionData.misses || 0,
          totalMoles: (sessionData.hits || 0) + (sessionData.misses || 0),
          averageReactionTime: 0,
          wpm: sessionData.wpm || 0,
          hits: sessionData.hits || 0,
          misses: sessionData.misses || 0,
          maxCombo: sessionData.maxCombo || 0,
          timeElapsed: sessionData.timeElapsed || 0,
          isCompleted: true,
          isLocal: true
        };

        // 保存到本地存储
        this.saveLocalScore(updatedSession);
        
        resolve(updatedSession);
      }, 100);
    });
  },

  // 保存本地分数
  saveLocalScore(session: GameSession): void {
    try {
      const existingScores = this.getLocalScores();
      existingScores.push(session);
      
      // 只保留最近的50个分数
      const recentScores = existingScores
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, 50);
      
      localStorage.setItem('local_game_scores', JSON.stringify(recentScores));
    } catch (error) {
      console.error('Failed to save local score:', error);
    }
  },

  // 获取本地分数
  getLocalScores(): GameSession[] {
    try {
      const scoresStr = localStorage.getItem('local_game_scores');
      return scoresStr ? JSON.parse(scoresStr) : [];
    } catch (error) {
      console.error('Failed to load local scores:', error);
      return [];
    }
  },

  // 获取本地最佳分数
  getLocalBestScores(): { [levelId: number]: GameSession } {
    const scores = this.getLocalScores();
    const bestScores: { [levelId: number]: GameSession } = {};
    
    scores.forEach(session => {
      if (!bestScores[session.levelId] || session.score > bestScores[session.levelId].score) {
        bestScores[session.levelId] = session;
      }
    });
    
    return bestScores;
  },

  // 获取游戏统计（本地模式）
  async getGameStats(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scores = this.getLocalScores();
        const stats = {
          totalGames: scores.length,
          totalScore: scores.reduce((sum, s) => sum + s.score, 0),
          averageScore: scores.length > 0 ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length : 0,
          bestScore: Math.max(...scores.map(s => s.score), 0),
          averageAccuracy: scores.length > 0 ? scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length : 0,
          averageWpm: scores.length > 0 ? scores.reduce((sum, s) => sum + (s.wpm || 0), 0) / scores.length : 0,
          isLocal: true
        };
        resolve(stats);
      }, 100);
    });
  }
};