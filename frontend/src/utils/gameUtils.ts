import { Mole, GameLevel } from '../types/game';
import { generateId, getRandomElement, getRandomElements } from './helpers';

// Mole generation utilities
export const createMole = (
  position: { x: number; y: number },
  letterSet: string[],
  appearTime: number = Date.now()
): Mole => {
  return {
    id: generateId(),
    position,
    x: position.x,
    y: position.y,
    letter: getRandomElement(letterSet),
    isVisible: true,
    isHit: false,
    isMissed: false,
    appearTime,
    spawnTime: appearTime,
    timeLimit: 3000,
    points: 10,
  };
};

export const generateRandomPosition = (
  gameAreaWidth: number,
  gameAreaHeight: number,
  moleSize: number = 60,
  margin: number = 20
): { x: number; y: number } => {
  const maxX = gameAreaWidth - moleSize - margin;
  const maxY = gameAreaHeight - moleSize - margin;
  
  return {
    x: Math.random() * maxX + margin,
    y: Math.random() * maxY + margin,
  };
};

export const generateMultipleMoles = (
  count: number,
  gameAreaWidth: number,
  gameAreaHeight: number,
  letterSet: string[],
  minDistance: number = 80
): Mole[] => {
  const moles: Mole[] = [];
  const maxAttempts = 100;
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let position: { x: number; y: number };
    
    do {
      position = generateRandomPosition(gameAreaWidth, gameAreaHeight);
      attempts++;
    } while (
      attempts < maxAttempts &&
      moles.some(mole => 
        Math.sqrt(
          Math.pow(mole.position.x - position.x, 2) + 
          Math.pow(mole.position.y - position.y, 2)
        ) < minDistance
      )
    );
    
    moles.push(createMole(position, letterSet));
  }
  
  return moles;
};

// Letter set utilities
export const getLetterSetByDifficulty = (difficulty: string): string[] => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return ['A', 'S', 'D', 'F', 'J', 'K', 'L'];
    case 'medium':
      return ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    case 'hard':
      return ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    case 'expert':
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    default:
      return ['A', 'S', 'D', 'F'];
  }
};

export const getRandomLetters = (letterSet: string[], count: number): string[] => {
  return getRandomElements(letterSet, count);
};

// Scoring utilities
export const calculateMoleScore = (
  reactionTime: number,
  difficulty: string,
  combo: number = 1
): number => {
  const baseScore = getDifficultyMultiplier(difficulty) * 10;
  const timeBonus = Math.max(0, 1000 - reactionTime) / 100;
  const comboBonus = Math.min(combo * 0.1, 2); // Max 200% bonus
  
  return Math.round(baseScore * (1 + timeBonus / 10 + comboBonus));
};

export const getDifficultyMultiplier = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 1;
    case 'medium':
      return 1.5;
    case 'hard':
      return 2;
    case 'expert':
      return 3;
    default:
      return 1;
  }
};

export const calculateLevelScore = (
  hitCount: number,
  missCount: number,
  averageReactionTime: number,
  level: GameLevel
): number => {
  const accuracy = hitCount / (hitCount + missCount);
  const baseScore = hitCount * getDifficultyMultiplier(level.difficulty) * 10;
  const accuracyBonus = accuracy * baseScore * 0.5;
  const speedBonus = Math.max(0, 1000 - averageReactionTime) / 10;
  
  return Math.round(baseScore + accuracyBonus + speedBonus);
};

// Game state utilities
export const isGameComplete = (
  timeLeft: number,
  targetScore: number,
  currentScore: number
): boolean => {
  return timeLeft <= 0 || currentScore >= targetScore;
};

export const calculateGameProgress = (
  currentScore: number,
  targetScore: number
): number => {
  return Math.min(currentScore / targetScore, 1);
};

export const getNextLevel = (levels: GameLevel[], currentLevelId: number): GameLevel | null => {
  const currentIndex = levels.findIndex(level => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  return levels[currentIndex + 1];
};

export const canUnlockLevel = (
  level: GameLevel,
  previousLevel: GameLevel | null,
  userStats: any
): boolean => {
  if (level.id === 1) return true; // First level is always unlocked
  if (!previousLevel) return false;
  
  // Check if previous level is completed with minimum score
  return previousLevel.completed && 
         (previousLevel.bestScore || 0) >= previousLevel.targetScore * 0.8;
};

// Animation and timing utilities
export const getMoleLifetime = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 3000; // 3 seconds
    case 'medium':
      return 2000; // 2 seconds
    case 'hard':
      return 1500; // 1.5 seconds
    case 'expert':
      return 1000; // 1 second
    default:
      return 2000;
  }
};

export const getMoleSpawnInterval = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 2000; // Every 2 seconds
    case 'medium':
      return 1500; // Every 1.5 seconds
    case 'hard':
      return 1000; // Every 1 second
    case 'expert':
      return 800; // Every 0.8 seconds
    default:
      return 1500;
  }
};

export const getMaxSimultaneousMoles = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 2;
    case 'medium':
      return 3;
    case 'hard':
      return 4;
    case 'expert':
      return 5;
    default:
      return 2;
  }
};

// Keyboard utilities
export const isValidKeyPress = (key: string, targetLetter: string): boolean => {
  return key.toUpperCase() === targetLetter.toUpperCase();
};

export const getKeyboardLayout = (layout: string = 'qwerty'): string[][] => {
  switch (layout.toLowerCase()) {
    case 'qwerty':
      return [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      ];
    case 'dvorak':
      return [
        ["'", ',', '.', 'P', 'Y', 'F', 'G', 'C', 'R', 'L'],
        ['A', 'O', 'E', 'U', 'I', 'D', 'H', 'T', 'N', 'S'],
        [';', 'Q', 'J', 'K', 'X', 'B', 'M', 'W', 'V', 'Z']
      ];
    case 'colemak':
      return [
        ['Q', 'W', 'F', 'P', 'G', 'J', 'L', 'U', 'Y', ';'],
        ['A', 'R', 'S', 'T', 'D', 'H', 'N', 'E', 'I', 'O'],
        ['Z', 'X', 'C', 'V', 'B', 'K', 'M']
      ];
    default:
      return [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      ];
  }
};

// Sound utilities
export const playHitSound = (volume: number = 0.5): void => {
  // This would be implemented with actual audio files
  console.log('Playing hit sound at volume:', volume);
};

export const playMissSound = (volume: number = 0.5): void => {
  // This would be implemented with actual audio files
  console.log('Playing miss sound at volume:', volume);
};

export const playBackgroundMusic = (volume: number = 0.3): void => {
  // This would be implemented with actual audio files
  console.log('Playing background music at volume:', volume);
};