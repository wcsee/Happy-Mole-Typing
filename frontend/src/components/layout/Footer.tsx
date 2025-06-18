import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🐹</span>
              <span className="logo-text">Happy Mole Typing</span>
            </div>
            <p className="footer-description">
              一个有趣的打字练习游戏，通过打地鼠的方式提高你的打字速度和准确性。
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <span className="social-icon">📱</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <span className="social-icon">💬</span>
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <span className="social-icon">📧</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">快速链接</h3>
            <ul className="footer-links">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/levels">关卡选择</Link></li>
              <li><Link to="/leaderboard">排行榜</Link></li>
              <li><Link to="/profile">个人资料</Link></li>
            </ul>
          </div>

          {/* Game Info */}
          <div className="footer-section">
            <h3 className="footer-title">游戏信息</h3>
            <ul className="footer-links">
              <li><a href="#">游戏规则</a></li>
              <li><a href="#">键盘布局</a></li>
              <li><a href="#">练习技巧</a></li>
              <li><a href="#">常见问题</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-title">支持</h3>
            <ul className="footer-links">
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">反馈建议</a></li>
              <li><a href="#">报告问题</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-title">法律信息</h3>
            <ul className="footer-links">
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务条款</a></li>
              <li><a href="#">Cookie政策</a></li>
              <li><a href="#">版权声明</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Happy Mole Typing. 保留所有权利。</p>
            </div>
            
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-text">10,000+ 玩家</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span className="stat-text">50+ 关卡</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-text">实时排行</span>
              </div>
            </div>
            
            <div className="footer-meta">
              <span className="version">v1.0.0</span>
              <span className="separator">•</span>
              <span className="build-info">Build 2024.01</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="footer-decoration">
        <div className="decoration-mole mole-1">
          <div className="mini-mole">
            <div className="mini-mole-body"></div>
            <div className="mini-mole-eyes">
              <div className="mini-eye"></div>
              <div className="mini-eye"></div>
            </div>
          </div>
        </div>
        
        <div className="decoration-mole mole-2">
          <div className="mini-mole">
            <div className="mini-mole-body"></div>
            <div className="mini-mole-eyes">
              <div className="mini-eye"></div>
              <div className="mini-eye"></div>
            </div>
          </div>
        </div>
        
        <div className="decoration-mole mole-3">
          <div className="mini-mole">
            <div className="mini-mole-body"></div>
            <div className="mini-mole-eyes">
              <div className="mini-eye"></div>
              <div className="mini-eye"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;