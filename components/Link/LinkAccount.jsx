import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
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
import { Buffer } from 'buffer';

import { CLIENT_ID, CLIENT_SECRET, BACKEND_URL } from '@env';

import { selectToken } from '../../redux/slices/auth';

import axiosInstance from '../../api';
import { tryCatch } from 'ramda';
import { current } from '@reduxjs/toolkit';

const AccountManagerDashboard = () => {
  const navigation = useNavigation();
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const link_to_facebook = useSelector(selectLinkToFacebook);
  const link_to_twitter = useSelector(selectLinkToTwitter);
  const link_to_instagram = useSelector(selectLinkToInstagram);
  const link_to_gmail = useSelector(selectLinkToGmail);
  const link_to_google_drive = useSelector(selectLinkToGoogleDrive);

  const [loading, setLoading] = useState(true);

  WebBrowser.maybeCompleteAuthSession();

  const discovery = {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.x.com/2/oauth2/token',
    revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
  };

  const token = useSelector(selectToken);

  // Twitter OAuth configuration
  const redirectUri = makeRedirectUri({
    scheme: 'digitalWill', // Custom scheme, ensure this matches your app config
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID, // Replace with your Twitter client ID
      redirectUri: redirectUri, // The custom redirect URI
      scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'], // Properly separated scopes
      responseType: 'code', // Authorization Code Flow
      codeChallenge: 'challenge', // PKCE challenge (generate dynamically or hardcoded for testing)
    },
    discovery // Endpoints
  );

  const basicAuth = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization Code:', code);

      const tokenRequest = {
        code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID, // Your Twitter client ID
        grant_type: 'authorization_code',
        code_verifier: request.codeVerifier, // PKCE challenge
      };

      // Send the token request
      fetch('https://api.x.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: basicAuth,
        },
        body: new URLSearchParams(tokenRequest).toString(),
      })
        .then((tokenResponse) => tokenResponse.json())
        .then((tokenData) => {
          console.log('Access Token:', tokenData);
          setLoading(true);
          // Link the Twitter account using fetch tp BACKEND_URL
          fetch(`${BACKEND_URL}/link/twitter`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: tokenData.access_token,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Link Twitter Response:', data);
              // Change the linked status of twitter to true
              setLinkedAccountStatus((prevStatus) => ({
                ...prevStatus,
                twitter: tokenData.access_token,
              }));
              setLoading(false);
            })
            .catch((error) => {
              console.error('Link Twitter Error:', error);
              setLoading(false);
            });
        })
        .catch((error) => console.error('Access Token Error:', error));
    }
  }, [response]);

  const [linkedAccountStatus, setLinkedAccountStatus] = useState({});

  useEffect(() => {
    axiosInstance
      .get('link/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Linked Account Status:', response.data);
        setLinkedAccountStatus(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Linked Account Status Error:', error);
        setLoading(false);
      });
  }, []);

  const accounts = [
    {
      accountId: '1',
      platform: 'X',
      logo: xLogo,
      linked: linkedAccountStatus?.twitter == 'None' ? false : true,
      linkFunction: () => {
        if (linkedAccountStatus?.twitter == 'None') {
          promptAsync({ useProxy: false });
        } else {
          try {
            axiosInstance.delete('link/twitter', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Change the linked status of twitter to false
            setLinkedAccountStatus((prevStatus) => ({
              ...prevStatus,
              twitter: 'None',
            }));
            console.log('Twitter unlinked');
          } catch (error) {
            console.error('Unlink Twitter Error:', error);
          }
        }
      },
    },
    {
      accountId: '2',
      platform: 'Gmail',
      logo: GmailLogo,
      linked: linkedAccountStatus?.gmail == 'None' ? false : true,
      linkFunction: () => console.log('Link Gmail'),
    },
    {
      accountId: '3',
      platform: 'Google Drive',
      logo: GoogleDriveLogo,
      linked: linkedAccountStatus?.google_drive == 'None' ? false : true,
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
          {loading ? (
            <ActivityIndicator size="small" color="#036635" />
          ) : (
            <Button
              size="sm"
              containerStyle={{ marginRight: 5, width: 80 }}
              radius={'md'}
              color={`${item.linked ? '#DC143C' : '#036635'}`}
              title={`${item.linked ? 'Unlink' : 'Link'}`}
              onPress={item.linkFunction}
            />
          )}
        </TouchableOpacity>
      )}
    />
  );
};

export default AccountManagerDashboard;
