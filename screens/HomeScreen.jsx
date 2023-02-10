import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Tabs from '../components/Tabs/Tabs';
import { useSelector } from 'react-redux';
import { selectSelectedTab } from '../redux/slices/homeSlice';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ExpoFileSystem from 'expo-file-system';

console.log(DocumentPicker);
// Import components

// Home Tab
import HomeHeader from '../components/Home/Homeheader';
import HomeDashboard from '../components/Home/Homedashboard';

// Key Tab
import AccountManagerDashboard from '../components/Account/AccountManagerDashboard';

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
                const fileContent = await ExpoFileSystem.readAsStringAsync(file.uri);
                const response = await axios.post('https://tor2023-203l.onrender.com/twitter/restore', {
                  data: fileContent,
                });
                console.log(response.data.data);

                navigation.navigate('View Backup', { data: response.data.data });
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
