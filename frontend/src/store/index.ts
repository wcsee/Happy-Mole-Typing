import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import gameSlice from './gameSlice';
import userSlice from './userSlice';
import leaderboardSlice from './leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    game: gameSlice,
    user: userSlice,
    leaderboard: leaderboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;