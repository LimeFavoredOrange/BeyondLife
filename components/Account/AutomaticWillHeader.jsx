import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider, Icon } from '@rneui/themed';

// Header for the account screen.
const AccountHeader = ({ title, icon, iconFunction, isTab, tabIcon, tabIconFunction }) => {
  return (
    <View>
      <View className="justify-start px-3 flex-row items-center">
        <Text className="text-3xl mt-5 font-medium tracking-wide mb-5">{title}</Text>
        {isTab && (
          <>
            <View className="flex-1" />
            <View className="flex-row gap-2">
              <TouchableOpacity>
                {tabIconFunction ? (
                  <Icon onPress={() => tabIconFunction()} name={tabIcon.name} type={tabIcon.type} />
                ) : (
                  <Icon name={tabIcon.name} type={tabIcon.type} />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
        {icon && (
          <>
            <View className="flex-1" />
            <View className="flex-row gap-2">
              {icon.map((item, index) => {
                return (
                  <TouchableOpacity key={index}>
                    {iconFunction ? (
                      <Icon onPress={() => iconFunction[index]()} name={item.name} type={item.type} />
                    ) : (
                      <Icon name={item.name} type={item.type} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
      <Divider width={3} />
    </View>
  );
};

export default AccountHeader;
