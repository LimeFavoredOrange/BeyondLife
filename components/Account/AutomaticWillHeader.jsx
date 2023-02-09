import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider, Icon } from '@rneui/themed';

const AccountHeader = ({ title, icon, iconFunction, isTab, tabIcon, tabIconFunction, setShowLoading }) => {
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
              <TouchableOpacity>
                {iconFunction ? (
                  <Icon onPress={() => iconFunction[0]()} name={icon[0].name} type={icon[0].type} />
                ) : (
                  <Icon name={icon[0].name} type={icon[0].type} />
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                {iconFunction ? (
                  <Icon onPress={() => iconFunction[1]()} name={icon[1].name} type={icon[1].type} />
                ) : (
                  <Icon name={icon[1].name} type={icon[1].type} />
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                {iconFunction ? (
                  <Icon
                    onPress={() => {
                      iconFunction[2]();
                    }}
                    name={icon[2].name}
                    type={icon[2].type}
                  />
                ) : (
                  <Icon name={icon[2].name} type={icon[2].type} />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Divider width={3} />
    </View>
  );
};

export default AccountHeader;
