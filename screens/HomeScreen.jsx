import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Tabs from '../components/Tabs/Tabs';
import { useSelector } from 'react-redux';
import { selectSelectedTab } from '../redux/slices/homeSlice';

// Import components

// Home Tab
import HomeHeader from '../components/Home/Homeheader';
import HomeDashboard from '../components/Home/Homedashboard';

// Account Tab
import AccountHeader from '../components/Account/AutomaticWillHeader';
import AccountDashboard from '../components/Account/AutomaticWillDashboard';

const HomeScreen = () => {
  const selectedTab = useSelector(selectSelectedTab);
  return (
    <SafeAreaView className="bg-white w-screen h-screen">
      {selectedTab === 'Home' && (
        <>
          <HomeHeader />
          <HomeDashboard />
        </>
      )}
      {selectedTab === 'Document' && (
        <>
          <AccountHeader title={'Automatic Will'} />
          <AccountDashboard />
        </>
      )}
      <Tabs />
    </SafeAreaView>
  );
};

export default HomeScreen;
