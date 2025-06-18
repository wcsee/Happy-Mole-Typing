import { UserProfile, UserStats, Achievement, UpdateProfileRequest, ChangePasswordRequest } from '../types/user';
import { ApiResponse } from '../types/api';
import { apiClient } from './apiClient';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/user/profile');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
    return response.data.data;
  },

  async updateProfile(updates: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/user/profile', updates);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update profile');
    }
    return response.data.data;
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>('/user/change-password', passwordData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
  },

  async getStats(): Promise<UserStats> {
    const response = await apiClient.get<ApiResponse<UserStats>>('/user/stats');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user stats');
    }
    return response.data.data;
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get<ApiResponse<Achievement[]>>('/user/achievements');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch achievements');
    }
    return response.data.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const response = await apiClient.uploadFile<ApiResponse<{ avatarUrl: string }>>(
      '/user/avatar',
      file
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to upload avatar');
    }
    return response.data.data.avatarUrl;
  },

  async deleteAccount(): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>('/user/account');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete account');
    }
  },

  async exportData(): Promise<Blob> {
    const response = await apiClient.get('/user/export-data', {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    const response = await apiClient.patch<ApiResponse<UserProfile>>('/user/preferences', preferences);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update preferences');
    }
    return response.data.data;
  },

  async getNotifications(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/user/notifications');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch notifications');
    }
    return response.data.data;
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await apiClient.patch<ApiResponse<void>>(`/user/notifications/${notificationId}/read`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to mark notification as read');
    }
  },

  async clearAllNotifications(): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>('/user/notifications');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to clear notifications');
    }
  },
};