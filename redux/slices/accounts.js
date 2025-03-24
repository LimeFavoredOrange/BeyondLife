import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [
    { platform: 'Twitter', tag: 'Work', accountid: '1' },
    { platform: 'Facebook', tag: 'Social', accountid: '2' },
    { platform: 'Ebay', tag: 'Shopping', accountid: '3' },
  ],
  accountsDetail: {
    1: {
      platform: 'Twitter',
      tag: 'Work',
      accountid: '1',
      username: 'JohnP@gmail.com',
      password: '$2a$12$dRHMN5tjyeur/W7znk/b5ejg6JClu93AH73nTdl9AWQKofCNQbRZC',
      useFor: 'twitter account for work',
      notes: 'I use this account to post about my work, please do not share this account with anyone',
    },
    2: {
      platform: 'Facebook',
      tag: 'Social',
      accountid: '2',
      username: 'JohnP@gmail.com',
      password: '$2a$12$ZTe6TzmkzpWQE23p5LdqbeK8a.KnXAmthEAQ5mfcv460Xll1TZvCS',
      useFor: 'personal facebook account',
      notes: 'I use this account to post about my personal life, please do not share this account with anyone',
    },
    3: {
      platform: 'Ebay',
      tag: 'Shopping',
      accountid: '3',
      username: 'JohnP@gmail.com',
      password: '$2a$12$MIduspaVwx11Y7o1JR3GtuPk0QFM2aWD6zn0n95qFQ8CO9aDqkeuu',
      useFor: 'ebay account for shopping',
      notes: 'I use this account to buy things on ebay, please do not share this account with anyone',
    },
  },
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setAccountsDetail: (state, action) => {
      state.accountsDetail = action.payload;
    },
  },
});

export const { setAccounts, setAccountsDetail } = accountsSlice.actions;

export const selectAccounts = (state) => state.accounts.accounts;
export const selectAccountsDetail = (state) => state.accounts.accountsDetail;

export default accountsSlice.reducer;
