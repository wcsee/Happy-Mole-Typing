import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameLevel, Mole, GameSession, GameStats } from '../types/game';
import { gameService } from '../services/gameService';
import { generateId } from '../utils/helpers';

// Async thunks
export const startGameSession = createAsyncThunk(
  'game/startGameSession',
  async (levelId: number) => {
    const response = await gameService.startGame(levelId);
    return response;
  }
);

export const endGameSession = createAsyncThunk(
  'game/endGameSession',
  async ({ sessionId, sessionData }: { sessionId: string; sessionData: Partial<GameSession> }) => {
    const response = await gameService.endGame(sessionId, sessionData);
    return response;
  }
);

export const fetchGameLevels = createAsyncThunk(
  'game/fetchGameLevels',
  async () => {
    const response = await gameService.getLevels();
    return response;
  }
);

export const fetchUserGameStats = createAsyncThunk(
  'game/fetchUserGameStats',
  async () => {
    const response = await gameService.getGameStats();
    return response;
  }
);

const initialState: GameState = {
  // Game session
  currentLevel: null,
  currentSession: null,
  
  // Game state
  moles: [],
  activeMoles: [],
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  
  // Game stats
  score: 0,
  combo: 0,
  maxCombo: 0,
  hits: 0,
  misses: 0,
  accuracy: 0,
  wpm: 0,
  timeLeft: 0,
  timeRemaining: 0,
  totalTime: 0,
  
  // Game levels and stats
  levels: [],
  gameStats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    averageAccuracy: 0,
    averageReactionTime: 0,
    bestScore: 0,
    longestStreak: 0,
    favoriteLevel: 1,
    totalPlayTime: 0,
    totalHits: 0,
    totalMisses: 0
  },
  
  // UI state
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Game control actions
    startGame: (state, action: PayloadAction<GameLevel>) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.isGameOver = false;
      state.currentLevel = action.payload;
      state.timeRemaining = action.payload.timeLimit;
      state.totalTime = action.payload.timeLimit;
      
      // Reset game stats
      state.score = 0;
      state.combo = 0;
      state.maxCombo = 0;
      state.hits = 0;
      state.misses = 0;
      state.accuracy = 0;
      state.wpm = 0;
      
      // Clear moles
      state.moles = [];
      state.activeMoles = [];
    },
    
    pauseGame: (state) => {
      state.isPaused = true;
    },
    
    resumeGame: (state) => {
      state.isPaused = false;
    },
    
    endGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.isGameOver = true;
      state.activeMoles = [];
    },
    
    resetGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.isGameOver = false;
      state.currentLevel = null;
      state.currentSession = null;
      state.moles = [];
      state.activeMoles = [];
      state.score = 0;
      state.combo = 0;
      state.maxCombo = 0;
      state.hits = 0;
      state.misses = 0;
      state.accuracy = 0;
      state.wpm = 0;
      state.timeRemaining = 0;
      state.totalTime = 0;
    },
    
    // Mole management actions
    addMole: (state, action: PayloadAction<Omit<Mole, 'id'>>) => {
      const mole: Mole = {
        ...action.payload,
        id: generateId(),
        isHit: false,
        isMissed: false,
        spawnTime: Date.now(),
        timeLimit: 3000,
        points: 10
      };
      state.moles.push(mole);
      state.activeMoles.push(mole.id);
    },
    
    removeMole: (state, action: PayloadAction<string>) => {
      const moleId = action.payload;
      state.moles = state.moles.filter(mole => mole.id !== moleId);
      state.activeMoles = state.activeMoles.filter(id => id !== moleId);
    },
    
    hitMole: (state, action: PayloadAction<{ moleId: string; isCorrect: boolean }>) => {
      const { moleId, isCorrect } = action.payload;
      const mole = state.moles.find(m => m.id === moleId);
      
      if (mole) {
        mole.isHit = true;
        mole.hitTime = Date.now();
        
        if (isCorrect) {
          state.hits += 1;
          state.combo += 1;
          state.maxCombo = Math.max(state.maxCombo, state.combo);
          
          // Calculate score based on combo and timing
          const baseScore = mole.points || 10;
          const comboMultiplier = Math.min(1 + (state.combo - 1) * 0.1, 3); // Max 3x multiplier
          const timeBonus = mole.timeLimit ? Math.max(0, (mole.timeLimit - (Date.now() - mole.spawnTime)) / mole.timeLimit) : 0;
          const finalScore = Math.round(baseScore * comboMultiplier * (1 + timeBonus));
          
          state.score += finalScore;
        } else {
          state.misses += 1;
          state.combo = 0;
        }
        
        // Remove mole from active list
        state.activeMoles = state.activeMoles.filter(id => id !== moleId);
        
        // Update accuracy
        const totalAttempts = state.hits + state.misses;
        state.accuracy = totalAttempts > 0 ? (state.hits / totalAttempts) * 100 : 0;
        
        // Calculate WPM (assuming average word length of 5 characters)
        const timeElapsed = state.totalTime - state.timeRemaining;
        if (timeElapsed > 0) {
          state.wpm = Math.round((state.hits / 5) / (timeElapsed / 60));
        }
      }
    },
    
    missMole: (state, action: PayloadAction<string>) => {
      const moleId = action.payload;
      const mole = state.moles.find(m => m.id === moleId);
      
      if (mole) {
        mole.isMissed = true;
        state.misses += 1;
        state.combo = 0;
        
        // Remove mole from active list
        state.activeMoles = state.activeMoles.filter(id => id !== moleId);
        
        // Update accuracy
        const totalAttempts = state.hits + state.misses;
        state.accuracy = totalAttempts > 0 ? (state.hits / totalAttempts) * 100 : 0;
      }
    },
    
    // Time management
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload);
      
      if (state.timeRemaining === 0 && state.isPlaying) {
        state.isPlaying = false;
        state.isGameOver = true;
        state.activeMoles = [];
      }
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Level selection
    setCurrentLevel: (state, action: PayloadAction<GameLevel>) => {
      state.currentLevel = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Start game session
      .addCase(startGameSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startGameSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
      })
      .addCase(startGameSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start game session';
      })
      
      // End game session
      .addCase(endGameSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(endGameSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.isPlaying = false;
      })
      .addCase(endGameSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to end game session';
      })
      
      // Fetch game levels
      .addCase(fetchGameLevels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameLevels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.levels = action.payload;
      })
      .addCase(fetchGameLevels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch game levels';
      })
      
      // Fetch user game stats
      .addCase(fetchUserGameStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserGameStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameStats = action.payload;
      })
      .addCase(fetchUserGameStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user game stats';
      });
  },
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  resetGame,
  addMole,
  removeMole,
  hitMole,
  missMole,
  updateTimeRemaining,
  clearError,
  setCurrentLevel,
} = gameSlice.actions;

// Add missing action creators
const fetchLevels = fetchGameLevels;
const updateTimeLeft = updateTimeRemaining;
const updateMole = (payload: any) => ({ type: 'game/updateMole', payload });
const updateGameSession = (payload: any) => ({ type: 'game/updateGameSession', payload });

// Export additional functions
export { fetchLevels, updateTimeLeft, updateMole, updateGameSession };

export default gameSlice.reducer;