import { createSlice } from '@reduxjs/toolkit';

var greeting = null;
const currentHour = new Date().getHours();
if (currentHour >= 0 && currentHour < 12) {
  greeting = 'Good morning☀️';
} else if (currentHour >= 12 && currentHour < 16) {
  greeting = 'Good afternoon☕️';
} else {
  greeting = 'Good evening🌙';
}

const initialState = {
  greeting: greeting,
  selectedTab: 'Home',
  account_number: 0,
  heir_number: 0,
  note_number: 0,
  wills_number: 0,
  link_to_facebook: false,
  link_to_twitter: false,
  link_to_instagram: false,
  link_to_gmail: false,
  link_to_google_drive: false,
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
    setAccountNumber: (state, action) => {
      state.account_number = action.payload;
    },
    setHeirNumber: (state, action) => {
      state.heir_number = action.payload;
    },
    setNoteNumber: (state, action) => {
      state.note_number = action.payload;
    },
    setWillsNumber: (state, action) => {
      state.wills_number = action.payload;
    },
    setLinkToFacebook: (state, action) => {
      state.link_to_facebook = action.payload;
    },
    setLinkToTwitter: (state, action) => {
      state.link_to_twitter = action.payload;
    },
    setLinkToInstagram: (state, action) => {
      state.link_to_instagram = action.payload;
    },
    setLinkToGmail: (state, action) => {
      state.link_to_gmail = action.payload;
    },
    setLinkToGoogleDrive: (state, action) => {
      state.link_to_google_drive = action.payload;
    },
  },
});

export const {
  setGreeting,
  setSelectedTab,
  setAccountNumber,
  setHeirNumber,
  setNoteNumber,
  setWillsNumber,
  setLinkToFacebook,
  setLinkToTwitter,
  setLinkToInstagram,
  setLinkToGmail,
  setLinkToGoogleDrive,
} = navSlice.actions;

export const selectGreeting = (state) => state.home.greeting;
export const selectSelectedTab = (state) => state.home.selectedTab;
export const selectAccountNumber = (state) => state.home.account_number;
export const selectHeirNumber = (state) => state.home.heir_number;
export const selectNoteNumber = (state) => state.home.note_number;
export const selectWillsNumber = (state) => state.home.wills_number;
export const selectLinkToFacebook = (state) => state.home.link_to_facebook;
export const selectLinkToTwitter = (state) => state.home.link_to_twitter;
export const selectLinkToInstagram = (state) => state.home.link_to_instagram;
export const selectLinkToGmail = (state) => state.home.link_to_gmail;
export const selectLinkToGoogleDrive = (state) => state.home.link_to_google_drive;

export default navSlice.reducer;
