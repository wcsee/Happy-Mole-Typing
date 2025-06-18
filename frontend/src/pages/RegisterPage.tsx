import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (name) {
      case 'username':
        if (!value) {
          errors.username = '用户名不能为空';
        } else if (value.length < 3) {
          errors.username = '用户名至少需要3个字符';
        } else if (value.length > 50) {
          errors.username = '用户名不能超过50个字符';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = '用户名只能包含字母、数字和下划线';
        }
        break;
        
      case 'email':
        if (!value) {
          errors.email = '邮箱地址不能为空';
        } else if (value.length > 100) {
          errors.email = '邮箱地址不能超过100个字符';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = '请输入有效的邮箱地址';
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = '密码不能为空';
        } else if (value.length < 6) {
          errors.password = '密码至少需要6个字符';
        } else if (value.length > 100) {
          errors.password = '密码不能超过100个字符';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = '请确认密码';
        } else if (value !== formData.password) {
          errors.confirmPassword = '两次输入的密码不一致';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
    
    // Validate field on change
    if (type !== 'checkbox') {
      const fieldErrors = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        ...fieldErrors,
        [name]: fieldErrors[name] || '',
      }));
      
      // Also validate confirm password when password changes
      if (name === 'password' && formData.confirmPassword) {
        const confirmErrors = validateField('confirmPassword', formData.confirmPassword);
        setValidationErrors(prev => ({
          ...prev,
          ...confirmErrors,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const allErrors = {
      ...validateField('username', formData.username),
      ...validateField('email', formData.email),
      ...validateField('password', formData.password),
      ...validateField('confirmPassword', formData.confirmPassword),
    };
    
    if (!formData.agreeToTerms) {
      allErrors.agreeToTerms = '请同意服务条款和隐私政策';
    }
    
    setValidationErrors(allErrors);
    
    // Check if there are any errors
    if (Object.values(allErrors).some(error => error)) {
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      });
      
      if (result.success) {
        // Registration successful, user is now logged in
        // Redirect to home page
        navigate('/', { replace: true });
      }
    } catch (err) {
      // Error is handled by the auth hook
      console.error('Registration failed:', err);
    }
  };

  const isFormValid = 
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.agreeToTerms &&
    Object.values(validationErrors).every(error => !error);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>创建账户</h1>
          <p>加入快乐打地鼠，开始你的打字冒险</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.username ? 'error' : ''}`}
              placeholder="请输入用户名"
              required
              autoComplete="username"
              disabled={isLoading}
            />
            {validationErrors.username && (
              <div className="form-error">{validationErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              placeholder="请输入邮箱地址"
              required
              autoComplete="email"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <div className="form-error">{validationErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              密码
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                placeholder="请输入密码"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.password && (
              <div className="form-error">{validationErrors.password}</div>
            )}
            <div className="password-requirements">
              <small>密码要求：至少8个字符，包含大小写字母和数字</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              确认密码
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                placeholder="请再次输入密码"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <div className="form-error">{validationErrors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">
                我同意
                <Link to="/terms" className="terms-link">服务条款</Link>
                和
                <Link to="/privacy" className="terms-link">隐私政策</Link>
              </span>
            </label>
            {validationErrors.agreeToTerms && (
              <div className="form-error">{validationErrors.agreeToTerms}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                注册中...
              </>
            ) : (
              '创建账户'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            已有账户？
            <Link to="/login" className="auth-link">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;