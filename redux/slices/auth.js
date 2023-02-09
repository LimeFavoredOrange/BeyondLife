import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  token: '',
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
  },
});

export const { setIsLogin, setToken } = authSlice.actions;

export const selectIsLogin = (state) => state.auth.isLogin;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
