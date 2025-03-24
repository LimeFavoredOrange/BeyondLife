import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import XLogo from '../../assets/logos/x.jpg';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';
import GmailLogo from '../../assets/logos/gmail.png';
import { selectToken } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { Icon, Tooltip } from '@rneui/base';
import axiosInstance from '../../api';
import Loading from '../Loading';

const AccountDashboard = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [xStatus, setXStatus] = useState(false);
  const [googleDriveStatus, setGoogleDriveStatus] = useState(false);
  const [gmailStatus, setGmailStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // Control the display status of Tooltip
  const [showTooltip, setShowTooltip] = useState({
    googleDrive: false,
    gmail: false,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/digitalWill/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setXStatus(response.data.twitterWillContractAddress !== 'None');
        setGoogleDriveStatus(response.data.googleDriveWillContractAddress !== 'None');
        setGmailStatus(response.data.GmailWillContractAddress !== 'None');
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // Handle Tooltip Interaction
  const handleTooltipPress = (tooltipKey) => {
    setShowTooltip((prev) => ({ ...prev, [tooltipKey]: true }));
    setTimeout(() => {
      setShowTooltip((prev) => ({ ...prev, [tooltipKey]: false }));
    }, 1000); // Hide the tooltip after 1 second
  };

  const platforms = [
    {
      id: 'Twitter',
      title: 'X',
      logo: XLogo,
      status: xStatus,
      isDemoDisabled: false,
      tooltipKey: null,
    },
    {
      id: 'Google Drive',
      title: 'Google Drive',
      logo: GoogleDriveLogo,
      status: googleDriveStatus,
      isDemoDisabled: true,
      tooltipKey: 'googleDrive',
    },
    {
      id: 'Gmail',
      title: 'Gmail',
      logo: GmailLogo,
      status: gmailStatus,
      isDemoDisabled: true,
      tooltipKey: 'gmail',
    },
  ];

  return (
    <>
      <Loading showLoading={loading} />
      <FlatList
        data={platforms}
        renderItem={({ item }) => {
          const tooltipKey = item.tooltipKey;

          return (
            <Tooltip
              key={showTooltip[tooltipKey] ? `${tooltipKey}-visible` : `${tooltipKey}-hidden`}
              popover={<Text className="text-white">Disabled in Demo Version</Text>}
              backgroundColor="black"
              height={40}
              width={200}
              withOverlay={false}
              skipAndroidStatusBar={true}
              visible={showTooltip[tooltipKey]}
            >
              <TouchableOpacity
                className={`flex-row items-center ${
                  item.status ? 'bg-gray-300' : 'bg-gray-100'
                } border-b px-2 space-x-2 pr-3 ${item.isDemoDisabled ? 'opacity-50' : ''}`}
                style={{ height: 50 }}
                onPress={() => {
                  if (!item.isDemoDisabled) {
                    navigation.navigate(item.id);
                  } else if (tooltipKey) {
                    handleTooltipPress(tooltipKey);
                  }
                }}
              >
                <Image source={item.logo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                <Text className="text-lg font-semibold">{item.title}</Text>
                <View className="flex-grow"></View>
                {item.status && <Icon name="check-circle" type="feather" size={20} color="green" />}
              </TouchableOpacity>
            </Tooltip>
          );
        }}
      />
    </>
  );
};

export default AccountDashboard;
