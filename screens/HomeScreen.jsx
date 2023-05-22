import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Tabs from '../components/Tabs/Tabs';
import { useSelector } from 'react-redux';
import { selectSelectedTab } from '../redux/slices/homeSlice';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ExpoFileSystem from 'expo-file-system';
import twitterRestore from '../Data/Twitter/twitterRestore';

console.log(DocumentPicker);
// Import components

// Home Tab
import HomeHeader from '../components/Home/Homeheader';
import HomeDashboard from '../components/Home/Homedashboard';

// Key Tab
import AccountManagerDashboard from '../components/Account/AccountManagerDashboard';

// Link Tab
import LinkAccount from '../components/Link/LinkAccount';

// Account Tab
import AccountHeader from '../components/Account/AutomaticWillHeader';
import AccountDashboard from '../components/Account/AutomaticWillDashboard';
import axios from 'axios';

const HomeScreen = () => {
  const selectedTab = useSelector(selectSelectedTab);
  const navigation = useNavigation();
  return (
    <SafeAreaView className="bg-white w-screen h-screen">
      {selectedTab === 'Home' && (
        <>
          <HomeHeader />
          <HomeDashboard />
        </>
      )}

      {selectedTab === 'Link' && (
        <>
          <AccountHeader title={'Link accounts'} />
          <LinkAccount />
        </>
      )}
      {selectedTab === 'Key' && (
        <>
          <AccountHeader
            title={'Accounts manager'}
            isTab={true}
            tabIcon={{ name: 'add-to-list', type: 'entypo' }}
            tabIconFunction={() => navigation.navigate('Add Account')}
          />
          <AccountManagerDashboard />
        </>
      )}
      {selectedTab === 'Document' && (
        <>
          <AccountHeader
            title={'Automatic Will'}
            isTab={true}
            tabIcon={{ name: 'upload', type: 'entypo' }}
            tabIconFunction={async () => {
              try {
                const file = await DocumentPicker.getDocumentAsync({});
                // const fileContent = await ExpoFileSystem.readAsStringAsync(file.uri);
                // Check the file name is twitterBackup.txt
                if (file.name !== 'twitterBackup.txt') {
                  alert('Please upload the correct file');
                  return;
                }
                // navigation.navigate('View Backup', { data: JSON.stringify(twitterRestore) });
                navigation.navigate('View Backup');
              } catch (err) {
                console.log(err);
              }
            }}
          />
          <AccountDashboard />
        </>
      )}
      <Tabs />
    </SafeAreaView>
  );
};

export default HomeScreen;
