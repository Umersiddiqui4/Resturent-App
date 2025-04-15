// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
