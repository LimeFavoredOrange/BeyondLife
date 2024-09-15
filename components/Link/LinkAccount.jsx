import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';

const AccountManagerDashboard = () => {
  const navigation = useNavigation();
  const [imageLoaded, setImageLoaded] = useState({});
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const handleImageLoad = (accountId) => {
    setImageLoaded((prevState) => ({
      ...prevState,
      [accountId]: true,
    }));
  };

  const accounts = [
    {
      accountId: '1',
      platform: 'Facebook',
      logo: 'https://www.facebook.com/images/fb_icon_325x325.png',
      linked: false,
    },
    {
      accountId: '2',
      platform: 'Twitter',
      logo: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c53e.png',
      linked: false,
    },
    {
      accountId: '3',
      platform: 'Instagram',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png',
      linked: false,
    },
    {
      accountId: '4',
      platform: 'Gmail',
      logo: 'https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png',
      linked: false,
    },
    {
      accountId: '5',
      platform: 'Google Drive',
      logo: 'https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png',
      linked: false,
    },
  ];

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.accountId}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={(contentWidth, contentHeight) => {
        // Enable scrolling only if content height is greater than screen height
        setScrollEnabled(contentHeight > windowHeight);
      }}
      renderItem={({ item }) => (
        <TouchableOpacity className="flex-row items-center bg-gray-100 border-b px-2 space-x-2" style={{ height: 50 }}>
          {!imageLoaded[item.accountId] && (
            <ActivityIndicator size="small" color="#000" style={{ width: 30, height: 30 }} />
          )}
          <Image
            source={{ uri: item.logo }}
            style={{ width: 30, height: 30, resizeMode: 'contain' }}
            onLoad={() => handleImageLoad(item.accountId)}
          />
          <Text className="text-lg font-semibold mx-3">{item.platform}</Text>
          <View className="flex-1" />
          <Button
            size="sm"
            containerStyle={{ marginRight: 5, width: 80 }}
            radius={'md'}
            color={`${item.linked ? 'error' : '#036635'}`}
            title={`${item.linked ? 'Unlink' : 'Link'}`}
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default AccountManagerDashboard;
