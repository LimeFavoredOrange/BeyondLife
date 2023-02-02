import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider, Icon } from '@rneui/themed';

const AccountHeader = ({ title, icon, iconFunction }) => {
  return (
    <View>
      <View className="justify-start px-3 flex-row items-center">
        <Text className="text-3xl mt-5 font-medium tracking-wide mb-5">{title}</Text>
        {icon && (
          <>
            <View className="flex-1" />
            <TouchableOpacity>
              {iconFunction ? (
                <Icon onPress={() => iconFunction()} name={icon.name} type={icon.type} />
              ) : (
                <Icon name={icon.name} type={icon.type} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      <Divider width={3} />
    </View>
  );
};

export default AccountHeader;
