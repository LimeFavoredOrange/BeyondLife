import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountHeader from '../components/Account/AutomaticWillHeader';

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header Area */}
      <AccountHeader title="Notification Details" />

      <Animatable.View
        animation="fadeInUp"
        duration={600}
        className="m-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      >
        {/* Icon and title */}
        <View className="flex-row items-center mb-4">
          <View className="p-3 bg-yellow-100 rounded-full">
            <Icon
              name={notification.read_status === 1 ? 'check-circle' : 'bell'}
              size={28}
              color={notification.read_status === 1 ? '#036635' : '#f59e0b'}
            />
          </View>
          <Text className="text-xl font-bold text-gray-800 ml-3">{notification.title || 'Notification'}</Text>
        </View>

        {/* Notification info */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 leading-6">{notification.message}</Text>
        </View>

        {/* Timestamp */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">Date: {notification.timestamp}</Text>
        </View>

        {/* Show current notification's category */}
        {notification.category && (
          <View className="mt-2">
            <Text className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full self-start">
              {notification.category}
            </Text>
          </View>
        )}
      </Animatable.View>
    </SafeAreaView>
  );
};

export default NotificationDetailScreen;
