import { User } from '../types/auth';

const STORAGE_KEYS = {
  TOKEN: 'happy_mole_token',
  REFRESH_TOKEN: 'happy_mole_refresh_token',
  USER: 'happy_mole_user',
  PREFERENCES: 'happy_mole_preferences',
  GAME_SETTINGS: 'happy_mole_game_settings',
} as const;

export const storage = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Refresh token management
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // User data management
  getUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      this.removeUser();
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Preferences management
  getPreferences(): any {
    const prefsStr = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!prefsStr) return null;
    
    try {
      return JSON.parse(prefsStr);
    } catch (error) {
      console.error('Failed to parse preferences from localStorage:', error);
      this.removePreferences();
      return null;
    }
  },

  setPreferences(preferences: any): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  removePreferences(): void {
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  // Game settings management
  getGameSettings(): any {
    const settingsStr = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
    if (!settingsStr) return null;
    
    try {
      return JSON.parse(settingsStr);
    } catch (error) {
      console.error('Failed to parse game settings from localStorage:', error);
      this.removeGameSettings();
      return null;
    }
  },

  setGameSettings(settings: any): void {
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
  },

  removeGameSettings(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_SETTINGS);
  },

  // Clear all auth-related data
  clearAuth(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  },

  // Clear all stored data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Generic storage methods
  setItem(key: string, value: any): void {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      // Try to parse as JSON, if it fails, return as string
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return defaultValue || null;
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  // Session storage methods (for temporary data)
  setSessionItem(key: string, value: any): void {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  },

  getSessionItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error('Failed to get from sessionStorage:', error);
      return defaultValue || null;
    }
  },

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  },
};