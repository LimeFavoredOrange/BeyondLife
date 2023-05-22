import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const AccountDashboard = () => {
  const navigation = useNavigation();
  const platforms = [
    {
      id: 'Twitter',
      title: 'Twitter',
      logo: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c53e.png',
    },
    {
      id: 'Google Drive',
      title: 'Google Drive',
      logo: 'https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png',
    },
    {
      id: 'Gmail',
      title: 'Gmail',
      logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png',
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
            <Image source={{ uri: item.logo, width: 30, height: 30 }} style={{ resizeMode: 'contain' }} />
            <Text className="text-lg font-semibold">{item.title}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AccountDashboard;
