import { useState, useEffect, useCallback, useRef } from 'react';
import { GameLevel, GameSession, Mole, HitResult } from '../types/game';
import { localGameService } from '../services/localGameService';
import { createMole, generateRandomPosition } from '../utils/gameUtils';
import { 
  getMoleSpawnInterval, 
  getMaxSimultaneousMoles, 
  getMoleLifetime, 
  getLetterSetByDifficulty,
  calculateMoleScore,
  isValidKeyPress
} from '../utils/gameHelpers';

interface LocalGameState {
  levels: GameLevel[];
  currentLevel: GameLevel | null;
  currentSession: GameSession | null;
  moles: Mole[];
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  hits: number;
  misses: number;
  accuracy: number;
}

const initialState: LocalGameState = {
  levels: [],
  currentLevel: null,
  currentSession: null,
  moles: [],
  score: 0,
  timeLeft: 0,
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  error: null,
  hits: 0,
  misses: 0,
  accuracy: 0
};

export const useLocalGame = () => {
  const [gameState, setGameState] = useState<LocalGameState>(initialState);
  
  // Refs for timers and combo tracking
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const comboRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0);

  // Load levels on mount
  useEffect(() => {
    const loadLevels = async () => {
      setGameState(prev => ({ ...prev, isLoading: true }));
      try {
        const levels = await localGameService.getLevels();
        setGameState(prev => ({ 
          ...prev, 
          levels, 
          isLoading: false,
          error: null 
        }));
      } catch (error: any) {
        setGameState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: error.message 
        }));
      }
    };

    loadLevels();
  }, []);

  // Game timer effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      gameTimerRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

  // Auto-end game when time runs out
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft <= 0) {
      handleEndGame();
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Mole spawning effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.currentLevel) {
      const spawnInterval = getMoleSpawnInterval(gameState.currentLevel.difficulty);
      const maxMoles = getMaxSimultaneousMoles(gameState.currentLevel.difficulty);
      
      if (gameState.moles.length < maxMoles) {
        spawnTimerRef.current = setTimeout(() => {
          spawnMole();
        }, spawnInterval);
      }
    }

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.moles.length, gameState.currentLevel]);

  const selectLevel = useCallback((level: GameLevel) => {
    setGameState(prev => ({ ...prev, currentLevel: level }));
  }, []);

  const handleStartGame = useCallback(async (levelId: number) => {
    try {
      const level = gameState.levels.find(l => l.id === levelId);
      if (!level) {
        throw new Error('Level not found');
      }

      const session = await localGameService.startGame(levelId);
      
      setGameState(prev => ({
        ...prev,
        currentLevel: level,
        currentSession: session,
        isPlaying: true,
        isPaused: false,
        timeLeft: level.timeLimit,
        score: 0,
        moles: [],
        hits: 0,
        misses: 0,
        accuracy: 0,
        error: null
      }));
      
      comboRef.current = 0;
      lastHitTimeRef.current = 0;
      
      return { success: true };
    } catch (error: any) {
      setGameState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [gameState.levels]);

  const handleEndGame = useCallback(async () => {
    if (!gameState.currentSession || !gameState.currentLevel) return;

    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    moleTimersRef.current.forEach(timer => clearTimeout(timer));
    moleTimersRef.current.clear();

    const totalAttempts = gameState.hits + gameState.misses;
    const accuracy = totalAttempts > 0 ? (gameState.hits / totalAttempts) * 100 : 0;
    const timeElapsed = gameState.currentLevel.timeLimit - gameState.timeLeft;
    const wpm = timeElapsed > 0 ? (gameState.hits / (timeElapsed / 60)) : 0;

    const sessionData = {
      ...gameState.currentSession,
      score: gameState.score,
      accuracy,
      wpm,
      hits: gameState.hits,
      misses: gameState.misses,
      maxCombo: comboRef.current,
      timeElapsed,
      isCompleted: true
    };

    try {
      await localGameService.endGame(gameState.currentSession.id, sessionData);
      
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        accuracy,
        currentSession: { ...prev.currentSession!, ...sessionData }
      }));
      
      return { success: true };
    } catch (error: any) {
      setGameState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [gameState.currentSession, gameState.currentLevel, gameState.score, gameState.hits, gameState.misses, gameState.timeLeft]);

  const handlePauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
    
    // Clear timers but don't reset them
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
  }, []);

  const handleResumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const handleResetGame = useCallback(() => {
    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    moleTimersRef.current.forEach(timer => clearTimeout(timer));
    moleTimersRef.current.clear();
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentSession: null,
      moles: [],
      score: 0,
      timeLeft: 0,
      hits: 0,
      misses: 0,
      accuracy: 0
    }));
    
    comboRef.current = 0;
    lastHitTimeRef.current = 0;
  }, []);

  const spawnMole = useCallback(() => {
    if (!gameState.currentLevel) return;

    const position = generateRandomPosition(800, 600); // Game area dimensions
    const letterSet = gameState.currentLevel.letterSet || getLetterSetByDifficulty(gameState.currentLevel.difficulty);
    const mole = createMole(position, letterSet);
    
    setGameState(prev => ({
      ...prev,
      moles: [...prev.moles, mole]
    }));

    // Set mole disappear timer
    const lifetime = getMoleLifetime(gameState.currentLevel.difficulty);
    const timer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        moles: prev.moles.filter(m => m.id !== mole.id),
        misses: prev.misses + 1
      }));
      
      moleTimersRef.current.delete(mole.id);
      
      // Reset combo on miss
      comboRef.current = 0;
    }, lifetime);
    
    moleTimersRef.current.set(mole.id, timer);
  }, [gameState.currentLevel]);

  const handleKeyPress = useCallback((key: string) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const targetMole = gameState.moles.find(mole =>
      mole.isVisible && !mole.isHit && mole.letter === key.toUpperCase()
    );

    if (targetMole) {
      const hitTime = Date.now();
      const reactionTime = hitTime - targetMole.appearTime;
      
      // Update combo
      const timeSinceLastHit = hitTime - lastHitTimeRef.current;
      if (timeSinceLastHit < 2000) { // 2 seconds combo window
        comboRef.current += 1;
      } else {
        comboRef.current = 1;
      }
      lastHitTimeRef.current = hitTime;

      const points = calculateMoleScore(comboRef.current);

      const hitResult: HitResult = {
        isHit: true,
        points,
        reactionTime,
        combo: comboRef.current,
      };

      // Update game state
      setGameState(prev => ({
        ...prev,
        moles: prev.moles.map(m => 
          m.id === targetMole.id ? { ...m, isHit: true } : m
        ),
        score: prev.score + points,
        hits: prev.hits + 1
      }));
      
      // Remove mole after hit animation
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          moles: prev.moles.filter(m => m.id !== targetMole.id)
        }));
      }, 300);

      // Clear mole timer
      const timer = moleTimersRef.current.get(targetMole.id);
      if (timer) {
        clearTimeout(timer);
        moleTimersRef.current.delete(targetMole.id);
      }

      return hitResult;
    } else {
      // Miss - reset combo
      comboRef.current = 0;
      return null;
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.moles, gameState.currentLevel]);

  const clearGameError = useCallback(() => {
    setGameState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...gameState,
    combo: comboRef.current,
    level: gameState.currentLevel,
    isGameActive: gameState.isPlaying,
    
    // Actions
    selectLevel,
    startGame: handleStartGame,
    endGame: handleEndGame,
    pauseGame: handlePauseGame,
    resumeGame: handleResumeGame,
    resetGame: handleResetGame,
    handleKeyPress,
    clearError: clearGameError,
  };
};