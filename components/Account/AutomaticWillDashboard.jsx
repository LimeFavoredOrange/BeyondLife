import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import XLogo from '../../assets/logos/x.jpg';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';
import GmailLogo from '../../assets/logos/gmail.png';
import { selectToken } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { Icon } from '@rneui/base';

import axiosInstance from '../../api';

const AccountDashboard = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [xStatus, setXStatus] = React.useState(false);
  const [googleDriveStatus, setGoogleDriveStatus] = React.useState(false);
  const [gmailStatus, setGmailStatus] = React.useState(false);

  const platforms = [
    {
      id: 'Twitter',
      title: 'X',
      logo: XLogo,
      status: xStatus,
    },
    {
      id: 'Google Drive',
      title: 'Google Drive',
      logo: GoogleDriveLogo,
      status: googleDriveStatus,
    },
    {
      id: 'Gmail',
      title: 'Gmail',
      logo: GmailLogo,
      status: gmailStatus,
    },
  ];

  React.useEffect(() => {
    const fetchStatus = async () => {
      const response = await axiosInstance.get('/digitalWill/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setXStatus(response.data.twitterWillContractAddress !== 'None' ? true : false);
      setGoogleDriveStatus(response.data.googleDriveWillContractAddress !== 'None' ? true : false);
      setGmailStatus(response.data.GmailWillContractAddress !== 'None' ? true : false);
    };

    fetchStatus();
  }, []);

  return (
    <FlatList
      data={platforms}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className={`flex-row items-center ${
              item.status ? 'bg-gray-300' : 'bg-gray-100'
            } border-b px-2 space-x-2 pr-3`}
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate(item.id);
            }}
          >
            <Image source={item.logo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
            <Text className="text-lg font-semibold">{item.title}</Text>
            <View className="flex-grow"></View>
            {/* Use a tick icon */}
            {item.status ? <Icon name="check-circle" type="feather" size={20} color="green" /> : null}
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AccountDashboard;
