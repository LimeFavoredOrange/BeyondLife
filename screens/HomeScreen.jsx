import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Tabs from '../components/Tabs/Tabs';
import { useSelector } from 'react-redux';
import { selectSelectedTab } from '../redux/slices/homeSlice';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 图标库

import * as ExpoFileSystem from 'expo-file-system';
import twitterRestore from '../Data/Twitter/twitterRestore';

import HomeHeader from '../components/Home/Homeheader';
import HomeDashboard from '../components/Home/Homedashboard';
import AccountManagerDashboard from '../components/Account/AccountManagerDashboard';
import LinkAccount from '../components/Link/LinkAccount';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import AccountDashboard from '../components/Account/AutomaticWillDashboard';
import { set } from 'ramda';
import NotificationOverlay from '../components/NotificationOverlay';

import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
  tokenEndpoint: 'https://www.dropbox.com/oauth2/token',
};

const generateCodeVerifier = async () => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const codeVerifier = Array.from(randomBytes)
    .map((byte) => ('0' + byte.toString(16)).slice(-2))
    .join('');

  // 使用 BASE64 编码生成 code_challenge，然后转换为 BASE64URL
  let codeChallenge = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });

  // 将 BASE64 编码转换为 BASE64URL 格式
  codeChallenge = codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { codeVerifier, codeChallenge };
};

