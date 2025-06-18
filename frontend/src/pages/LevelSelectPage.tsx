import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { localGameService } from '../services/localGameService';
import { GameLevel } from '../types/game';
import './LevelSelectPage.css';

const LevelSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localBestScores, setLocalBestScores] = useState<{ [levelId: number]: any }>({});

  // 加载关卡数据和本地最佳分数
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [levelsData, bestScores] = await Promise.all([
          localGameService.getLevels(),
          Promise.resolve(localGameService.getLocalBestScores())
        ]);
        
        setLevels(levelsData);
        setLocalBestScores(bestScores);
      } catch (error) {
        console.error('Failed to load levels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      case 'expert': return '专家';
      default: return '未知';
    }
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 3 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < stars ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  const handleLevelClick = (level: GameLevel) => {
    // 本地游戏模式所有关卡都解锁
    setSelectedLevel(level);
    setShowLevelDetails(true);
  };

  const handleStartLevel = () => {
    if (selectedLevel) {
      // 跳转到游戏页面，传递关卡配置
      navigate('/game', { 
        state: { 
          levelConfig: {
            id: selectedLevel.id,
            timeLimit: selectedLevel.timeLimit,
            moleSpeed: selectedLevel.moleSpeed,
            maxMoles: selectedLevel.maxMoles,
            targetScore: selectedLevel.targetScore,
            isLocal: true // 标记为本地游戏
          }
        }
      });
    }
  };

  const closeLevelDetails = () => {
    setShowLevelDetails(false);
    setSelectedLevel(null);
  };

  if (isLoading) {
    return (
      <div className="level-select-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载关卡中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="level-select-page">
      <div className="page-header">
        <h1>选择关卡</h1>
        <p>{user ? '选择一个关卡开始你的打字冒险之旅！' : '试玩模式 - 无需登录即可体验游戏！'}</p>
      </div>

      <div className="user-progress">
        <div className="progress-item">
          <span className="progress-label">可用关卡</span>
          <span className="progress-value">
            {levels.length} 个关卡
          </span>
        </div>
        <div className="progress-item">
          <span className="progress-label">本地最高分</span>
          <span className="progress-value">
            {Object.values(localBestScores).length > 0 
              ? Math.max(...Object.values(localBestScores).map((s: any) => s.score))
              : 0
            }
          </span>
        </div>
        <div className="progress-item">
          <span className="progress-label">游戏模式</span>
          <span className="progress-value">
            {user ? '在线模式' : '试玩模式'}
          </span>
        </div>
      </div>

      <div className="levels-grid">
        {levels.map(level => {
          const localBest = localBestScores[level.id];
          return (
            <div
              key={level.id}
              className={`level-card unlocked ${localBest ? 'completed' : ''}`}
              onClick={() => handleLevelClick(level)}
            >
              <div className="level-header">
                <div className="level-number">{level.id}</div>
                <div 
                  className="level-difficulty"
                  style={{ backgroundColor: getDifficultyColor(level.difficulty) }}
                >
                  {getDifficultyText(level.difficulty)}
                </div>
              </div>
              
              <div className="level-content">
                <h3 className="level-name">{level.name}</h3>
                
                <div className="level-stats">
                  <div className="stat">
                    <span className="stat-label">最佳分数</span>
                    <span className="stat-value">{localBest ? localBest.score : 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">目标分数</span>
                    <span className="stat-value">{level.targetScore}</span>
                  </div>
                </div>
                
                {localBest && (
                  <div className="level-stats">
                    <div className="stat">
                      <span className="stat-label">准确率</span>
                      <span className="stat-value">{Math.round(localBest.accuracy)}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">WPM</span>
                      <span className="stat-value">{Math.round(localBest.wpm)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {localBest && (
                <div className="completed-badge">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 关卡详情弹窗 */}
      {showLevelDetails && selectedLevel && (
        <div className="level-details-overlay" onClick={closeLevelDetails}>
          <div className="level-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedLevel.name}</h2>
              <button className="close-button" onClick={closeLevelDetails}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="level-description">
                <p>{selectedLevel.description}</p>
              </div>
              
              <div className="level-details-grid">
                <div className="detail-item">
                  <span className="detail-label">难度</span>
                  <span 
                    className="detail-value difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(selectedLevel.difficulty) }}
                  >
                    {getDifficultyText(selectedLevel.difficulty)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">时间限制</span>
                  <span className="detail-value">{selectedLevel.timeLimit}秒</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">目标分数</span>
                  <span className="detail-value">{selectedLevel.targetScore}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">最大鼹鼠数</span>
                  <span className="detail-value">{selectedLevel.maxMoles}</span>
                </div>
              </div>
              
              {localBestScores[selectedLevel.id] && (
                <div className="best-score-section">
                  <h3>本地最佳成绩</h3>
                  <div className="best-score-display">
                    <div className="score-stats">
                      <div className="score-item">
                        <span className="score-label">分数</span>
                        <span className="score-value">{localBestScores[selectedLevel.id].score}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">准确率</span>
                        <span className="score-value">{Math.round(localBestScores[selectedLevel.id].accuracy)}%</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">WPM</span>
                        <span className="score-value">{Math.round(localBestScores[selectedLevel.id].wpm)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeLevelDetails}>
                取消
              </button>
              <button className="start-button" onClick={handleStartLevel}>
                开始游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelSelectPage;