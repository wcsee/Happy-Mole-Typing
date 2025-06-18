import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './ProfilePage.css';

interface UserStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number;
  accuracy: number;
  wpm: number;
  levelsCompleted: number;
  totalStars: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GameHistory {
  id: string;
  date: Date;
  score: number;
  level: number;
  duration: number;
  accuracy: number;
  wpm: number;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'achievements' | 'settings'>('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  // 模拟用户统计数据
  const [userStats, setUserStats] = useState<UserStats>({
    totalGames: 156,
    totalScore: 45230,
    averageScore: 290,
    bestScore: 1250,
    totalPlayTime: 1847, // 分钟
    accuracy: 87.5,
    wpm: 45,
    levelsCompleted: 12,
    totalStars: 28,
    achievements: [
      {
        id: 'first_game',
        name: '初次尝试',
        description: '完成第一场游戏',
        icon: '🎮',
        unlocked: true,
        unlockedAt: new Date('2024-01-15')
      },
      {
        id: 'speed_demon',
        name: '速度恶魔',
        description: '达到50WPM',
        icon: '⚡',
        unlocked: false
      },
      {
        id: 'accuracy_master',
        name: '精准大师',
        description: '达到95%准确率',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 'combo_king',
        name: '连击之王',
        description: '达到50连击',
        icon: '🔥',
        unlocked: true,
        unlockedAt: new Date('2024-01-20')
      },
      {
        id: 'level_master',
        name: '关卡大师',
        description: '完成所有关卡',
        icon: '👑',
        unlocked: false
      },
      {
        id: 'star_collector',
        name: '星星收集者',
        description: '获得50颗星星',
        icon: '⭐',
        unlocked: false
      }
    ]
  });

  // 模拟游戏历史
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([
    {
      id: '1',
      date: new Date('2024-01-25'),
      score: 1250,
      level: 3,
      duration: 120,
      accuracy: 92,
      wpm: 48
    },
    {
      id: '2',
      date: new Date('2024-01-24'),
      score: 890,
      level: 2,
      duration: 100,
      accuracy: 85,
      wpm: 42
    },
    {
      id: '3',
      date: new Date('2024-01-23'),
      score: 650,
      level: 1,
      duration: 90,
      accuracy: 88,
      wpm: 38
    }
  ]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(); // TODO: Implement profile update with editForm data
      setIsEditing(false);
    } catch (error) {
      console.error('更新资料失败:', error);
    }
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const renderStatsTab = () => (
    <div className="stats-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.totalGames}</div>
            <div className="stat-label">总游戏数</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.bestScore}</div>
            <div className="stat-label">最高分</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.averageScore}</div>
            <div className="stat-label">平均分</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{formatPlayTime(userStats.totalPlayTime)}</div>
            <div className="stat-label">总游戏时间</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.accuracy}%</div>
            <div className="stat-label">准确率</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{userStats.wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
        </div>
      </div>
      
      <div className="progress-section">
        <h3>进度统计</h3>
        <div className="progress-items">
          <div className="progress-item">
            <div className="progress-header">
              <span>关卡完成度</span>
              <span>{userStats.levelsCompleted}/20</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getProgressPercentage(userStats.levelsCompleted, 20)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="progress-item">
            <div className="progress-header">
              <span>星星收集</span>
              <span>{userStats.totalStars}/60</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getProgressPercentage(userStats.totalStars, 60)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="history-content">
      <h3>最近游戏记录</h3>
      <div className="history-list">
        {gameHistory.map(game => (
          <div key={game.id} className="history-item">
            <div className="history-date">
              {formatDate(game.date)}
            </div>
            <div className="history-details">
              <div className="history-score">
                <span className="label">得分:</span>
                <span className="value">{game.score}</span>
              </div>
              <div className="history-level">
                <span className="label">关卡:</span>
                <span className="value">{game.level}</span>
              </div>
              <div className="history-accuracy">
                <span className="label">准确率:</span>
                <span className="value">{game.accuracy}%</span>
              </div>
              <div className="history-wpm">
                <span className="label">WPM:</span>
                <span className="value">{game.wpm}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="achievements-content">
      <h3>成就系统</h3>
      <div className="achievements-grid">
        {userStats.achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="achievement-date">
                  解锁于 {formatDate(achievement.unlockedAt)}
                </div>
              )}
            </div>
            {achievement.unlocked && (
              <div className="achievement-badge">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="settings-content">
      <h3>个人设置</h3>
      
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="save-btn">
              保存
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">用户名:</span>
            <span className="info-value">{user?.username}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">邮箱:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">注册时间:</span>
            <span className="info-value">{user?.createdAt ? formatDate(new Date(user.createdAt)) : '未知'}</span>
          </div>
          
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            编辑资料
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt="用户头像"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMCA3NUMyMCA2NS41IDI4LjUgNTcgMzkgNTdINjFDNzEuNSA1NyA4MCA2NS41IDgwIDc1VjEwMEgyMFY3NVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
            }}
          />
        </div>
        <div className="profile-info">
          <h1>{user?.username}</h1>
          <p>{user?.email}</p>
          <div className="profile-stats-summary">
            <span>等级 {Math.floor(userStats.totalScore / 1000) + 1}</span>
            <span>•</span>
            <span>{userStats.totalGames} 场游戏</span>
            <span>•</span>
            <span>{userStats.totalStars} 颗星星</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          统计数据
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          游戏历史
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          成就
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          设置
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default ProfilePage;