import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './AuthPages.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Clear messages when component mounts
    setMessage('');
    setError('');
  }, []);

  const validateEmail = (email: string) => {
    if (!email) {
      return '邮箱地址不能为空';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '请输入有效的邮箱地址';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authService.forgotPassword(email);
      setMessage(result.message || '密码重置邮件已发送，请检查您的邮箱');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || '发送重置邮件失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>邮件已发送</h1>
            <p>我们已向您的邮箱发送了密码重置链接</p>
          </div>
          
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>{message}</p>
            <p className="help-text">
              请检查您的邮箱（包括垃圾邮件文件夹），并点击邮件中的链接重置密码。
            </p>
          </div>

          <div className="auth-footer">
            <p>
              没有收到邮件？
              <button 
                type="button" 
                className="link-button"
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
              >
                重新发送
              </button>
            </p>
            <p>
              <Link to="/login" className="auth-link">
                返回登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>忘记密码</h1>
          <p>输入您的邮箱地址，我们将发送密码重置链接</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">邮箱地址</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className={error ? 'error' : ''}
              placeholder="请输入您的邮箱地址"
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                发送中...
              </>
            ) : (
              '发送重置链接'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            记起密码了？
            <Link to="/login" className="auth-link">
              返回登录
            </Link>
          </p>
          <p>
            还没有账户？
            <Link to="/register" className="auth-link">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;