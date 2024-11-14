import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Redux
import { store } from './redux/store';
import { Provider, useDispatch } from 'react-redux';

import Navigation from './components/Navigation';

import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { setNotificationToken } from './redux/slices/auth';

import { saveToSecureStore } from './utils/storage';

// Setting up navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Required permissions for push notifications');
      } else {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        saveToSecureStore('notificationToken', token);
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    }

    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('系统通知已收到:', notification);
      Toast.show({
        type: 'success',
        text1: notification.request.content.title,
        text2: notification.request.content.body,
      });
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('用户点击了系统通知:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}
