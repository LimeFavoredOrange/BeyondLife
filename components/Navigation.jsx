import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '../redux/slices/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ExecutorScreen from '../screens/ExecutorScreen';

// Key screen
import AddAccountScreen from '../screens/AddAccountScreen';
import ViewAccountScreen from '../screens/ViewAccountScreen';

// Account screen
import TwitterScreenHome from '../screens/Account/TwitterScreenHome';
import TwitterScreen from '../screens/Account/TwitterScreen';
import TwitterConfigureWill from '../screens/Account/TwitterConfigureWill';
import TwitterSettingScreen from '../screens/Account/TwitterSettingScreen';
import HeirSettingScreen from '../screens/Account/HeirSettingScreen';
import TwitterDecryptionScreen from '../screens/Account/TwitterDecryptionScreen';

import GoogleDriveScreen from '../screens/Account/GoogleDriveScreen';
import GoogleDriveFolderScreen from '../screens/Account/GoogleDriveFolderScreen';
import GoogleDriveFolderContent from '../screens/Account/GoogleDriveFolderContent';
import GoogleDriveScreenHome from '../screens/Account/GoogleDriveScreenHome';
import GoogleDriveConfigureWill from '../screens/Account/GoogleDriveConfigureWIll';

import GmailNav from '../screens/Account/Gmail/GmailNav';
import GmailDelete from '../screens/Account/Gmail/GmailDelete';
import GmailForward from '../screens/Account/Gmail/GmailForward';
import GmailDownload from '../screens/Account/Gmail/GmailDownload';
import GmailScreenHome from '../screens/Account/Gmail/GmailScreenHome';
import GmailConfigureWill from '../screens/Account/Gmail/GmailConfigureWill';

import WillTriggerSettingScreen from '../screens/WillTriggerSettingScreen';
import WillTriggerActivationScreen from '../screens/WillTriggerActivationScreen';
import AccessWillDataScreen from '../screens/AccessWillDataScreen';

import ViewDataScreen from '../screens/ViewDataScreen';

import ViewBackupScreen from '../screens/ViewBackupScreen';

// Heir Management Screen
import HeirManagementScreen from '../screens/HeirManagementScreen';

const Navigation = () => {
  // const [isSplashVisible, setIsSplashVisible] = React.useState(true);

  // if (isSplashVisible) {
  //   console.log('Splash screen');
  //   return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  // }

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
      <Stack.Screen name="TwitterList" component={TwitterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter" component={TwitterScreenHome} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter Configure Will" component={TwitterConfigureWill} options={{ headerShown: false }} />

      <Stack.Screen name="Twitter Setting" component={TwitterSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Heir Setting" component={HeirSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter Decryption" component={TwitterDecryptionScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Google Drive" component={GoogleDriveScreenHome} options={{ headerShown: false }} />
      <Stack.Screen name="Google Drive List" component={GoogleDriveScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Google Drive Folder" component={GoogleDriveFolderScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Google Drive Folder Content"
        component={GoogleDriveFolderContent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Google Drive Configure Will"
        component={GoogleDriveConfigureWill}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Gmail" component={GmailScreenHome} options={{ headerShown: false }} />
      <Stack.Screen name="GmailNav" component={GmailNav} options={{ headerShown: false }} />
      <Stack.Screen name="GmailDelete" component={GmailDelete} options={{ headerShown: false }} />
      <Stack.Screen name="GmailForward" component={GmailForward} options={{ headerShown: false }} />
      <Stack.Screen name="GmailDownload" component={GmailDownload} options={{ headerShown: false }} />
      <Stack.Screen name="Gmail Configure Will" component={GmailConfigureWill} options={{ headerShown: false }} />

      <Stack.Screen name="Add Account" component={AddAccountScreen} />
      <Stack.Screen name="View Account" component={ViewAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="View Backup" component={ViewBackupScreen} />

      <Stack.Screen name="Heir Management" component={HeirManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Will Trigger Setting" component={WillTriggerSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Will Trigger Activation"
        component={WillTriggerActivationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Access Will Data" component={AccessWillDataScreen} options={{ headerShown: false }} />
      <Stack.Screen name="View Data" component={ViewDataScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Navigation;
