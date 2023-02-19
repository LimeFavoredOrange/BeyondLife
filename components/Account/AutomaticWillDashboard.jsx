import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const AccountDashboard = () => {
  const navigation = useNavigation();
  const platforms = [
    {
      id: 'Twitter',
      name: 'twitter',
      type: 'antdesign',
      title: 'Twitter',
      color: '#00ACEE',
    },
    {
      id: 'Facebook',
      name: 'facebook-square',
      title: 'Facebook',
      type: 'antdesign',
      color: '#3B5998',
    },
    {
      id: 'Google Drive',
      name: 'google-drive',
      title: 'Google Drive',
      type: 'entypo',
      color: '#4285F4',
    },
  ];

  return (
    <FlatList
      data={platforms}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 border-b px-2 space-x-2"
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate(item.id);
            }}
          >
            <Icon name={item.name} type={item.type} color={item.color} size={30} />
            <Text className="text-lg font-semibold">{item.title}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AccountDashboard;
