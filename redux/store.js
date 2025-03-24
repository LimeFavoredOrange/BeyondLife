import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice.js';
import authReducer from './slices/auth.js';
import accountsReducer from './slices/accounts.js';
import toastReducer from './slices/toastMessage.js';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
    accounts: accountsReducer,
    // toastMessage: toastReducer,
  },
});
