import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
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
  const {
    score,
    level,
    timeLeft,
    isGameActive,
    startGame,
    endGame,
    updateScore,
    gameStats
  } = useGame();

  const [moles, setMoles] = useState<MolePosition[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // 生成随机字母
  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  // 生成鼹鼠位置
  const generateMolePosition = (id: number): MolePosition => {
    return {
      id,
      x: Math.random() * 80 + 10, // 10% - 90% 的位置
      y: Math.random() * 60 + 20, // 20% - 80% 的位置
      isActive: true,
      letter: generateRandomLetter(),
      timeLeft: 3000 + Math.random() * 2000 // 3-5秒
    };
  };

  // 添加新鼹鼠
  const addMole = useCallback(() => {
    if (!isGameActive) return;
    
    const newMole = generateMolePosition(Date.now());
    setMoles(prev => [...prev, newMole]);
    
    // 设置鼹鼠消失时间
    setTimeout(() => {
      setMoles(prev => prev.filter(mole => mole.id !== newMole.id));
      if (currentTarget === newMole.letter) {
        setCurrentTarget('');
        setCombo(0);
      }
    }, newMole.timeLeft);
  }, [isGameActive, currentTarget]);

  // 处理键盘输入
  const handleKeyPress = useCallback((key: string) => {
    if (!isGameActive) return;
    
    const targetMole = moles.find(mole => mole.letter === key.toUpperCase() && mole.isActive);
    
    if (targetMole) {
      // 击中鼹鼠
      setMoles(prev => prev.filter(mole => mole.id !== targetMole.id));
      const points = 10 + combo * 2; // 连击加分
      // updateScore(points); // TODO: Implement score update logic
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setCurrentTarget('');
    } else {
      // 未击中
      setCombo(0);
    }
  }, [isGameActive, moles, combo, updateScore]);

  useKeyboard({ onKeyPress: handleKeyPress });

  // 游戏循环
  useEffect(() => {
    if (!isGameActive) return;
    
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && moles.length < 5) { // 30%概率生成新鼹鼠，最多5个
        addMole();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isGameActive, moles.length, addMole]);

  // 游戏结束处理
  useEffect(() => {
    if (timeLeft <= 0 && isGameActive) {
      endGame();
      setMoles([]);
    }
  }, [timeLeft, isGameActive, endGame]);

  const handleStartGame = () => {
    if (level) {
      startGame(level.id);
    }
    setMoles([]);
    setCombo(0);
    setMaxCombo(0);
    setCurrentTarget('');
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
                    {gameStats.totalHits > 0 
                      ? Math.round((gameStats.totalHits / (gameStats.totalHits + gameStats.totalMisses)) * 100)
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