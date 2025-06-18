export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  level: number;
  accuracy: number;
  gamesPlayed: number;
  lastPlayedAt: string;
}

export interface LeaderboardFilter {
  type: 'total' | 'weekly' | 'monthly' | 'level';
  levelId?: number;
  timeRange?: 'week' | 'month' | 'year' | 'all';
}

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  currentFilter: LeaderboardFilter;
  userRank: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface GameRecord {
  id: string;
  levelId: number;
  levelName: string;
  score: number;
  accuracy: number;
  duration: number;
  hitCount: number;
  missCount: number;
  averageReactionTime: number;
  playedAt: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
}