import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">
            <span className="digit">4</span>
            <span className="mole-container">
              <div className="mole">
                <div className="mole-body">
                  <div className="mole-eyes">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                  </div>
                  <div className="mole-nose"></div>
                  <div className="mole-mouth"></div>
                </div>
                <div className="mole-paws">
                  <div className="paw left"></div>
                  <div className="paw right"></div>
                </div>
              </div>
            </span>
            <span className="digit">4</span>
          </div>
          
          <h1 className="error-title">页面走丢了！</h1>
          <p className="error-description">
            看起来这只小鼹鼠把页面藏起来了...<br />
            不过别担心，我们来帮你找到正确的路！
          </p>
          
          <div className="error-actions">
            <Link to="/" className="action-button primary">
              <span className="button-icon">🏠</span>
              回到首页
            </Link>
            <Link to="/levels" className="action-button secondary">
              <span className="button-icon">🎮</span>
              开始游戏
            </Link>
            <button 
              className="action-button secondary"
              onClick={() => window.history.back()}
            >
              <span className="button-icon">↩️</span>
              返回上页
            </button>
          </div>
          
          <div className="helpful-links">
            <h3>你可能在寻找：</h3>
            <div className="links-grid">
              <Link to="/" className="helpful-link">
                <span className="link-icon">🏠</span>
                <div className="link-content">
                  <span className="link-title">首页</span>
                  <span className="link-description">回到游戏主页</span>
                </div>
              </Link>
              
              <Link to="/levels" className="helpful-link">
                <span className="link-icon">🎯</span>
                <div className="link-content">
                  <span className="link-title">关卡选择</span>
                  <span className="link-description">选择游戏关卡</span>
                </div>
              </Link>
              
              <Link to="/leaderboard" className="helpful-link">
                <span className="link-icon">🏆</span>
                <div className="link-content">
                  <span className="link-title">排行榜</span>
                  <span className="link-description">查看高分榜</span>
                </div>
              </Link>
              
              <Link to="/profile" className="helpful-link">
                <span className="link-icon">👤</span>
                <div className="link-content">
                  <span className="link-title">个人资料</span>
                  <span className="link-description">查看游戏统计</span>
                </div>
              </Link>
              
              <Link to="/settings" className="helpful-link">
                <span className="link-icon">⚙️</span>
                <div className="link-content">
                  <span className="link-title">设置</span>
                  <span className="link-description">个性化设置</span>
                </div>
              </Link>
              
              <Link to="/login" className="helpful-link">
                <span className="link-icon">🔑</span>
                <div className="link-content">
                  <span className="link-title">登录</span>
                  <span className="link-description">登录你的账户</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="error-tips">
            <h4>小贴士：</h4>
            <ul>
              <li>检查网址是否输入正确</li>
              <li>页面可能已被移动或删除</li>
              <li>尝试刷新页面或清除浏览器缓存</li>
              <li>如果问题持续存在，请联系我们</li>
            </ul>
          </div>
        </div>
        
        <div className="floating-moles">
          <div className="floating-mole mole-1">
            <div className="mini-mole">
              <div className="mini-mole-body"></div>
              <div className="mini-mole-eyes">
                <div className="mini-eye"></div>
                <div className="mini-eye"></div>
              </div>
            </div>
          </div>
          
          <div className="floating-mole mole-2">
            <div className="mini-mole">
              <div className="mini-mole-body"></div>
              <div className="mini-mole-eyes">
                <div className="mini-eye"></div>
                <div className="mini-eye"></div>
              </div>
            </div>
          </div>
          
          <div className="floating-mole mole-3">
            <div className="mini-mole">
              <div className="mini-mole-body"></div>
              <div className="mini-mole-eyes">
                <div className="mini-eye"></div>
                <div className="mini-eye"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;