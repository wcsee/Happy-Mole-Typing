import React, { useState, useEffect, useCallback } from 'react';
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

  // 处理键盘输入（使用游戏钩子的处理函数）
  const handleKeyboardInput = useCallback((key: string) => {
    const result = handleKeyPress(key);
    if (result && result.combo) {
      setMaxCombo(prev => Math.max(prev, result.combo));
    }
  }, [handleKeyPress]);

  useKeyboard({ onKeyPress: handleKeyboardInput });



  // 游戏结束处理
  useEffect(() => {
    if (timeLeft <= 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  const handleStartGame = () => {
    if (level) {
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
              <h2>打地鼠打字游戏</h2>
              <p>按下对应字母键击打鼹鼠！</p>
              <button className="start-button" onClick={handleStartGame}>
                开始游戏
              </button>
            </div>
          </div>
        )}

        {isGameActive && (
          <div className="game-field">
            {moles.map(mole => (
              <div
                key={mole.id}
                className="mole"
                style={{
                  left: `${mole.x}%`,
                  top: `${mole.y}%`
                }}
              >
                <div className="mole-body">
                  <span className="mole-letter">{mole.letter}</span>
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