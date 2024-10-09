import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
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

const HomeScreen = () => {
  const selectedTab = useSelector(selectSelectedTab);
  const navigation = useNavigation();

  const [showStorageOptionScreen, setShowStorageOptionScreen] = React.useState(true);
  const [showCloudPlatforms, setShowCloudPlatforms] = React.useState(false);
  const [firstTimeDelay, setFirstTimeDelay] = React.useState(1200);

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

  return (
    <SafeAreaView className="bg-white w-screen h-screen">
      {selectedTab === 'Home' && (
        <>
          <HomeHeader />
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
                  At BeyondLife, your memories and important data matter. Choose how you want to store your data—whether
                  it's connecting your preferred cloud platforms or using our secure cloud storage.
                </Text>

                <Text className="text-base text-center mb-6">
                  The more platforms you connect, the more redundant and secure your data becomes. However, keep in mind
                  that balancing security and performance is key. Choose the solution that fits your needs.
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

                <TouchableOpacity className="p-4 bg-[#4285F4] rounded-lg flex-row items-center space-x-2">
                  <Icon name="google-drive" size={24} color="#FFFFFF" />
                  <Text className="text-white font-bold">Connect to Google Drive</Text>
                </TouchableOpacity>

                <TouchableOpacity className="p-4 bg-[#0061FF] rounded-lg flex-row items-center space-x-2">
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
  );
};

export default HomeScreen;
