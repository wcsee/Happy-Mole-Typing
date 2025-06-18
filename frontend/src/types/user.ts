export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
  showKeyboardHints: boolean;
  autoSaveProgress: boolean;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageAccuracy: number;
  averageReactionTime: number;
  bestScore: number;
  longestStreak: number;
  totalPlayTime: number;
  levelsCompleted: number;
  currentLevel: number;
  experiencePoints: number;
  rank: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}