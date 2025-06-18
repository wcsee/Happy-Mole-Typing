import { LeaderboardEntry, LeaderboardFilter, PaginatedResponse, ApiResponse } from '../types/api';
import { apiClient } from './apiClient';

export const leaderboardService = {
  async getLeaderboard(filter: LeaderboardFilter, page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<LeaderboardEntry>> {
    const params = new URLSearchParams({
      type: filter.type,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filter.levelId) {
      params.append('levelId', filter.levelId.toString());
    }

    if (filter.timeRange) {
      params.append('timeRange', filter.timeRange);
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<LeaderboardEntry>>>(
      `/leaderboard?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch leaderboard');
    }

    return response.data.data;
  },

  async getUserRank(filter: LeaderboardFilter): Promise<number> {
    const params = new URLSearchParams({
      type: filter.type,
    });

    if (filter.levelId) {
      params.append('levelId', filter.levelId.toString());
    }

    if (filter.timeRange) {
      params.append('timeRange', filter.timeRange);
    }

    const response = await apiClient.get<ApiResponse<{ rank: number }>>(
      `/leaderboard/user-rank?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user rank');
    }

    return response.data.data.rank;
  },

  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(
      `/leaderboard/top?limit=${limit}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch top players');
    }

    return response.data.data;
  },

  async getWeeklyLeaders(): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard/weekly');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch weekly leaders');
    }

    return response.data.data;
  },

  async getMonthlyLeaders(): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard/monthly');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch monthly leaders');
    }

    return response.data.data;
  },

  async getLevelLeaderboard(levelId: number, limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(
      `/leaderboard/level/${levelId}?limit=${limit}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch level leaderboard');
    }

    return response.data.data;
  },

  async getUserPosition(userId: string, filter: LeaderboardFilter): Promise<{
    rank: number;
    entry: LeaderboardEntry;
  }> {
    const params = new URLSearchParams({
      type: filter.type,
    });

    if (filter.levelId) {
      params.append('levelId', filter.levelId.toString());
    }

    if (filter.timeRange) {
      params.append('timeRange', filter.timeRange);
    }

    const response = await apiClient.get<ApiResponse<{
      rank: number;
      entry: LeaderboardEntry;
    }>>(`/leaderboard/user/${userId}?${params.toString()}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user position');
    }

    return response.data.data;
  },
};