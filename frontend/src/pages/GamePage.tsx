import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useLocalGame } from '../hooks/useLocalGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { useAuth } from '../hooks/useAuth';
import './GamePage.css';

interface MolePosition {
  id: number;
  x: number;
  y: number;
  isActive: boolean;
  letter: string;
  timeLeft: number;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // 检查是否为本地游戏模式
  const isLocalMode = !user || location.state?.levelConfig?.isLocal;
  
  // 根据模式选择对应的游戏钩子
  const onlineGame = useGame();
  const localGame = useLocalGame();
  
  const gameHook = isLocalMode ? localGame : onlineGame;
  
  const {
    score,
    level,
    timeLeft,
    isGameActive,
    startGame,
    endGame,
    handleKeyPress,
    moles,
    combo,
    hits,
    misses
  } = gameHook;

  const [maxCombo, setMaxCombo] = useState(0);
  const [hitEffects, setHitEffects] = useState<{[key: string]: 'hit' | 'miss'}>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化音频上下文
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 播放音效
  const playSound = useCallback((frequency: number, duration: number = 0.1) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  // 处理键盘输入（使用游戏钩子的处理函数）
  const handleKeyboardInput = useCallback((key: string) => {
    const result = handleKeyPress(key);
    if (result) {
      if (result.combo) {
        setMaxCombo(prev => Math.max(prev, result.combo));
      }
      
      // 添加视觉效果
      if (result.hit) {
        const moleId = result.moleId || '0';
        setHitEffects(prev => ({ ...prev, [moleId]: 'hit' }));
        playSound(800 + result.combo * 50); // 击中音效，连击越高音调越高
        
        // 清除效果
        setTimeout(() => {
          setHitEffects(prev => {
            const newEffects = { ...prev };
            delete newEffects[moleId];
            return newEffects;
          });
        }, 500);
      } else {
        playSound(200, 0.2); // 错过音效
      }
    }
  }, [handleKeyPress, playSound]);

  useKeyboard({ onKeyPress: handleKeyboardInput });



  // 游戏结束处理
  useEffect(() => {
    if (timeLeft <= 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  const handleStartGame = () => {
    if (isLocalMode) {
      // 本地模式：使用第一个可用关卡或默认关卡ID
      const firstLevel = localGame.levels?.[0];
      if (firstLevel) {
        startGame(firstLevel.id);
      } else {
        // 如果没有关卡，使用默认ID 1
        startGame(1);
      }
    } else if (level) {
      // 在线模式：使用当前选择的关卡
      startGame(level.id);
    }
    setMaxCombo(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">得分</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">等级</span>
            <span className="stat-value">{level?.name || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">时间</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">连击</span>
            <span className="stat-value combo">{combo}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        {!isGameActive && timeLeft > 0 && (
          <div className="game-start-overlay">
            <div className="start-content">
              <div className="game-title">
                <h2>🐹 可爱打地鼠打字游戏 🐹</h2>
                <div className="title-decoration">
                  <span>✨</span>
                  <span>🌟</span>
                  <span>✨</span>
                </div>
              </div>
              <div className="game-preview">
                <div className="preview-mole">
                  <div className="mole-body preview">
                    <span className="mole-letter">A</span>
                  </div>
                </div>
                <div className="preview-arrow">👆</div>
                <p>按下对应字母键击打可爱的鼹鼠！</p>
              </div>
              <div className="game-tips">
                <div className="tip-item">
                  <span className="tip-icon">⚡</span>
                  <span>快速击中获得更高分数</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔥</span>
                  <span>连击可以获得额外加分</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span>提高准确率获得更好成绩</span>
                </div>
              </div>
              <button className="start-button" onClick={handleStartGame}>
                <span>🎮</span>
                开始游戏
                <span>🎮</span>
              </button>
            </div>
          </div>
        )}

        {isGameActive && (
          <div className="game-field">
            {moles.map(mole => (
              <div
                key={mole.id}
                className={`mole ${hitEffects[mole.id] || ''} ${mole.isHit ? 'hit' : ''} ${mole.isMissed ? 'miss' : ''}`}
                style={{
                  left: `${mole.x}%`,
                  top: `${mole.y}%`
                }}
              >
                <div className="mole-body">
                  <span className="mole-letter">{mole.letter}</span>
                  {mole.isHit && (
                    <div className="hit-effect">
                      <span className="hit-score">+{mole.points || 100}</span>
                      <div className="hit-sparkles">
                        <span>✨</span>
                        <span>⭐</span>
                        <span>💫</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isGameActive && timeLeft <= 0 && (
          <div className="game-end-overlay">
            <div className="end-content">
              <h2>游戏结束！</h2>
              <div className="final-stats">
                <div className="final-stat">
                  <span className="final-label">最终得分</span>
                  <span className="final-value">{score}</span>
                </div>
                <div className="final-stat">
                  <span className="final-label">最高连击</span>
                  <span className="final-value">{maxCombo}</span>
                </div>
                <div className="final-stat">
                  <span className="final-label">命中率</span>
                  <span className="final-value">
                    {hits > 0 
                      ? Math.round((hits / (hits + misses)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
              <div className="end-actions">
                <button className="restart-button" onClick={handleStartGame}>
                  再玩一次
                </button>
                <button className="back-button" onClick={() => window.history.back()}>
                  返回
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="game-instructions">
        <h3>游戏说明</h3>
        <ul>
          <li>鼹鼠会随机出现在屏幕上，每个鼹鼠都有一个字母</li>
          <li>快速按下对应的字母键来击打鼹鼠</li>
          <li>连续击中可以获得连击加分</li>
          <li>鼹鼠会在几秒后自动消失</li>
        </ul>
      </div>
    </div>
  );
};

export default GamePage;