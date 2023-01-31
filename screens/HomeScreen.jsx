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
import AccountHeader from '../components/Account/AccountHeader';
import AccountDashboard from '../components/Account/AccountDashboard';

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
      {selectedTab === 'Add' && (
        <>
          <AccountHeader title={'Account Automation'} />
          <AccountDashboard />
        </>
      )}
      <Tabs />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
