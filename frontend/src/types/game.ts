export interface Mole {
  id: string;
  position: { x: number; y: number };
  x: number;
  y: number;
  letter: string;
  isVisible: boolean;
  isHit: boolean;
  isMissed: boolean;
  appearTime: number;
  disappearTime?: number;
  spawnTime: number;
  timeLimit: number;
  hitTime?: number;
  points: number;
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetScore: number;
  timeLimit: number;
  moleCount: number;
  maxMoles?: number;
  moleSpeed: number;
  letterSet: string[];
  isUnlocked: boolean;
  bestScore?: number;
  completed: boolean;
  order?: number;
}

export interface GameSession {
  id: string;
  levelId: number;
  userId?: string;
  score: number;
  accuracy: number;
  hitCount: number;
  missCount: number;
  hits?: number;
  misses?: number;
  maxCombo?: number;
  totalMoles: number;
  startTime: number;
  endTime?: number;
  duration?: number;
  timeElapsed?: number;
  averageReactionTime: number;
  wpm?: number;
  isCompleted?: boolean;
  isLocal?: boolean;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageAccuracy: number;
  averageReactionTime: number;
  bestScore: number;
  longestStreak: number;
  favoriteLevel: number;
  totalPlayTime: number;
  totalHits: number;
  totalMisses: number;
}

export interface GameState {
  currentLevel: GameLevel | null;
  currentSession: GameSession | null;
  moles: Mole[];
  activeMoles: string[];
  score: number;
  timeLeft: number;
  timeRemaining: number;
  totalTime: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  hits: number;
  misses: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  wpm: number;
  gameStats: GameStats;
  levels: GameLevel[];
  isLoading: boolean;
  error: string | null;
}

export interface HitResult {
  isHit: boolean;
  points: number;
  reactionTime: number;
  combo: number;
}