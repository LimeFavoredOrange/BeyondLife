import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import * as Animatable from 'react-native-animatable';

const NotificationOverlay = ({ notifications, onClose }) => {
  const notificationRefs = useRef([]);
  const screenWidth = Dimensions.get('window').width;
  const backgroundRef = useRef();

  const handleClose = () => {
    // 背景淡出动画
    if (backgroundRef.current) {
      backgroundRef.current.fadeOut(500);
    }

    // 通知项从最后一个开始逐一退出
    notificationRefs.current.reverse().forEach((ref, index) => {
      setTimeout(() => {
        if (ref) {
          ref.animate(
            {
              0: { translateX: 0 },
              1: { translateX: screenWidth }, // 移出屏幕的1.5倍宽度，确保完全退出
            },
            550
          );
        }
      }, index * 100);
    });

    // 在最后一个通知退出动画结束后调用 onClose
    setTimeout(onClose, notifications.length * 100 + 600);
  };

  return (
    <View className="absolute inset-0" style={{ zIndex: 50 }}>
      {/* 半透明背景层，使用 Animatable 进行渐变 */}
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

      {/* 通知胶囊层 */}
      <View className="absolute right-0 top-20 space-y-4 mt-12">
        {notifications.map((notification, index) => (
          <Animatable.View
            ref={(el) => (notificationRefs.current[index] = el)}
            key={index}
            animation={{
              from: { translateX: screenWidth },
              to: { translateX: 0 }, // 从屏幕右侧移入
            }}
            duration={500 + index * 100} // 每个通知稍微延迟
            easing="ease-out"
            className="my-1"
          >
            <TouchableOpacity
              onPress={() => {
                console.log('Notification:', notification);
              }}
              style={{ zIndex: 100 }}
            >
              {/* 左侧圆角胶囊 */}
              <View
                className="bg-green-600 rounded-l-full px-6 py-3 shadow-lg pr-4"
                style={{ width: screenWidth / 2 }} // 设置宽度为屏幕的一半
              >
                <Text
                  className="text-white text-center"
                  numberOfLines={1} // 限制为单行显示
                  ellipsizeMode="tail" // 超出部分使用省略号
                >
                  {notification}
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );
};

export default NotificationOverlay;
