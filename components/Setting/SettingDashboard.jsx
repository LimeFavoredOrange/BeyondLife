import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setIsLogin, setToken } from '../../redux/slices/auth';
import { setSelectedTab } from '../../redux/slices/homeSlice';

const SettingDashboard = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const dispatch = useDispatch();

  // Pop up the Demo prompt
  const showDemoAlert = () => {
    Alert.alert('Demo Version', 'This feature is disabled in the demo version.', [{ text: 'OK', style: 'cancel' }]);
  };

  const showInfoPopup = () => {
    Alert.alert(
      'Info',
      'This system forms part of an academic study focused on applying fine-grained cryptographic access control to posthumous data scenarios. The current design highlights considerations such as user privacy, portability, and controlled data delegation. This project is intended solely for research and academic purposes. The implementations provided here are proof-of-concept and have not been optimized or thoroughly tested for use in production environments. ',
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4" showsVerticalScrollIndicator={false}>
      {/* Account management */}
      <View className="mt-4 bg-white rounded-2xl shadow-md p-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Account</Text>
        <TouchableOpacity
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
          onPress={showDemoAlert}
        >
          <Text className="text-base text-gray-800">Manage Profile</Text>
          <Icon name="chevron-right" type="feather" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between py-3" onPress={showDemoAlert}>
          <Text className="text-base text-gray-800">Change Password</Text>
          <Icon name="chevron-right" type="feather" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Notifications setting */}
      <View className="mt-4 bg-white rounded-2xl shadow-md p-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Notifications</Text>
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-base text-gray-800">Enable Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => {
              setNotificationsEnabled(!notificationsEnabled);
            }}
          />
        </View>
      </View>

      {/* About the app */}
      <View className="mt-4 bg-white rounded-2xl shadow-md p-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">About</Text>
        <TouchableOpacity className="flex-row items-center justify-between py-3" onPress={showInfoPopup}>
          <Text className="text-base text-gray-800">About This App</Text>
          <Icon name="chevron-right" type="feather" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View className="mt-6 mb-10">
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-xl shadow-md"
          onPress={() => {
            dispatch(setIsLogin(false));
            dispatch(setToken(''));
            dispatch(setSelectedTab('Home'));
          }}
        >
          <Text className="text-white text-center text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingDashboard;
