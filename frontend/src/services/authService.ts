import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { ApiResponse } from '../types/api';
import { apiClient } from './apiClient';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<{ AccessToken: string; RefreshToken: string; User: any }>>('/auth/login', credentials);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    // Transform backend response to match frontend AuthResponse interface
    return {
      user: response.data.data.User,
      token: response.data.data.AccessToken,
      refreshToken: response.data.data.RefreshToken
    };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<{ AccessToken: string; RefreshToken: string; User: any }>>('/auth/register', userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }
    // Transform backend response to match frontend AuthResponse interface
    return {
      user: response.data.data.User,
      token: response.data.data.AccessToken,
      refreshToken: response.data.data.RefreshToken
    };
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Token refresh failed');
    }
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email');
    }
    return response.data.data || { message: 'Reset email sent' };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      newPassword,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Password reset failed');
    }
    return response.data.data || { message: 'Password reset successful' };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      token,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Email verification failed');
    }
    return response.data.data || { message: 'Email verified successfully' };
  },

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-verification');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to resend verification email');
    }
    return response.data.data || { message: 'Verification email sent' };
  },
};