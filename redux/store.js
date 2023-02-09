import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice.js';
import authReducer from './slices/auth.js';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
  },
});
