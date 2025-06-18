import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGameLevels,
  startGame,
  endGame,
  setCurrentLevel,
  addMole,
  removeMole,
  hitMole,
  missMole,
  updateTimeRemaining,
  pauseGame,
  resumeGame,
  resetGame,
  clearError,
} from '../store/gameSlice';
import { GameLevel, Mole, HitResult } from '../types/game';
import {
  createMole,
  generateRandomPosition,
  calculateMoleScore,
  getMoleLifetime,
  getMoleSpawnInterval,
  getMaxSimultaneousMoles,
  getLetterSetByDifficulty,
  isValidKeyPress,
} from '../utils/gameUtils';

export const useGame = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const comboRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0);

  // Initialize game levels
  useEffect(() => {
    if (gameState.levels.length === 0) {
      dispatch(fetchGameLevels());
    }
  }, [dispatch, gameState.levels.length]);

  // Game timer effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      gameTimerRef.current = setInterval(() => {
        dispatch(updateTimeRemaining(gameState.timeLeft - 1));
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
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft, dispatch]);

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
    dispatch(setCurrentLevel(level));
  }, [dispatch]);

  const handleStartGame = useCallback(async (levelId: number) => {
    try {
      const level = gameState.levels.find(l => l.id === levelId);
      if (!level) {
        throw new Error('Level not found');
      }
      dispatch(startGame(level));
      comboRef.current = 0;
      lastHitTimeRef.current = 0;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [dispatch, gameState.levels]);

  const handleEndGame = useCallback(async () => {
    if (!gameState.currentSession) return;

    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    moleTimersRef.current.forEach(timer => clearTimeout(timer));
    moleTimersRef.current.clear();

    const endTime = Date.now();
    const duration = endTime - gameState.currentSession.startTime;
    const accuracy = gameState.currentSession.hitCount / 
      (gameState.currentSession.hitCount + gameState.currentSession.missCount);

    const sessionData = {
      endTime,
      duration,
      accuracy,
      score: gameState.score,
    };

    try {
      dispatch(endGame());
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [dispatch, gameState.currentSession, gameState.score]);

  const handlePauseGame = useCallback(() => {
    dispatch(pauseGame());
    // Clear timers but don't reset them
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
  }, [dispatch]);

  const handleResumeGame = useCallback(() => {
    dispatch(resumeGame());
  }, [dispatch]);

  const handleResetGame = useCallback(() => {
    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    moleTimersRef.current.forEach(timer => clearTimeout(timer));
    moleTimersRef.current.clear();
    
    dispatch(resetGame());
    comboRef.current = 0;
    lastHitTimeRef.current = 0;
  }, [dispatch]);

  const spawnMole = useCallback(() => {
    if (!gameState.currentLevel) return;

    const position = generateRandomPosition(800, 600); // Game area dimensions
    const letterSet = getLetterSetByDifficulty(gameState.currentLevel.difficulty);
    const mole = createMole(position, letterSet);
    
    dispatch(addMole(mole));

    // Set mole disappear timer
    const lifetime = getMoleLifetime(gameState.currentLevel.difficulty);
    const timer = setTimeout(() => {
      dispatch(removeMole(mole.id));
      dispatch(missMole(mole.id));
      moleTimersRef.current.delete(mole.id);
      
      // Reset combo on miss
      comboRef.current = 0;
    }, lifetime);
    
    moleTimersRef.current.set(mole.id, timer);
  }, [dispatch, gameState.currentLevel]);

  const handleKeyPress = useCallback((key: string) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const targetMole = gameState.moles.find(mole => 
      mole.isVisible && !mole.isHit && isValidKeyPress(key, mole.letter)
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

      const points = calculateMoleScore(
        reactionTime,
        gameState.currentLevel?.difficulty || 'easy',
        comboRef.current
      );

      const hitResult: HitResult = {
        isHit: true,
        points,
        reactionTime,
        combo: comboRef.current,
      };

      // Update game state
      dispatch(hitMole({ moleId: targetMole.id, isCorrect: true }));
      
      // Remove mole after hit animation
      setTimeout(() => {
        dispatch(removeMole(targetMole.id));
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
  }, [gameState.isPlaying, gameState.isPaused, gameState.moles, gameState.currentLevel, dispatch]);

  const clearGameError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

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
    updateScore: () => {}, // Placeholder function
    handleKeyPress,
    clearError: clearGameError,
  };
};