import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { Divider } from '@rneui/themed';

import { useSelector } from 'react-redux';
import { selectGreeting } from '../../redux/slices/homeSlice';

const Header = () => {
  const greeting = useSelector(selectGreeting);
  console.log(greeting);
  return (
    <View>
      <View className="items-start px-3">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity>
            <Icon name="user-alt" type="font-awesome-5" />
          </TouchableOpacity>
          <View className="flex-1"></View>
          <TouchableOpacity>
            <Icon name="notifications" type="ionicon" color={'#036635'} />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl mt-5 font-medium tracking-wide mb-5">{greeting}, mate</Text>
      </View>
      <Divider width={0.5} />
    </View>
  );
};

export default Header;
