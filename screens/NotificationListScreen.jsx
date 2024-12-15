import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/auth';

import axiosInstance from '../api';

const dummyNotifications = [
  {
    id: 146,
    message: "You've been assigned as a heir to a new Digital Will",
    read_status: 0,
    timestamp: '2024-12-15 02:55:47',
    title: 'New Heir Assigned',
    category: 'Will',
  },
  {
    id: 145,
    message: "Don't miss it! Important Will Activation steps needed.",
    read_status: 0,
    timestamp: '2024-12-15 02:48:20',
    title: 'Will Activation Needed',
    category: 'Reminder',
  },
  {
    id: 2,
    message: 'You have been assigned as a heir to a new Digital Will',
    read_status: 1,
    timestamp: '2024-11-26 06:40:57',
    title: 'Assignment Confirmation',
    category: 'Info',
  },
];

const NotificationListScreen = () => {
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchNotifications = async () => {
      setShowLoading(true);
      try {
        const response = await axiosInstance.get('/notifications/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications(dummyNotifications);
      } finally {
        setShowLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handlePressNotification = async (notification) => {
    try {
      setShowLoading(true);
      await axiosInstance.put(
        `/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the notification status
      notification.read_status = 1;
      navigation.navigate('NotificationDetailScreen', { notification });
    } catch (error) {
      console.error('Error navigating to NotificationDetailScreen:', error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title="Notifications" />

      <ScrollView className="p-4">
        {notifications.map((item, index) => {
          const isRead = item.read_status === 1;

          return (
            <Animatable.View key={item.id} animation="fadeInUp" duration={600} delay={index * 100} className="mb-4">
              <View className="relative">
                {/* 红点 */}
                {!isRead && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      height: 12,
                      width: 12,
                      backgroundColor: 'red',
                      borderRadius: 6,
                      zIndex: 10,
                    }}
                  />
                )}
                {/* 卡片 */}
                <TouchableOpacity activeOpacity={0.9} onPress={() => handlePressNotification(item)}>
                  <Card className="rounded-xl shadow-md border border-gray-200" style={{ elevation: 5 }}>
                    <Card.Content className="flex-row items-start">
                      {/* 中间：内容 */}
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center mb-1">
                          <Text className="text-base font-semibold text-gray-800">{item.title}</Text>
                          {item.category && (
                            <Badge className="bg-green-100 text-green-700 px-2 rounded-full">{item.category}</Badge>
                          )}
                        </View>
                        <Text className="text-sm text-gray-700 mb-1">{item.message}</Text>
                        <Text className="text-xs text-gray-400">{item.timestamp}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationListScreen;
