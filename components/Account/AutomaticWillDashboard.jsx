import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import XLogo from '../../assets/logos/x.jpg';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';
import GmailLogo from '../../assets/logos/gmail.png';

const AccountDashboard = () => {
  const navigation = useNavigation();
  const platforms = [
    {
      id: 'Twitter',
      title: 'X',
      logo: XLogo,
    },
    {
      id: 'Google Drive',
      title: 'Google Drive',
      logo: GoogleDriveLogo,
    },
    {
      id: 'Gmail',
      title: 'Gmail',
      logo: GmailLogo,
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
            <Image source={item.logo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
            <Text className="text-lg font-semibold">{item.title}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AccountDashboard;
