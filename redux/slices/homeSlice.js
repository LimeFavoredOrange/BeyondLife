import { createSlice } from '@reduxjs/toolkit';

var greeting = null;
const currentHour = new Date().getHours();
if (currentHour >= 0 && currentHour < 12) {
  greeting = 'Good morning';
} else if (currentHour >= 12 && currentHour < 16) {
  greeting = 'Good afternoon';
} else {
  greeting = 'Good evening';
}

const initialState = {
  greeting: greeting,
  selectedTab: 'Home',
};

export const navSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setGreeting: (state, action) => {
      state.greeting = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setGreeting, setSelectedTab } = navSlice.actions;

export const selectGreeting = (state) => state.home.greeting;
export const selectSelectedTab = (state) => state.home.selectedTab;

export default navSlice.reducer;
