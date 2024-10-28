import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import xLogo from '../../assets/logos/x.jpg';
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

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
  tokenEndpoint: 'https://api.x.com/2/oauth2/token',
  revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
};

const AccountManagerDashboard = () => {
  const navigation = useNavigation();
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const link_to_facebook = useSelector(selectLinkToFacebook);
  const link_to_twitter = useSelector(selectLinkToTwitter);
  const link_to_instagram = useSelector(selectLinkToInstagram);
  const link_to_gmail = useSelector(selectLinkToGmail);
  const link_to_google_drive = useSelector(selectLinkToGoogleDrive);

  // Twitter OAuth configuration
  const redirectUri = makeRedirectUri({
    scheme: 'digitalWill', // Custom scheme, ensure this matches your app config
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'ZXFBLXNMSnVsRlRBdGxHVF95V2Q6MTpjaQ', // Replace with your Twitter client ID
      redirectUri: redirectUri, // The custom redirect URI
      scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'], // Properly separated scopes
      responseType: 'code', // Authorization Code Flow
      codeChallenge: 'challenge', // PKCE challenge (generate dynamically or hardcoded for testing)
    },
    discovery // Endpoints
  );

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization Code:', code);

      const tokenRequest = {
        code,
        redirect_uri: redirectUri,
        client_id: 'ZXFBLXNMSnVsRlRBdGxHVF95V2Q6MTpjaQ', // Your Twitter client ID
        grant_type: 'authorization_code',
        code_verifier: request.codeVerifier, // PKCE challenge
      };

      // Send the token request
      fetch('https://api.x.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequest).toString(),
      })
        .then((tokenResponse) => tokenResponse.json())
        .then((tokenData) => {
          console.log('Access Token:', tokenData);
          // Further processing with the tokenData
        })
        .catch((error) => console.error('Access Token Error:', error));
    }
  }, [response]);

  const accounts = [
    {
      accountId: '1',
      platform: 'X',
      logo: xLogo,
      linked: link_to_twitter == 'None' ? false : true,
      linkFunction: () => {
        promptAsync({ useProxy: false });
      },
    },
    {
      accountId: '2',
      platform: 'Gmail',
      logo: GmailLogo,
      linked: link_to_gmail == 'None' ? false : true,
      linkFunction: () => console.log('Link Gmail'),
    },
    {
      accountId: '3',
      platform: 'Google Drive',
      logo: GoogleDriveLogo,
      linked: link_to_google_drive == 'None' ? false : true,
      linkFunction: () => console.log('Link Google Drive'),
    },
  ];

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.accountId}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={(contentWidth, contentHeight) => {
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
            color={`${item.linked ? '#DC143C' : '#036635'}`}
            title={`${item.linked ? 'Unlink' : 'Link'}`}
            onPress={item.linkFunction}
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default AccountManagerDashboard;
