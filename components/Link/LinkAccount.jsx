import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import { Button, Tooltip } from '@rneui/base';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/slices/auth';
import axiosInstance from '../../api';
import xLogo from '../../assets/logos/x.jpg';
import GmailLogo from '../../assets/logos/gmail.png';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';

const AccountManagerDashboard = () => {
  const windowHeight = Dimensions.get('window').height;
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [linkedAccountStatus, setLinkedAccountStatus] = useState({});
  const [showTooltip, setShowTooltip] = useState({
    gmail: false,
    googleDrive: false,
  });

  useEffect(() => {
    axiosInstance
      .get('link/status', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setLinkedAccountStatus(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Linked Account Status Error:', error);
        setLoading(false);
      });
  }, []);

  const handleTooltipPress = (tooltipKey) => {
    setShowTooltip((prev) => ({ ...prev, [tooltipKey]: true }));
    setTimeout(() => {
      setShowTooltip((prev) => ({ ...prev, [tooltipKey]: false }));
    }, 1000);
  };

  const accounts = [
    {
      accountId: '1',
      platform: 'X',
      logo: xLogo,
      linked: linkedAccountStatus?.twitter !== 'None',
      linkFunction: () => {
        if (linkedAccountStatus?.twitter === 'None') {
          console.log('Linking Twitter');
        } else {
          console.log('Unlinking Twitter');
        }
      },
      disabled: false, // X 允许交互
      tooltipKey: null,
    },
    {
      accountId: '2',
      platform: 'Gmail',
      logo: GmailLogo,
      linked: linkedAccountStatus?.gmail !== 'None',
      linkFunction: () => handleTooltipPress('gmail'),
      disabled: true, // Gmail 不可交互
      tooltipKey: 'gmail',
    },
    {
      accountId: '3',
      platform: 'Google Drive',
      logo: GoogleDriveLogo,
      linked: linkedAccountStatus?.google_drive !== 'None',
      linkFunction: () => handleTooltipPress('googleDrive'),
      disabled: true, // Google Drive 不可交互
      tooltipKey: 'googleDrive',
    },
  ];

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.accountId}
      renderItem={({ item }) => (
        <Tooltip
          popover={<Text className="text-white">Disabled in Demo Version</Text>}
          backgroundColor="black"
          height={40}
          width={200}
          withOverlay={false}
          skipAndroidStatusBar={true}
          visible={showTooltip[item.tooltipKey] || false}
        >
          <TouchableOpacity
            className={`flex-row items-center bg-gray-100 border-b px-2 space-x-2 ${
              item.platform === 'X' ? '' : 'opacity-30'
            }`}
            style={{ height: 60 }}
            onPress={() => {
              if (item.disabled) {
                handleTooltipPress(item.tooltipKey);
              } else {
                item.linkFunction();
              }
            }}
          >
            <Image source={item.logo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
            <Text className="text-lg font-semibold mx-3">{item.platform}</Text>
            <View className="flex-1" />
            {loading ? (
              <ActivityIndicator size="small" color="#036635" />
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (item.disabled) {
                    handleTooltipPress(item.tooltipKey);
                  } else {
                    item.linkFunction();
                  }
                }}
              >
                <Button
                  size="sm"
                  containerStyle={{
                    marginRight: 5,
                    width: 80,
                    opacity: item.disabled ? 0.9 : 1, // 让按钮变淡但仍可见
                  }}
                  radius={'md'}
                  color={item.linked ? '#DC143C' : '#036635'}
                  title={item.linked ? 'Unlink' : 'Link'}
                  disabled={item.disabled} // 仍然禁用按钮
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Tooltip>
      )}
    />
  );
};

export default AccountManagerDashboard;
