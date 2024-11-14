import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  token: '',
  NotificationToken: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setNotificationToken: (state, action) => {
      state.NotificationToken = action.payload;
    },
  },
});

export const { setIsLogin, setToken, setNotificationToken } = authSlice.actions;

export const selectIsLogin = (state) => state.auth.isLogin;
export const selectToken = (state) => state.auth.token;
export const selectNotificationToken = (state) => state.auth.NotificationToken;

export default authSlice.reducer;
