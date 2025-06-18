import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              欢迎来到
              <span className="title-highlight">快乐打地鼠</span>
            </h1>
            <p className="hero-description">
              一个有趣的打字练习游戏！通过打击地鼠来提高你的打字速度和准确性。
              挑战不同难度的关卡，与朋友们比拼分数，成为打字高手！
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/levels" className="btn btn-primary btn-lg">
                    开始游戏
                  </Link>
                  <Link to="/profile" className="btn btn-outline btn-lg">
                    查看资料
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    立即注册
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    登录账户
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="game-preview">
              <div className="preview-ground">
                <div className="preview-hole preview-hole-1">
                  <div className="preview-mole"></div>
                </div>
                <div className="preview-hole preview-hole-2"></div>
                <div className="preview-hole preview-hole-3">
                  <div className="preview-mole"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">游戏特色</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>快速反应</h3>
              <p>训练你的反应速度和手指灵活性，在有限时间内击中更多地鼠。</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <h3>多种难度</h3>
              <p>从初学者到专家，多个难度等级满足不同水平的玩家需求。</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>排行榜</h3>
              <p>与全球玩家竞争，查看你在排行榜上的位置，争夺冠军宝座。</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>进度追踪</h3>
              <p>详细的统计数据帮助你了解自己的进步，制定更好的练习计划。</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="how-to-play-section">
        <div className="container">
          <h2 className="section-title">如何游戏</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>选择关卡</h3>
                <p>从多个难度等级中选择适合你的关卡开始游戏。</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>观察地鼠</h3>
                <p>地鼠会从洞中探出头来，每只地鼠身上都有一个字母。</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>快速打字</h3>
                <p>在地鼠消失前快速输入对应的字母来击中它们。</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>获得高分</h3>
                <p>击中更多地鼠获得更高分数，挑战你的最佳记录！</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>准备好开始你的打字冒险了吗？</h2>
              <p>立即注册，开始你的快乐打地鼠之旅！</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  免费注册
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  已有账户？登录
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;