import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { Divider } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { selectGreeting } from '../../redux/slices/homeSlice';
import { setIsLogin, setToken } from '../../redux/slices/auth';
import { useNavigation } from '@react-navigation/native';

const Header = ({ setShowNotification, notificationCount }) => {
  const dispatch = useDispatch();
  const greeting = useSelector(selectGreeting);
  const navigation = useNavigation();

  return (
    <View>
      <View className="items-start px-3">
        <View className="flex-row justify-between items-center">
          {/* User Icon */}
          <TouchableOpacity
            onPress={() => {
              dispatch(setIsLogin(false));
              dispatch(setToken(''));
            }}
          >
            {/* Info icon */}
            <Icon name="info" type="feather" color={'black'} />
          </TouchableOpacity>
          <View className="flex-1"></View>

          {/* Notification Bell Icon */}
          <TouchableOpacity
            onPress={() => {
              // setShowNotification(true);
              navigation.navigate('NotificationListScreen');
            }}
            className="relative"
          >
            <Icon name="notifications" type="ionicon" color={'#036635'} />
            {/* Badge for Notification Count */}
            {notificationCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-600 h-5 w-5 rounded-full flex items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {notificationCount >= 10 ? '*' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Greeting Text */}
        <Text className="text-3xl mt-5 font-medium tracking-wide mb-5">{greeting}, mate</Text>
      </View>

      {/* Divider */}
      <Divider width={0.5} />
    </View>
  );
};

export default Header;