const HomeScreen = () => {
  const selectedTab = useSelector(selectSelectedTab);
  const navigation = useNavigation();

  const [showStorageOptionScreen, setShowStorageOptionScreen] = React.useState(true);
  const [showCloudPlatforms, setShowCloudPlatforms] = React.useState(false);
  const [firstTimeDelay, setFirstTimeDelay] = React.useState(1200);

  const [showNotification, setShowNotification] = React.useState(false);

  const showStorageOption = {
    0: {
      opacity: 0,
      transform: [{ translateY: 500 }],
    },
    1: {
      opacity: 0.98,
      transform: [{ translateY: 0 }],
    },
  };

  const notifications = [
    'Your account has been successfully linked to Twitter',
    'Your account has been successfully linked to Google Drive',
    'Your account has been successfully linked to Gmail',
    'Your account has been successfully linked to Facebook',
  ];

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      iosClientId: '759598077912-r27lg26pndr093siik6fd1ah3tf4ug1h.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo, '\n');

      const tokens = await GoogleSignin.getTokens();
      console.log(tokens);
    } catch (error) {}
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'f99a4yglyytbmgo',
      // There are no scopes so just pass an empty array
      scopes: [],
      redirectUri: makeRedirectUri({
        scheme: 'digitalWill',
        path: 'oauth',
      }),
    },
    discovery
  );

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { code } = response.params;
  //     console.log('Authorization Code:', code);

  //     const tokenRequest = {
  //       code,
  //       redirect_uri: makeRedirectUri({
  //         scheme: 'digitalWill',
  //       }),
  //       client_id: 'f99a4yglyytbmgo',
  //       grant_type: 'access_token',
  //     };

  //   }
  // }, [response]);

  useEffect(() => {
    const getToken = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;
        console.log('Authorization Code:', code);

        // 获取 code_verifier 和 code_challenge
        // const { codeVerifier } = await generateCodeVerifier();

        // const redirectUri = AuthSession.makeRedirectUri({
        //   scheme: 'digitalWill',
        //   path: 'oauth',
        // });

        // // 构建 token 请求
        // const tokenRequestBody = new URLSearchParams({
        //   code,
        //   grant_type: 'authorization_code',
        //   client_id: 'f99a4yglyytbmgo',
        //   redirect_uri: redirectUri,
        //   code_verifier: codeVerifier,
        // }).toString();

        // try {
        //   // 发送请求到 Dropbox 获取 access_token
        //   const tokenResponse = await fetch('https://api.dropboxapi.com/oauth2/token', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: tokenRequestBody,
        //   });

        //   const tokenData = await tokenResponse.json();

        //   if (tokenData.access_token) {
        //     console.log('Access Token:', tokenData.access_token);
        //   } else {
        //     console.error('Failed to obtain access token:', tokenData);
        //   }
        // } catch (error) {
        //   console.error('Access Token Error:', error);
        // }
      }
    };

    getToken();
  }, [response]);

  return (
    <>
      <SafeAreaView className="bg-white w-screen h-screen">
        {selectedTab === 'Home' && (
          <>
            <HomeHeader setShowNotification={setShowNotification} />
            <HomeDashboard setShowStorageOptionScreen={setShowStorageOptionScreen} />
          </>
        )}

        {selectedTab === 'Link' && (
          <>
            <AccountHeader title={'Link accounts'} />
            <LinkAccount />
          </>
        )}

        {selectedTab === 'Key' && (
          <>
            <AccountHeader
              title={'Accounts manager'}
              isTab={true}
              tabIcon={{ name: 'add-to-list', type: 'entypo' }}
              tabIconFunction={() => navigation.navigate('Add Account')}
            />
            <AccountManagerDashboard />
          </>
        )}

        {selectedTab === 'Document' && (
          <>
            <AccountHeader
              title={'Automatic Will'}
              isTab={true}
              tabIcon={{ name: 'upload', type: 'entypo' }}
              tabIconFunction={async () => {
                try {
                  const file = await DocumentPicker.getDocumentAsync({});
                  if (file.name !== 'twitterBackup.txt') {
                    alert('Please upload the correct file');
                    return;
                  }
                  navigation.navigate('View Backup');
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            <AccountDashboard />
          </>
        )}

        {selectedTab === 'Setting' && <AccountHeader title={'Settings'} />}
        <Tabs />

        {showStorageOptionScreen && (
          <Animatable.View
            animation={showStorageOption}
            duration={1100}
            className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 h-screen w-screen opacity-20"
          >
            <View style={{ paddingTop: 80 }} className="p-6 w-full h-full rounded-t-3xl absolute bottom-0">
              {showCloudPlatforms === false && (
                <Animatable.View animation={'fadeInLeft'} delay={firstTimeDelay}>
                  <Text className="text-2xl font-bold mb-4 text-center">Welcome to BeyondLife</Text>
                  <Text className="text-base text-center mb-6">
                    At BeyondLife, your memories and important data matter. Choose how you want to store your
                    data—whether it's connecting your preferred cloud platforms or using our secure cloud storage.
                  </Text>

                  <Text className="text-base text-center mb-6">
                    The more platforms you connect, the more redundant and secure your data becomes. However, keep in
                    mind that balancing security and performance is key. Choose the solution that fits your needs.
                  </Text>

                  {/* Options for Cloud Storage */}
                  <Text className="text-lg font-semibold mb-2">Choose your storage options:</Text>

                  <View className="flex-col space-y-4">
                    {/* Option 1: Our Cloud */}
                    <TouchableOpacity
                      style={{ backgroundColor: '#036635' }}
                      className="p-4 bg-blue-500 rounded-lg"
                      onPress={() => {
                        setShowStorageOptionScreen(false);
                        setFirstTimeDelay(1200);
                      }}
                    >
                      <Text className="text-white font-bold text-center">Use BeyondLife Cloud Storage</Text>
                    </TouchableOpacity>

                    {/* Option 2: Connect External Cloud Platforms */}
                    <TouchableOpacity
                      style={{ backgroundColor: '#4682B4' }}
                      className="p-4 bg-blue-500 rounded-lg"
                      onPress={() => {
                        setShowCloudPlatforms(true); // 展示外部云平台按钮
                      }}
                    >
                      <Text className="text-white font-bold text-center">Connect External Cloud Platforms</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-6">
                    <Text className="text-center text-sm text-gray-600">
                      The more platforms you connect, the safer your data, but processing times might increase slightly
                      due to redundancy.
                    </Text>
                  </View>
                </Animatable.View>
              )}

              {showCloudPlatforms && (
                <Animatable.View className="mt-6 space-y-4" animation={'fadeInRight'}>
                  <TouchableOpacity
                    className="p-4 bg-gray-300 rounded-lg flex-row items-center space-x-2"
                    onPress={() => {
                      setShowCloudPlatforms(false);
                      setFirstTimeDelay(0);
                    }}
                  >
                    <Icon name="arrow-left" size={24} color="#000" />
                    <Text className="text-black font-bold">Back</Text>
                  </TouchableOpacity>

                  <Text className="text-lg font-semibold mb-2 text-center">Available Cloud Platforms:</Text>

                  <TouchableOpacity
                    className="p-4 bg-[#4285F4] rounded-lg flex-row items-center space-x-2"
                    onPress={() => googleSignIn()}
                  >
                    <Icon name="google-drive" size={24} color="#FFFFFF" />
                    <Text className="text-white font-bold">Connect to Google Drive</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="p-4 bg-[#0061FF] rounded-lg flex-row items-center space-x-2"
                    onPress={() => promptAsync()}
                  >
                    <Icon name="dropbox" size={24} color="#FFFFFF" />
                    <Text className="text-white font-bold">Connect to Dropbox</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="p-4 bg-[#0078D4] rounded-lg flex-row items-center space-x-2">
                    <Icon name="microsoft-onedrive" size={24} color="#FFFFFF" />
                    <Text className="text-white font-bold">Connect to OneDrive</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="p-4 bg-[#A9A9A9] rounded-lg flex-row items-center space-x-2">
                    <Icon name="apple" size={24} color="#FFFFFF" />
                    <Text className="text-white font-bold">Connect to iCloud</Text>
                  </TouchableOpacity>

                  <View className="mt-6">
                    <Text className="text-center text-sm text-gray-600">
                      Select the platform where you want to store your data. Connecting multiple platforms will enhance
                      data redundancy and security, though it may impact performance.
                    </Text>
                  </View>
                </Animatable.View>
              )}
            </View>
          </Animatable.View>
        )}
      </SafeAreaView>

      {showNotification && (
        <NotificationOverlay notifications={notifications} onClose={() => setShowNotification(false)} />
      )}
    </>
  );
};

export default HomeScreen;
