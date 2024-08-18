import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '../redux/slices/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ExecutorScreen from '../screens/ExecutorScreen';

// Key screen
import AddAccountScreen from '../screens/AddAccountScreen';
import ViewAccountScreen from '../screens/ViewAccountScreen';

// Account screen
import TwitterScreen from '../screens/Account/TwitterScreen';
import TwitterSettingScreen from '../screens/Account/TwitterSettingScreen';
import HeirSettingScreen from '../screens/Account/HeirSettingScreen';
import TwitterDecryptionScreen from '../screens/Account/TwitterDecryptionScreen';

import GoogleDriveScreen from '../screens/Account/GoogleDriveScreen';
import GoogleDriveFolderScreen from '../screens/Account/GoogleDriveFolderScreen';
import GoogleDriveFolderContent from '../screens/Account/GoogleDriveFolderContent';
import GmailNav from '../screens/Account/Gmail/GmailNav';
import GmailDelete from '../screens/Account/Gmail/GmailDelete';
import GmailForward from '../screens/Account/Gmail/GmailForward';
import GmailDownload from '../screens/Account/Gmail/GmailDownload';
import ViewBackupScreen from '../screens/ViewBackupScreen';

const Navigation = () => {
  // Haven't login yet.
  if (useSelector(selectIsLogin) === false) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  // Nav stack that after login in.
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Executor" component={ExecutorScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter" component={TwitterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter Setting" component={TwitterSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Heir Setting" component={HeirSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter Decryption" component={TwitterDecryptionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Google Drive" component={GoogleDriveScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Google Drive Folder" component={GoogleDriveFolderScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Google Drive Folder Content"
        component={GoogleDriveFolderContent}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Gmail" component={GmailNav} options={{ headerShown: false }} />
      <Stack.Screen name="GmailDelete" component={GmailDelete} options={{ headerShown: false }} />
      <Stack.Screen name="GmailForward" component={GmailForward} options={{ headerShown: false }} />
      <Stack.Screen name="GmailDownload" component={GmailDownload} options={{ headerShown: false }} />
      <Stack.Screen name="Add Account" component={AddAccountScreen} />
      <Stack.Screen name="View Account" component={ViewAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="View Backup" component={ViewBackupScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
