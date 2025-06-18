import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LeaderboardPage.css';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  score: number;
  level: number;
  accuracy: number;
  wpm: number;
  gamesPlayed: number;
  lastPlayed: Date;
  rank: number;
}

type LeaderboardType = 'score' | 'wpm' | 'accuracy' | 'level';
type TimeFilter = 'all' | 'week' | 'month';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('score');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟排行榜数据
  const mockLeaderboardData: Record<LeaderboardType, LeaderboardEntry[]> = {
    score: [
      {
        id: '1',
        username: 'TypeMaster',
        score: 2850,
        level: 15,
        accuracy: 96.5,
        wpm: 78,
        gamesPlayed: 245,
        lastPlayed: new Date('2024-01-25'),
        rank: 1
      },
      {
        id: '2',
        username: 'SpeedDemon',
        score: 2720,
        level: 14,
        accuracy: 94.2,
        wpm: 82,
        gamesPlayed: 198,
        lastPlayed: new Date('2024-01-24'),
        rank: 2
      },
      {
        id: '3',
        username: 'KeyboardNinja',
        score: 2650,
        level: 13,
        accuracy: 97.8,
        wpm: 75,
        gamesPlayed: 312,
        lastPlayed: new Date('2024-01-23'),
        rank: 3
      },
      {
        id: '4',
        username: 'FastFingers',
        score: 2580,
        level: 12,
        accuracy: 93.1,
        wpm: 80,
        gamesPlayed: 167,
        lastPlayed: new Date('2024-01-22'),
        rank: 4
      },
      {
        id: '5',
        username: 'TypingPro',
        score: 2450,
        level: 11,
        accuracy: 95.7,
        wpm: 72,
        gamesPlayed: 289,
        lastPlayed: new Date('2024-01-21'),
        rank: 5
      },
      {
        id: '6',
        username: user?.username || 'CurrentUser',
        score: 1250,
        level: 8,
        accuracy: 87.5,
        wpm: 45,
        gamesPlayed: 156,
        lastPlayed: new Date('2024-01-25'),
        rank: 15
      }
    ],
    wpm: [
      {
        id: '2',
        username: 'SpeedDemon',
        score: 2720,
        level: 14,
        accuracy: 94.2,
        wpm: 82,
        gamesPlayed: 198,
        lastPlayed: new Date('2024-01-24'),
        rank: 1
      },
      {
        id: '4',
        username: 'FastFingers',
        score: 2580,
        level: 12,
        accuracy: 93.1,
        wpm: 80,
        gamesPlayed: 167,
        lastPlayed: new Date('2024-01-22'),
        rank: 2
      },
      {
        id: '1',
        username: 'TypeMaster',
        score: 2850,
        level: 15,
        accuracy: 96.5,
        wpm: 78,
        gamesPlayed: 245,
        lastPlayed: new Date('2024-01-25'),
        rank: 3
      }
    ],
    accuracy: [
      {
        id: '3',
        username: 'KeyboardNinja',
        score: 2650,
        level: 13,
        accuracy: 97.8,
        wpm: 75,
        gamesPlayed: 312,
        lastPlayed: new Date('2024-01-23'),
        rank: 1
      },
      {
        id: '1',
        username: 'TypeMaster',
        score: 2850,
        level: 15,
        accuracy: 96.5,
        wpm: 78,
        gamesPlayed: 245,
        lastPlayed: new Date('2024-01-25'),
        rank: 2
      }
    ],
    level: [
      {
        id: '1',
        username: 'TypeMaster',
        score: 2850,
        level: 15,
        accuracy: 96.5,
        wpm: 78,
        gamesPlayed: 245,
        lastPlayed: new Date('2024-01-25'),
        rank: 1
      },
      {
        id: '2',
        username: 'SpeedDemon',
        score: 2720,
        level: 14,
        accuracy: 94.2,
        wpm: 82,
        gamesPlayed: 198,
        lastPlayed: new Date('2024-01-24'),
        rank: 2
      }
    ]
  };

  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      const data = mockLeaderboardData[leaderboardType] || [];
      setLeaderboardData(data);
      
      // 查找当前用户排名
      const currentUserEntry = data.find(entry => entry.username === user?.username);
      setUserRank(currentUserEntry || null);
      
      setLoading(false);
    }, 500);
  }, [leaderboardType, timeFilter, user?.username]);

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'score': return '最高分排行榜';
      case 'wpm': return 'WPM排行榜';
      case 'accuracy': return '准确率排行榜';
      case 'level': return '等级排行榜';
      default: return '排行榜';
    }
  };

  const getTimeFilterText = () => {
    switch (timeFilter) {
      case 'all': return '全部时间';
      case 'week': return '本周';
      case 'month': return '本月';
      default: return '全部时间';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'rank-normal';
    }
  };

  const getPrimaryValue = (entry: LeaderboardEntry) => {
    switch (leaderboardType) {
      case 'score': return entry.score.toLocaleString();
      case 'wpm': return `${entry.wpm} WPM`;
      case 'accuracy': return `${entry.accuracy}%`;
      case 'level': return `等级 ${entry.level}`;
      default: return entry.score.toLocaleString();
    }
  };

  const isCurrentUser = (entry: LeaderboardEntry) => {
    return entry.username === user?.username;
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>加载排行榜中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>排行榜</h1>
        <p>与全球玩家一较高下！</p>
      </div>

      <div className="leaderboard-controls">
        <div className="control-group">
          <label>排行榜类型:</label>
          <div className="button-group">
            <button
              className={leaderboardType === 'score' ? 'active' : ''}
              onClick={() => setLeaderboardType('score')}
            >
              最高分
            </button>
            <button
              className={leaderboardType === 'wpm' ? 'active' : ''}
              onClick={() => setLeaderboardType('wpm')}
            >
              WPM
            </button>
            <button
              className={leaderboardType === 'accuracy' ? 'active' : ''}
              onClick={() => setLeaderboardType('accuracy')}
            >
              准确率
            </button>
            <button
              className={leaderboardType === 'level' ? 'active' : ''}
              onClick={() => setLeaderboardType('level')}
            >
              等级
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>时间范围:</label>
          <div className="button-group">
            <button
              className={timeFilter === 'all' ? 'active' : ''}
              onClick={() => setTimeFilter('all')}
            >
              全部时间
            </button>
            <button
              className={timeFilter === 'week' ? 'active' : ''}
              onClick={() => setTimeFilter('week')}
            >
              本周
            </button>
            <button
              className={timeFilter === 'month' ? 'active' : ''}
              onClick={() => setTimeFilter('month')}
            >
              本月
            </button>
          </div>
        </div>
      </div>

      {userRank && (
        <div className="user-rank-card">
          <div className="user-rank-header">
            <h3>你的排名</h3>
          </div>
          <div className="user-rank-content">
            <div className="rank-position">
              <span className="rank-number">{getRankIcon(userRank.rank)}</span>
            </div>
            <div className="user-info">
              <div className="username">{userRank.username}</div>
              <div className="user-stats">
                <span>等级 {userRank.level}</span>
                <span>•</span>
                <span>{userRank.gamesPlayed} 场游戏</span>
              </div>
            </div>
            <div className="primary-value">
              {getPrimaryValue(userRank)}
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h2>{getLeaderboardTitle()}</h2>
          <span className="time-filter-display">{getTimeFilterText()}</span>
        </div>

        <div className="leaderboard-list">
          {leaderboardData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>暂无数据</h3>
              <p>该时间范围内暂无排行榜数据</p>
            </div>
          ) : (
            leaderboardData.map((entry, index) => (
              <div
                key={entry.id}
                className={`leaderboard-item ${
                  getRankClass(entry.rank)
                } ${isCurrentUser(entry) ? 'current-user' : ''}`}
              >
                <div className="rank-section">
                  <span className="rank-display">
                    {getRankIcon(entry.rank)}
                  </span>
                </div>

                <div className="player-info">
                  <div className="player-avatar">
                    <img
                      src={entry.avatar || '/default-avatar.png'}
                      alt={entry.username}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTQiIHI9IjYiIGZpbGw9IiNDQ0MiLz4KPHBhdGggZD0iTTggMzBDOCAyNi4yIDExLjIgMjMgMTUgMjNIMjVDMjguOCAyMyAzMiAyNi4yIDMyIDMwVjQwSDhWMzBaIiBmaWxsPSIjQ0NDIi8+Cjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="player-details">
                    <div className="player-name">
                      {entry.username}
                      {isCurrentUser(entry) && (
                        <span className="you-badge">你</span>
                      )}
                    </div>
                    <div className="player-stats">
                      <span>等级 {entry.level}</span>
                      <span>•</span>
                      <span>{entry.gamesPlayed} 场游戏</span>
                      <span>•</span>
                      <span>最后游戏: {formatDate(entry.lastPlayed)}</span>
                    </div>
                  </div>
                </div>

                <div className="score-section">
                  <div className="primary-score">
                    {getPrimaryValue(entry)}
                  </div>
                  <div className="secondary-stats">
                    {leaderboardType !== 'accuracy' && (
                      <span>准确率: {entry.accuracy}%</span>
                    )}
                    {leaderboardType !== 'wpm' && (
                      <span>WPM: {entry.wpm}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="leaderboard-footer">
        <p>排行榜每小时更新一次</p>
        <p>继续游戏提升你的排名！</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;