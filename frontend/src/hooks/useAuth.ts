import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { login, register, logout, refreshToken, clearError } from '../store/authSlice';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);

  // Auto-login on app start if token exists
  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();
    
    if (storedToken && storedUser && !isAuthenticated) {
      // Try to refresh token to validate it
      dispatch(refreshToken());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      const result = await dispatch(register(userData)).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error: any) {
      // Even if logout fails on server, we still clear local data
      return { success: true };
    }
  };

  const handleRefreshToken = async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message || 'Token refresh failed' };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    clearError: clearAuthError,
    updateProfile: async () => ({ success: true }), // Placeholder function
  };
};