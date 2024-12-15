import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountHeader from '../components/Account/AutomaticWillHeader';

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* 标题区域 */}
      <AccountHeader title="Notification Details" />

      <Animatable.View
        animation="fadeInUp"
        duration={600}
        className="m-4 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      >
        {/* 图标与标题 */}
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

        {/* 通知正文 */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 leading-6">{notification.message}</Text>
        </View>

        {/* 时间戳 */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">Date: {notification.timestamp}</Text>
        </View>

        {/* 分类显示 */}
        {notification.category && (
          <View className="mt-2">
            <Text className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full self-start">
              {notification.category}
            </Text>
          </View>
        )}

        {/* 添加更多的交互按钮或信息 */}
      </Animatable.View>
    </SafeAreaView>
  );
};

export default NotificationDetailScreen;
