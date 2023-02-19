import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '../redux/slices/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';

// Key screen
import AddAccountScreen from '../screens/AddAccountScreen';
import ViewAccountScreen from '../screens/ViewAccountScreen';

// Account screen
import TwitterScreen from '../screens/Account/TwitterScreen';
import GoogleDriveScreen from '../screens/Account/GoogleDriveScreen';
import ViewBackupScreen from '../screens/ViewBackupScreen';

const Navigation = () => {
  if (useSelector(selectIsLogin) === false) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Twitter" component={TwitterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Google Drive" component={GoogleDriveScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Add Account" component={AddAccountScreen} />
      <Stack.Screen name="View Account" component={ViewAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="View Backup" component={ViewBackupScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
