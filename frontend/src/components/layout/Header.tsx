import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMenus}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="8" cy="10" r="2" />
              <circle cx="16" cy="10" r="2" />
              <path d="M8 16s1.5 2 4 2 4-2 4-2" />
            </svg>
          </div>
          <span className="logo-text">快乐打地鼠</span>
        </Link>

        {/* Navigation */}
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/levels" className="nav-link" onClick={closeMenus}>
                关卡选择
              </Link>
              <Link to="/game" className="nav-link" onClick={closeMenus}>
                开始游戏
              </Link>
              <Link to="/leaderboard" className="nav-link" onClick={closeMenus}>
                排行榜
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={closeMenus}>
                首页
              </Link>
              <Link to="/levels" className="nav-link" onClick={closeMenus}>
                试玩游戏
              </Link>
              <a href="#features" className="nav-link" onClick={closeMenus}>
                特色
              </a>
              <a href="#how-to-play" className="nav-link" onClick={closeMenus}>
                玩法
              </a>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="user-name">{user?.username}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`chevron ${isUserMenuOpen ? 'open' : ''}`}
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={closeMenus}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    个人资料
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={closeMenus}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                    </svg>
                    设置
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost" onClick={closeMenus}>
                登录
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenus}>
                注册
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="切换菜单"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenus}></div>
      )}
      
      {/* User Menu Overlay */}
      {isUserMenuOpen && (
        <div className="user-menu-overlay" onClick={closeMenus}></div>
      )}
    </header>
  );
};

export default Header;