import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

type SetValue<T> = T | ((val: T) => T);

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        storage.setItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      storage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for session storage
export const useSessionStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getSessionItem<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.setSessionItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      storage.removeSessionItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Specialized hooks for common storage needs
export const useGameSettings = () => {
  const defaultSettings = {
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.5,
    keyboardLayout: 'qwerty',
    showKeyboardHints: true,
    theme: 'light',
  };

  return useLocalStorage('gameSettings', defaultSettings);
};

export const useUserPreferences = () => {
  const defaultPreferences = {
    language: 'zh-CN',
    theme: 'light',
    autoSaveProgress: true,
    showTutorials: true,
    enableNotifications: true,
  };

  return useLocalStorage('userPreferences', defaultPreferences);
};

export const useGameProgress = () => {
  const defaultProgress = {
    unlockedLevels: [1],
    completedLevels: [],
    bestScores: {},
    totalPlayTime: 0,
    gamesPlayed: 0,
  };

  return useLocalStorage('gameProgress', defaultProgress);
};

// Hook for managing multiple related localStorage items
export const useMultipleLocalStorage = <T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
) => {
  const [values, setValues] = useState<T>(() => {
    const stored = {} as T;
    keys.forEach(key => {
      try {
        const item = storage.getItem(key as string);
        stored[key] = (item !== null ? item : initialValues[key]) as T[keyof T];
      } catch (error) {
        console.error(`Error reading localStorage key "${String(key)}":`, error);
        stored[key] = initialValues[key];
      }
    });
    return stored;
  });

  const setValue = useCallback(
    (key: keyof T, value: SetValue<T[keyof T]>) => {
      try {
        const valueToStore = value instanceof Function ? value(values[key]) : value;
        
        setValues(prev => ({ ...prev, [key]: valueToStore }));
        storage.setItem(key as string, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${String(key)}":`, error);
      }
    },
    [values]
  );

  const removeValue = useCallback(
    (key: keyof T) => {
      try {
        storage.removeItem(key as string);
        setValues(prev => ({ ...prev, [key]: initialValues[key] }));
      } catch (error) {
        console.error(`Error removing localStorage key "${String(key)}":`, error);
      }
    },
    [initialValues]
  );

  const clearAll = useCallback(() => {
    keys.forEach(key => {
      try {
        storage.removeItem(key as string);
      } catch (error) {
        console.error(`Error removing localStorage key "${String(key)}":`, error);
      }
    });
    setValues(initialValues);
  }, [keys, initialValues]);

  return { values, setValue, removeValue, clearAll };
};

// Hook for syncing localStorage changes across tabs
export const useStorageSync = <T>(key: string, initialValue: T) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setValue(newValue);
        } catch (error) {
          console.error('Error parsing storage sync value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, setValue]);

  return [value, setValue, removeValue] as const;
};