import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AuthPages.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('无效的重置链接');
    }
  }, [token]);

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (name) {
      case 'newPassword':
        if (!value) {
          errors.newPassword = '新密码不能为空';
        } else if (value.length < 6) {
          errors.newPassword = '密码至少需要6个字符';
        } else if (value.length > 100) {
          errors.newPassword = '密码不能超过100个字符';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = '请确认密码';
        } else if (value !== formData.newPassword) {
          errors.confirmPassword = '两次输入的密码不一致';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Validate field on change
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors,
      [name]: fieldErrors[name] || '',
    }));
    
    // Also validate confirm password when new password changes
    if (name === 'newPassword' && formData.confirmPassword) {
      const confirmErrors = validateField('confirmPassword', formData.confirmPassword);
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: confirmErrors.confirmPassword || '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('无效的重置链接');
      return;
    }

    // Validate all fields
    const newPasswordErrors = validateField('newPassword', formData.newPassword);
    const confirmPasswordErrors = validateField('confirmPassword', formData.confirmPassword);
    const allErrors = { ...newPasswordErrors, ...confirmPasswordErrors };
    
    setValidationErrors(allErrors);
    
    if (Object.values(allErrors).some(error => error)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, formData.newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || '密码重置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>无效链接</h1>
            <p>重置密码链接无效或已过期</p>
          </div>
          
          <div className="error-message">
            请重新申请密码重置
          </div>

          <div className="auth-footer">
            <p>
              <Link to="/forgot-password" className="auth-link">
                重新申请密码重置
              </Link>
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

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>密码重置成功</h1>
            <p>您的密码已成功重置</p>
          </div>
          
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>密码重置成功！您现在可以使用新密码登录了。</p>
          </div>

          <button
            type="button"
            className="auth-button"
            onClick={() => navigate('/login')}
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>重置密码</h1>
          <p>请输入您的新密码</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">新密码</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={validationErrors.newPassword ? 'error' : ''}
                placeholder="请输入新密码（至少6位）"
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.newPassword && (
              <span className="error-message">{validationErrors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认新密码</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={validationErrors.confirmPassword ? 'error' : ''}
                placeholder="请再次输入新密码"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className="error-message">{validationErrors.confirmPassword}</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                重置中...
              </>
            ) : (
              '重置密码'
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
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;