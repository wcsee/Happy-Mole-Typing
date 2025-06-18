import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardOptions {
  onKeyPress?: (key: string, event: KeyboardEvent) => void;
  onKeyDown?: (key: string, event: KeyboardEvent) => void;
  onKeyUp?: (key: string, event: KeyboardEvent) => void;
  enabledKeys?: string[];
  disabledKeys?: string[];
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

export const useKeyboard = (options: UseKeyboardOptions = {}) => {
  const {
    onKeyPress,
    onKeyDown,
    onKeyUp,
    enabledKeys,
    disabledKeys,
    preventDefault = true,
    stopPropagation = true,
    enabled = true,
  } = options;

  const pressedKeysRef = useRef<Set<string>>(new Set());
  const lastKeyPressRef = useRef<string | null>(null);
  const keyPressTimeRef = useRef<number>(0);

  const isKeyAllowed = useCallback((key: string): boolean => {
    if (disabledKeys && disabledKeys.includes(key.toUpperCase())) {
      return false;
    }
    if (enabledKeys && !enabledKeys.includes(key.toUpperCase())) {
      return false;
    }
    return true;
  }, [enabledKeys, disabledKeys]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = event.key.toUpperCase();
    
    if (!isKeyAllowed(key)) return;

    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    // Avoid key repeat
    if (pressedKeysRef.current.has(key)) return;
    
    pressedKeysRef.current.add(key);
    keyPressTimeRef.current = Date.now();
    lastKeyPressRef.current = key;

    onKeyDown?.(key, event);
  }, [enabled, isKeyAllowed, preventDefault, stopPropagation, onKeyDown]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = event.key.toUpperCase();
    
    if (!isKeyAllowed(key)) return;

    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    pressedKeysRef.current.delete(key);

    onKeyUp?.(key, event);
  }, [enabled, isKeyAllowed, preventDefault, stopPropagation, onKeyUp]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = event.key.toUpperCase();
    
    if (!isKeyAllowed(key)) return;

    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    onKeyPress?.(key, event);
  }, [enabled, isKeyAllowed, preventDefault, stopPropagation, onKeyPress]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [enabled, handleKeyDown, handleKeyUp, handleKeyPress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pressedKeysRef.current.clear();
    };
  }, []);

  const isKeyPressed = useCallback((key: string): boolean => {
    return pressedKeysRef.current.has(key.toUpperCase());
  }, []);

  const getPressedKeys = useCallback((): string[] => {
    return Array.from(pressedKeysRef.current);
  }, []);

  const getLastKeyPress = useCallback((): { key: string | null; time: number } => {
    return {
      key: lastKeyPressRef.current,
      time: keyPressTimeRef.current,
    };
  }, []);

  const clearPressedKeys = useCallback(() => {
    pressedKeysRef.current.clear();
    lastKeyPressRef.current = null;
    keyPressTimeRef.current = 0;
  }, []);

  return {
    isKeyPressed,
    getPressedKeys,
    getLastKeyPress,
    clearPressedKeys,
    pressedKeys: Array.from(pressedKeysRef.current),
    lastKeyPress: lastKeyPressRef.current,
    lastKeyPressTime: keyPressTimeRef.current,
  };
};

// Specialized hook for game typing
export const useGameKeyboard = (onKeyPress: (key: string) => void, enabled: boolean = true) => {
  const gameKeys = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return useKeyboard({
    onKeyPress,
    enabledKeys: gameKeys,
    enabled,
    preventDefault: true,
    stopPropagation: true,
  });
};

// Hook for menu navigation
export const useMenuKeyboard = (callbacks: {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}, enabled: boolean = true) => {
  const handleKeyDown = useCallback((key: string) => {
    switch (key) {
      case 'ENTER':
        callbacks.onEnter?.();
        break;
      case 'ESCAPE':
        callbacks.onEscape?.();
        break;
      case 'ARROWUP':
        callbacks.onArrowUp?.();
        break;
      case 'ARROWDOWN':
        callbacks.onArrowDown?.();
        break;
      case 'ARROWLEFT':
        callbacks.onArrowLeft?.();
        break;
      case 'ARROWRIGHT':
        callbacks.onArrowRight?.();
        break;
    }
  }, [callbacks]);

  return useKeyboard({
    onKeyDown: handleKeyDown,
    enabledKeys: ['ENTER', 'ESCAPE', 'ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT'],
    enabled,
    preventDefault: true,
    stopPropagation: true,
  });
};