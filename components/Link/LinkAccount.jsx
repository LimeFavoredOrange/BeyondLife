import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';
import facebookLogo from '../../assets/logos/facebook.png';
import xLogo from '../../assets/logos/x.jpg';
import instagramLogo from '../../assets/logos/Instagram.png';
import GmailLogo from '../../assets/logos/gmail.png';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';

import {
  selectLinkToFacebook,
  selectLinkToTwitter,
  selectLinkToInstagram,
  selectLinkToGmail,
  selectLinkToGoogleDrive,
} from '../../redux/slices/homeSlice';

import { useSelector } from 'react-redux';

const AccountManagerDashboard = () => {
  const navigation = useNavigation();
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const link_to_facebook = useSelector(selectLinkToFacebook);
  const link_to_twitter = useSelector(selectLinkToTwitter);
  const link_to_instagram = useSelector(selectLinkToInstagram);
  const link_to_gmail = useSelector(selectLinkToGmail);
  const link_to_google_drive = useSelector(selectLinkToGoogleDrive);

  const accounts = [
    {
      accountId: '1',
      platform: 'Facebook',
      logo: facebookLogo,
      linked: link_to_facebook == 'None' ? false : true,
    },
    {
      accountId: '2',
      platform: 'X',
      logo: xLogo,
      linked: link_to_twitter == 'None' ? false : true,
    },
    {
      accountId: '3',
      platform: 'Instagram',
      logo: instagramLogo,
      linked: link_to_instagram == 'None' ? false : true,
    },
    {
      accountId: '4',
      platform: 'Gmail',
      logo: GmailLogo,
      linked: link_to_gmail == 'None' ? false : true,
    },
    {
      accountId: '5',
      platform: 'Google Drive',
      logo: GoogleDriveLogo,
      linked: link_to_google_drive == 'None' ? false : true,
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
          <Image source={item.logo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
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
