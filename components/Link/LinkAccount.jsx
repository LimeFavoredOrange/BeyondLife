import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import { Button, Tooltip } from '@rneui/base';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/slices/auth';
import axiosInstance from '../../api';
import xLogo from '../../assets/logos/x.jpg';
import GmailLogo from '../../assets/logos/gmail.png';
import GoogleDriveLogo from '../../assets/logos/google_drive.png';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Buffer } from 'buffer';

import { CLIENT_ID, CLIENT_SECRET, BACKEND_URL } from '@env';

WebBrowser.maybeCompleteAuthSession();

const AccountManagerDashboard = () => {
  const windowHeight = Dimensions.get('window').height;
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(true);
  const [linkedAccountStatus, setLinkedAccountStatus] = useState({});
  const [showTooltip, setShowTooltip] = useState({
    gmail: false,
    googleDrive: false,
  });

  // 获取当前绑定状态
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

  // Twitter OAuth 配置
  const discovery = {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.x.com/2/oauth2/token',
    revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
  };

  const redirectUri = makeRedirectUri({
    scheme: 'BeyondLife',
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
      responseType: 'code',
      codeChallenge: 'challenge',
    },
    discovery
  );

  // 处理 Twitter 认证回调
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization Code:', code);
      console.log('Client ID:', CLIENT_ID);
      console.log('Client Secret:', CLIENT_SECRET);

      const tokenRequest = {
        code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code_verifier: request.codeVerifier,
      };

      const basicAuth = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      console.log('Basic Auth:', basicAuth);

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

  // 处理 Tooltip
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
          promptAsync({ useProxy: false });
        } else {
          try {
            axiosInstance.delete('link/twitter', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
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
      disabled: false,
      tooltipKey: null,
    },
    {
      accountId: '2',
      platform: 'Gmail',
      logo: GmailLogo,
      linked: linkedAccountStatus?.gmail !== 'None',
      linkFunction: () => handleTooltipPress('gmail'),
      disabled: true,
      tooltipKey: 'gmail',
    },
    {
      accountId: '3',
      platform: 'Google Drive',
      logo: GoogleDriveLogo,
      linked: linkedAccountStatus?.google_drive !== 'None',
      linkFunction: () => handleTooltipPress('googleDrive'),
      disabled: true,
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
              <Button
                size="sm"
                containerStyle={{
                  marginRight: 5,
                  width: 80,
                }}
                radius={'md'}
                color={item.linked ? '#DC143C' : '#036635'}
                title={item.linked ? 'Unlink' : 'Link'}
                disabled={item.disabled}
                onPress={() => item.linkFunction()}
              />
            )}
          </TouchableOpacity>
        </Tooltip>
      )}
    />
  );
};

export default AccountManagerDashboard;
