import { GameLevel, GameSession, GameStats } from '../types/game';
import { ApiResponse, GameRecord } from '../types/api';
import { apiClient } from './apiClient';

export const gameService = {
  async getLevels(): Promise<GameLevel[]> {
    const response = await apiClient.get<ApiResponse<GameLevel[]>>('/game/levels');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch levels');
    }
    return response.data.data;
  },

  async getLevel(levelId: number): Promise<GameLevel> {
    const response = await apiClient.get<ApiResponse<GameLevel>>(`/game/levels/${levelId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch level');
    }
    return response.data.data;
  },

  async startGame(levelId: number): Promise<GameSession> {
    const response = await apiClient.post<ApiResponse<GameSession>>('/game/start', {
      levelId,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to start game');
    }
    return response.data.data;
  },

  async endGame(sessionId: string, sessionData: Partial<GameSession>): Promise<GameSession> {
    const response = await apiClient.post<ApiResponse<GameSession>>(`/game/end/${sessionId}`, sessionData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to end game');
    }
    return response.data.data;
  },

  async pauseGame(sessionId: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(`/game/pause/${sessionId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to pause game');
    }
  },

  async resumeGame(sessionId: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(`/game/resume/${sessionId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to resume game');
    }
  },

  async getGameStats(): Promise<GameStats> {
    const response = await apiClient.get<ApiResponse<GameStats>>('/game/stats');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch game stats');
    }
    return response.data.data;
  },

  async getGameHistory(page: number = 1, pageSize: number = 10): Promise<{
    records: GameRecord[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      records: GameRecord[];
      totalCount: number;
      totalPages: number;
    }>>(`/game/history?page=${page}&pageSize=${pageSize}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch game history');
    }
    return response.data.data;
  },

  async submitScore(sessionId: string, score: number, accuracy: number): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(`/game/score/${sessionId}`, {
      score,
      accuracy,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to submit score');
    }
  },

  async unlockLevel(levelId: number): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(`/game/unlock/${levelId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to unlock level');
    }
  },

  async getSessionDetails(sessionId: string): Promise<GameSession> {
    const response = await apiClient.get<ApiResponse<GameSession>>(`/game/session/${sessionId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch session details');
    }
    return response.data.data;
  },
};