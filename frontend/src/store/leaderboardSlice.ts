import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardState, LeaderboardEntry, LeaderboardFilter } from '../types/api';
import { leaderboardService } from '../services/leaderboardService';

const initialState: LeaderboardState = {
  entries: [],
  currentFilter: {
    type: 'total',
    timeRange: 'all',
  },
  userRank: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async (filter: LeaderboardFilter, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getLeaderboard(filter);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async (filter: LeaderboardFilter, { rejectWithValue }) => {
    try {
      const rank = await leaderboardService.getUserRank(filter);
      return rank;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user rank');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<LeaderboardFilter>) => {
      state.currentFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLeaderboard: (state) => {
      state.entries = [];
      state.userRank = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload.items;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch User Rank
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.userRank = action.payload;
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearError, clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;