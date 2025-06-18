import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LevelSelectPage.css';

interface Level {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  stars: number;
  requiredScore: number;
  timeLimit: number;
  moleSpeed: number;
  maxMoles: number;
}

const LevelSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  // 模拟关卡数据
  const [levels, setLevels] = useState<Level[]>([
    {
      id: 1,
      name: '新手训练',
      description: '适合初学者的简单关卡，鼹鼠移动较慢，给你充足的反应时间。',
      difficulty: 'easy',
      unlocked: true,
      completed: true,
      bestScore: 1250,
      stars: 3,
      requiredScore: 500,
      timeLimit: 120,
      moleSpeed: 3000,
      maxMoles: 2
    },
    {
      id: 2,
      name: '基础挑战',
      description: '稍微增加难度，鼹鼠数量增加，需要更快的反应速度。',
      difficulty: 'easy',
      unlocked: true,
      completed: true,
      bestScore: 890,
      stars: 2,
      requiredScore: 800,
      timeLimit: 100,
      moleSpeed: 2500,
      maxMoles: 3
    },
    {
      id: 3,
      name: '速度考验',
      description: '鼹鼠出现频率增加，考验你的打字速度和准确性。',
      difficulty: 'medium',
      unlocked: true,
      completed: false,
      bestScore: 0,
      stars: 0,
      requiredScore: 1200,
      timeLimit: 90,
      moleSpeed: 2000,
      maxMoles: 4
    },
    {
      id: 4,
      name: '反应极限',
      description: '鼹鼠移动更快，出现时间更短，需要极快的反应速度。',
      difficulty: 'medium',
      unlocked: false,
      completed: false,
      bestScore: 0,
      stars: 0,
      requiredScore: 1500,
      timeLimit: 80,
      moleSpeed: 1800,
      maxMoles: 5
    },
    {
      id: 5,
      name: '混乱模式',
      description: '多个鼹鼠同时出现，字母随机变化，真正的挑战开始！',
      difficulty: 'hard',
      unlocked: false,
      completed: false,
      bestScore: 0,
      stars: 0,
      requiredScore: 2000,
      timeLimit: 70,
      moleSpeed: 1500,
      maxMoles: 6
    },
    {
      id: 6,
      name: '大师试炼',
      description: '最高难度，鼹鼠数量最多，速度最快，只有真正的大师才能通过。',
      difficulty: 'expert',
      unlocked: false,
      completed: false,
      bestScore: 0,
      stars: 0,
      requiredScore: 3000,
      timeLimit: 60,
      moleSpeed: 1200,
      maxMoles: 8
    }
  ]);

  // 根据用户进度解锁关卡
  useEffect(() => {
    // 这里应该从后端获取用户的关卡进度
    // 暂时使用模拟数据
    const userProgress = {
      completedLevels: [1, 2],
      unlockedLevels: [1, 2, 3]
    };

    setLevels(prev => prev.map(level => ({
      ...level,
      unlocked: userProgress.unlockedLevels.includes(level.id),
      completed: userProgress.completedLevels.includes(level.id)
    })));
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

  const handleLevelClick = (level: Level) => {
    if (!level.unlocked) return;
    setSelectedLevel(level);
    setShowLevelDetails(true);
  };

  const handleStartLevel = () => {
    if (selectedLevel) {
      // 这里应该设置游戏配置并跳转到游戏页面
      navigate('/game', { 
        state: { 
          levelConfig: {
            id: selectedLevel.id,
            timeLimit: selectedLevel.timeLimit,
            moleSpeed: selectedLevel.moleSpeed,
            maxMoles: selectedLevel.maxMoles,
            requiredScore: selectedLevel.requiredScore
          }
        }
      });
    }
  };

  const closeLevelDetails = () => {
    setShowLevelDetails(false);
    setSelectedLevel(null);
  };

  return (
    <div className="level-select-page">
      <div className="page-header">
        <h1>选择关卡</h1>
        <p>选择一个关卡开始你的打字冒险之旅！</p>
      </div>

      <div className="user-progress">
        <div className="progress-item">
          <span className="progress-label">已完成关卡</span>
          <span className="progress-value">
            {levels.filter(l => l.completed).length} / {levels.length}
          </span>
        </div>
        <div className="progress-item">
          <span className="progress-label">总星数</span>
          <span className="progress-value">
            {levels.reduce((sum, l) => sum + l.stars, 0)} / {levels.length * 3}
          </span>
        </div>
        <div className="progress-item">
          <span className="progress-label">最高分</span>
          <span className="progress-value">
            {Math.max(...levels.map(l => l.bestScore))}
          </span>
        </div>
      </div>

      <div className="levels-grid">
        {levels.map(level => (
          <div
            key={level.id}
            className={`level-card ${
              level.unlocked ? 'unlocked' : 'locked'
            } ${level.completed ? 'completed' : ''}`}
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
              
              {level.unlocked ? (
                <>
                  <div className="level-stats">
                    <div className="stat">
                      <span className="stat-label">最佳分数</span>
                      <span className="stat-value">{level.bestScore}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">目标分数</span>
                      <span className="stat-value">{level.requiredScore}</span>
                    </div>
                  </div>
                  
                  <div className="level-stars">
                    {renderStars(level.stars)}
                  </div>
                </>
              ) : (
                <div className="locked-content">
                  <div className="lock-icon">🔒</div>
                  <p>完成前面的关卡解锁</p>
                </div>
              )}
            </div>
            
            {level.completed && (
              <div className="completed-badge">
                ✓
              </div>
            )}
          </div>
        ))}
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
                  <span className="detail-value">{selectedLevel.requiredScore}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">最大鼹鼠数</span>
                  <span className="detail-value">{selectedLevel.maxMoles}</span>
                </div>
              </div>
              
              {selectedLevel.completed && (
                <div className="best-score-section">
                  <h3>最佳成绩</h3>
                  <div className="best-score-display">
                    <span className="score">{selectedLevel.bestScore}</span>
                    <div className="stars-display">
                      {renderStars(selectedLevel.stars)}
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