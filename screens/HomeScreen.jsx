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
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import { selectToken } from '../redux/slices/auth';

import { DROPBOX_KEY, GOOGLE_IOSCLIENT_ID, GOOGLE_WEB_ID } from '@env';
import axiosInstance from '../api';
import Loading from '../components/Loading';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
  tokenEndpoint: 'https://www.dropbox.com/oauth2/token',
};

const HomeScreen = () => {
  const selectedTab = useSelector(selectSelectedTab);
  const token = useSelector(selectToken);
  const navigation = useNavigation();

  const [showLoading, setShowLoading] = useState(false);

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
      iosClientId: GOOGLE_IOSCLIENT_ID,
      webClientId: GOOGLE_WEB_ID,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const googleSignIn = async () => {
    try {
      setShowLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const serverAuthCode = userInfo.data.serverAuthCode;

      const response = await axiosInstance.post(
        'upload/googleDrive/exchangeToken',
        {
          serverAuthCode: serverAuthCode,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the connected platforms
      const connected = [...connectedPlatforms];
      connected.push('googleDrive');
      setConnectedPlatforms(connected);
      setShowLoading(false);
    } catch (error) {
      console.log(error);
      setShowLoading(false);
    }
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: DROPBOX_KEY,
      scopes: [],
      redirectUri: makeRedirectUri({
        scheme: 'digitalWill',
        path: 'oauth',
      }),
      extraParams: {
        token_access_type: 'offline', // Request offline access for refresh token
      },
      usePKCE: true,
      responseType: ResponseType.Code,
    },
    discovery
  );

  const dropbox_exchange_token = async (code, codeVerifier) => {
    try {
      console.log('Code:', code);
      console.log('Code Verifier:', codeVerifier);
      const response = await axiosInstance.post(
        'upload/dropbox/exchange_token',
        {
          code: code,
          codeVerifier: codeVerifier,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the connected platforms
      const connected = [...connectedPlatforms];
      connected.push('dropbox');
      setConnectedPlatforms(connected);
      setShowLoading(false);
    } catch (error) {
      console.log(error.message);
      setShowLoading(false);
    }
  };

  // Handle Authorization Response
  useEffect(() => {
    if (response?.type === 'success') {
      setShowLoading(true);
      const { code } = response.params;
      const codeVerifier = request?.codeVerifier;
      console.log('Authorization Code:', response?.params?.code);
      console.log('Code Verifier:', request?.codeVerifier);

      // Exchange the code for the access token
      dropbox_exchange_token(code, codeVerifier);
    }
  }, [response]);

  const [connectedPlatforms, setConnectedPlatforms] = React.useState([]);
  const [unconnectedPlatforms, setUnconnectedPlatforms] = React.useState([]);

  const GoogleDriveButton = ({ connected }) => {
    const bgColor = connected ? 'bg-[#DFF7E1]' : 'bg-[#4285F4]'; // 已连接用浅绿色，未连接用Google蓝
    const textColor = connected ? 'text-[#1E7D32]' : 'text-white'; // 已连接文字深绿色
    const iconColor = connected ? '#1E7D32' : '#FFFFFF'; // 已连接图标深绿色

    return (
      <TouchableOpacity
        className={`p-4 ${bgColor} rounded-lg flex-row items-center space-x-2 mt-2 shadow-md`}
        onPress={connected ? () => alert('Are you sure you want to unlink Google Drive?') : () => googleSignIn()}
      >
        <Icon name="google-drive" size={24} color={iconColor} />
        <Text className={`font-bold ${textColor}`}>{connected ? 'Unlink ' : 'Connect to '}Google Drive</Text>
        {connected && <Icon name="check-circle" size={20} color="#1E7D32" className="ml-2" />}
      </TouchableOpacity>
    );
  };

  const DropboxButton = ({ connected }) => {
    const color = connected ? 'bg-[#DFF7E1]' : 'bg-[#0061FF]'; // 已连接使用浅绿色，未连接为蓝色
    const textColor = connected ? 'text-[#1E7D32]' : 'text-white'; // 已连接文字为深绿色，未连接为白色
    const iconColor = connected ? '#1E7D32' : '#FFFFFF'; // 已连接图标深绿色，未连接图标为白色

    return (
      <TouchableOpacity
        className={`p-4 ${color} rounded-lg flex-row items-center space-x-2 mt-2 shadow-md`}
        onPress={connected ? () => alert('Are you sure you want to unlink Dropbox?') : () => promptAsync()}
      >
        <Icon name="dropbox" size={24} color={iconColor} />
        <Text className={`font-bold ${textColor}`}>{connected ? 'Unlink ' : 'Connect to '}Dropbox</Text>
        {connected && <Icon name="check-circle" size={20} color="#1E7D32" className="ml-2" />}
      </TouchableOpacity>
    );
  };

  const OneDriveButton = ({ connected }) => {
    const bgColor = connected ? 'bg-[#DFF7E1]' : 'bg-[#0078D4]'; // 已连接用浅绿色，未连接用微软蓝
    const textColor = connected ? 'text-[#1E7D32]' : 'text-white';
    const iconColor = connected ? '#1E7D32' : '#FFFFFF';

    return (
      <TouchableOpacity
        className={`p-4 ${bgColor} rounded-lg flex-row items-center space-x-2 mt-2 shadow-md`}
        onPress={connected ? () => alert('Are you sure you want to unlink OneDrive?') : null}
      >
        <Icon name="microsoft-onedrive" size={24} color={iconColor} />
        <Text className={`font-bold ${textColor}`}>{connected ? 'Unlink ' : 'Connect to '}OneDrive</Text>
        {connected && <Icon name="check-circle" size={20} color="#1E7D32" className="ml-2" />}
      </TouchableOpacity>
    );
  };

  const ICloudButton = ({ connected }) => {
    const bgColor = connected ? 'bg-[#DFF7E1]' : 'bg-[#4A90E2]'; // 已连接用浅绿色，未连接用柔和的蓝
    const textColor = connected ? 'text-[#1E7D32]' : 'text-white';
    const iconColor = connected ? '#1E7D32' : '#FFFFFF';

    return (
      <TouchableOpacity
        className={`p-4 ${bgColor} rounded-lg flex-row items-center space-x-2 mt-2 shadow-md`}
        onPress={connected ? () => alert('Are you sure you want to unlink iCloud?') : null}
      >
        <Icon name="apple" size={24} color={iconColor} />
        <Text className={`font-bold ${textColor}`}>{connected ? 'Unlink ' : 'Connect to '}iCloud</Text>
        {connected && <Icon name="check-circle" size={20} color="#1E7D32" className="ml-2" />}
      </TouchableOpacity>
    );
  };

  const renderButton = (platform, connected) => {
    switch (platform) {
      case 'googleDrive':
        return <GoogleDriveButton key={platform} connected={connected} />;
      case 'dropbox':
        return <DropboxButton key={platform} connected={connected} />;
      case 'oneDrive':
        return <OneDriveButton key={platform} connected={connected} />;
      case 'iCloud':
        return <ICloudButton key={platform} connected={connected} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Get the upload platform setup status for the current user
    const getUploadPlatformSetup = async () => {
      try {
        if (!token) {
          return;
        }
        const response = await axiosInstance.get('upload/setup_status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the connected and unconnected platforms
        const setupStatus = response.data;
        const connected = [];
        const unconnected = [];

        for (const platform in setupStatus) {
          if (setupStatus[platform] === true) {
            connected.push(platform);
          } else {
            unconnected.push(platform);
          }
        }

        setConnectedPlatforms(connected);
        setUnconnectedPlatforms(unconnected);
      } catch (error) {
        console.error(error.message);
      }
    };

    getUploadPlatformSetup();
  }, [token]);

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

                  {unconnectedPlatforms.length > 0 && (
                    <View>
                      <Text className="text-lg font-semibold mb-2 text-center">Available Cloud Platforms:</Text>
                      {unconnectedPlatforms.map((platform, index) => renderButton(platform, false))}
                    </View>
                  )}

                  {connectedPlatforms.length > 0 && (
                    <>
                      <Text className="text-lg font-semibold mb-2 text-center mt-5">Connected Cloud Platforms:</Text>
                      {connectedPlatforms.map((platform, index) => renderButton(platform, true))}
                    </>
                  )}

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
      <Loading show={showLoading} />
    </>
  );
};

export default HomeScreen;
