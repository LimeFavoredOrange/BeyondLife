import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

function showToast(message, type) {
  Toast.show({
    type: type,
    text1: message,
  });
}

const initialState = {
  showToast: showToast,
};

export const toastSlice = createSlice({
  name: 'toastMessage',
  initialState,
  reducers: {
    setShowToast: (state, action) => {
      state.showToast = action.payload;
    },
  },
});

export const { setShowToast } = toastSlice.actions;

export const getShowToast = (state) => state.toastMessage.showToast;

export default toastSlice.reducer;
