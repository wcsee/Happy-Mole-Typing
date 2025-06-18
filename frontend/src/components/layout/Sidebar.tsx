import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      path: '/',
      icon: '🏠',
      label: '首页',
      description: '返回主页'
    },
    {
      path: '/levels',
      icon: '🎯',
      label: '关卡选择',
      description: '选择游戏关卡'
    },
    {
      path: '/game',
      icon: '🎮',
      label: '开始游戏',
      description: '立即开始游戏'
    },
    {
      path: '/leaderboard',
      icon: '🏆',
      label: '排行榜',
      description: '查看高分榜'
    },
    {
      path: '/profile',
      icon: '👤',
      label: '个人资料',
      description: '查看个人统计'
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: '设置',
      description: '游戏设置'
    }
  ];

  const quickStats = {
    level: user?.level || 1,
    experience: user?.experience || 0,
    nextLevelExp: 1000,
    totalGames: user?.totalGames || 0,
    bestScore: user?.bestScore || 0,
    averageWPM: user?.averageWPM || 0
  };

  const achievements = [
    {
      id: 1,
      icon: '🥇',
      title: '速度之王',
      description: 'WPM达到100',
      unlocked: quickStats.averageWPM >= 100
    },
    {
      id: 2,
      icon: '🎯',
      title: '精准射手',
      description: '准确率达到95%',
      unlocked: false
    },
    {
      id: 3,
      icon: '🔥',
      title: '连击大师',
      description: '连击达到50',
      unlocked: false
    },
    {
      id: 4,
      icon: '⭐',
      title: '完美主义者',
      description: '完成所有关卡',
      unlocked: false
    }
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const experiencePercentage = (quickStats.experience / quickStats.nextLevelExp) * 100;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🐹</span>
            {!isCollapsed && (
              <span className="logo-text">Happy Mole</span>
            )}
          </div>
          
          <div className="sidebar-controls">
            <button 
              className="collapse-button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              {isCollapsed ? '▶' : '◀'}
            </button>
            
            <button 
              className="close-button"
              onClick={onClose}
              aria-label="关闭侧边栏"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          {/* User Info */}
          {user && (
            <div className="user-section">
              <div className="user-avatar">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.username}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0YTkwZTIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
                  }}
                />
              </div>
              
              {!isCollapsed && (
                <div className="user-info">
                  <h3 className="username">{user.username}</h3>
                  <div className="user-level">
                    <span className="level-badge">Lv.{quickStats.level}</span>
                  </div>
                  
                  <div className="experience-bar">
                    <div className="exp-info">
                      <span className="exp-text">
                        {quickStats.experience}/{quickStats.nextLevelExp} EXP
                      </span>
                    </div>
                    <div className="exp-bar">
                      <div 
                        className="exp-fill"
                        style={{ width: `${experiencePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={onClose}
                    title={isCollapsed ? item.label : item.description}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                    {isActive(item.path) && (
                      <div className="active-indicator" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Stats */}
          {!isCollapsed && user && (
            <div className="quick-stats">
              <h4 className="stats-title">快速统计</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-icon">🎮</span>
                  <div className="stat-content">
                    <span className="stat-value">{quickStats.totalGames}</span>
                    <span className="stat-label">总游戏数</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-icon">🏆</span>
                  <div className="stat-content">
                    <span className="stat-value">{quickStats.bestScore.toLocaleString()}</span>
                    <span className="stat-label">最高分</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-icon">⚡</span>
                  <div className="stat-content">
                    <span className="stat-value">{quickStats.averageWPM}</span>
                    <span className="stat-label">平均WPM</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          {!isCollapsed && user && (
            <div className="achievements-section">
              <h4 className="achievements-title">成就</h4>
              <div className="achievements-list">
                {achievements.slice(0, 3).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    title={achievement.description}
                  >
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-content">
                      <span className="achievement-title">{achievement.title}</span>
                      <span className="achievement-description">{achievement.description}</span>
                    </div>
                    {achievement.unlocked && (
                      <div className="unlock-indicator">✓</div>
                    )}
                  </div>
                ))}
              </div>
              
              <Link to="/profile" className="view-all-achievements" onClick={onClose}>
                查看全部成就 →
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {user ? (
            <button 
              className="logout-button"
              onClick={handleLogout}
              title={isCollapsed ? '退出登录' : undefined}
            >
              <span className="logout-icon">🚪</span>
              {!isCollapsed && <span className="logout-text">退出登录</span>}
            </button>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="auth-button login"
                onClick={onClose}
                title={isCollapsed ? '登录' : undefined}
              >
                <span className="auth-icon">🔑</span>
                {!isCollapsed && <span className="auth-text">登录</span>}
              </Link>
              
              {!isCollapsed && (
                <Link 
                  to="/register" 
                  className="auth-button register"
                  onClick={onClose}
                >
                  <span className="auth-icon">📝</span>
                  <span className="auth-text">注册</span>
                </Link>
              )}
            </div>
          )}
          
          {!isCollapsed && (
            <div className="sidebar-version">
              <span className="version-text">v1.0.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;