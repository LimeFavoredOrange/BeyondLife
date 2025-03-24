import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import * as Animatable from 'react-native-animatable';

const NotificationOverlay = ({ notifications, onClose }) => {
  const [expandedNotification, setExpandedNotification] = useState(null);
  const notificationRefs = useRef([]);
  const backgroundRef = useRef();
  const screenWidth = Dimensions.get('window').width;

  // Sort notifications: unread first, then by timestamp
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read_status === b.read_status) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return a.read_status - b.read_status;
  });

  const handleClose = () => {
    // Background fade-out
    if (backgroundRef.current) {
      backgroundRef.current.fadeOut(500);
    }

    // Animate notifications off-screen
    notificationRefs.current.reverse().forEach((ref, index) => {
      setTimeout(() => {
        if (ref) {
          ref.animate({ 0: { translateX: 0 }, 1: { translateX: screenWidth } }, 550);
        }
      }, index * 100);
    });

    // Close overlay after animations
    setTimeout(onClose, sortedNotifications.length * 100 + 600);
  };

  const handleExpand = (notification) => {
    setExpandedNotification(notification.id === expandedNotification ? null : notification.id);
  };

  return (
    <View className="absolute inset-0 z-50">
      {/* Semi-Transparent Background */}
      <Animatable.View
        ref={backgroundRef}
        animation={{
          from: { opacity: 0 },
          to: { opacity: 0.6 },
        }}
        duration={500}
        easing="ease-in-out"
        className="absolute inset-0 bg-gray-800"
      >
        <TouchableOpacity onPress={handleClose} className="absolute inset-0" />
      </Animatable.View>

      {/* Notification List */}
      <View className="absolute right-0 top-20 space-y-4 mt-12">
        {sortedNotifications.map((notification, index) => (
          <Animatable.View
            ref={(el) => (notificationRefs.current[index] = el)}
            key={notification.id}
            animation={{
              from: { translateX: screenWidth },
              to: { translateX: 0 },
            }}
            duration={500 + index * 100}
            easing="ease-out"
            className="my-1"
          >
            <TouchableOpacity onPress={() => handleExpand(notification)} className="relative">
              {/* Notification Container */}
              <View
                className={`${
                  expandedNotification === notification.id ? 'w-4/5 bg-white' : 'bg-green-600'
                } rounded-l-full px-6 py-3 shadow-lg`}
                style={{
                  width: expandedNotification === notification.id ? screenWidth * 0.8 : screenWidth / 2,
                }}
              >
                {/* Header */}
                <View className="flex-row items-center">
                  {notification.read_status === 0 && <View className="h-3 w-3 bg-red-600 rounded-full mr-2" />}
                  <Text
                    className={`${
                      expandedNotification === notification.id ? 'text-green-600' : 'text-white'
                    } text-base font-medium`}
                    numberOfLines={expandedNotification === notification.id ? 3 : 1}
                    ellipsizeMode="tail"
                  >
                    {notification.message}
                  </Text>
                </View>

                {/* Expanded Content */}
                {expandedNotification === notification.id && (
                  <View className="mt-2">
                    <Text className="text-sm text-gray-700">Timestamp: {notification.timestamp}</Text>
                    <Text className="text-sm text-gray-700">
                      Status: {notification.read_status === 0 ? 'Unread' : 'Read'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );
};

export default NotificationOverlay;
