import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import axiosInstance from '../../api';
import { Button, SearchBar, Badge, Divider } from '@rneui/themed';

import Filter from '../../components/Account/Filter';
import AutoSetting from '../../components/Account/AutoSetting';

import Loading from '../../components/Loading';
import { userData } from '../../Data/Twitter/twitterData';
import twitterBackup from '../../Data/Twitter/twitterBackup';
import { useNavigation } from '@react-navigation/native';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown Date'; // 防止 undefined 报错
  const date = new Date(timestamp.replace(' ', 'T'));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const TwitterScreen = () => {
  // const mlURL = 'https://5331-110-150-115-26.au.ngrok.io';
  const [tweets, setTweets] = React.useState(userData.tweets.data);
  // const [targets, setTargets] = React.useState(userData.tweets.data);
  const [dummyTweets, setDummyTweets] = React.useState([
    {
      id: 1,
      text: 'First tweet, welcome to Sydney',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-JI9zihxNGOqiYdiX2OuqegWCEiev0eAPAw&s'],
      timestamp: '2024-11-26 06:40:57',
    },
    {
      id: 2,
      text: 'Second tweet, Call for Papers: Exploring the History of the Web, from Inception to Present @TheWebConf 2025 @TheOfficialACM',
      images: [''],
      timestamp: '2024-11-28 21:40:57',
    },
    {
      id: 3,
      text: 'Third tweet, #TheWebConf24 Cheers, beers, volunteers! Thank you!',
      images: [''],
      timestamp: '2024-12-05 08:40:57',
    },
    { id: 4, text: 'This is for testing purpose only: what the fuck!', images: [''], timestamp: '2024-12-07 09:40:57' },
  ]);

  const [targets, setTargets] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  let current_data = tweets;

  const [tab, setTab] = React.useState('Tweets&replies');
  const [showOptions, setShowOptions] = React.useState(false);

  const [searching, setSearching] = React.useState('');

  const detectOffensive = async (text) => {
    try {
      const response = await axiosInstance.post('/offensive/check', { text });
      console.log('response', response.data);
      return response.data.contains_offensive_language;
    } catch (error) {
      console.error('Error detecting offensive language:', error);
      return false; // 发生错误时默认返回 false
    }
  };

  // Function to get all tweets
  const getTweets = async () => {
    setShowLoading(true);
    // Check if tweet is offensive
    for (const tweet of dummyTweets) {
      const checkOffensive = await detectOffensive(tweet.text);
      tweet.offensive = checkOffensive;
    }
    const temp = [...dummyTweets];
    setTargets(temp);
    setDummyTweets(temp);

    setShowLoading(false);
  };

  React.useEffect(() => {
    getTweets();
  }, []);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const tar = dummyTweets.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));
      setTargets(tar);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searching]);

  // Function to apply filter
  const applyFunction = (option, offensive, tab, current_data) => {
    let tar = dummyTweets.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));

    console.log('option', option);

    if (option === 'containMedia') {
      console.log('containMedia');
      tar = tar.filter((item) => item.images && item.images[0]);
    } else if (option === 'noMedia') {
      console.log('noMedia');
      tar = tar.filter((tweet) => !tweet.images || tweet.images.length === 0 || tweet.images.every((img) => !img));
    }

    if (offensive === 'offensive') {
      console.log('offensive');
      tar = tar.filter((item) => item.offensive);
    }
    console.log('tar', tar);
    return tar;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Twitter'}
        icon={[
          { name: 'options', type: 'ionicon' },
          // { name: 'refresh-auto', type: 'material-community' },
          // { name: 'clouddownload', type: 'antdesign' },
          // { name: 'upload-cloud', type: 'feather' },
          // { name: 'unlock', type: 'feather' },
        ]}
        iconFunction={[
          () => {
            setShowOptions(true);
          },
          // () => {
          //   setShowSetting(true);
          // },
          // async () => {
          //   // Send the local backup file to the user (twitterBackup.txt)
          //   // ../../Data/twitterData/tweetsData.txt
          //   const fileUri = FileSystem.documentDirectory + 'twitterBackup.txt';
          //   await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(twitterBackup));
          //   const downloadedFile = await FileSystem.getInfoAsync(fileUri);

          //   const imageFileExts = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];
          //   const isIos = Platform.OS === 'ios';

          //   if (isIos && imageFileExts.every((x) => !downloadedFile.uri.endsWith(x))) {
          //     const UTI = 'twitter.item';
          //     await Sharing.shareAsync(downloadedFile.uri, { UTI });
          //   } else {
          //     await Sharing.shareAsync(downloadedFile.uri);
          //   }
          // },
          // () => {
          //   // Navigate to the twitter setting screen
          //   navigation.navigate('Twitter Setting');
          // },
          // () => {
          //   // Navigate to the twitter decryption screen
          //   navigation.navigate('Twitter Decryption');
          // },
        ]}
      />

      <SearchBar
        placeholder="Search tweets......"
        platform="ios"
        onChangeText={(e) => setSearching(e)}
        value={searching}
        searchIcon={Platform.OS === 'ios' ? { name: 'search' } : null}
        clearIcon={Platform.OS === 'ios' ? { name: 'close-circle' } : null}
      />

      <Divider />

      <FlatList
        data={targets}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        removeClippedSubviews={false} // 确保列表项不会因优化而被隐藏
        extraData={targets} // 确保状态更新时触发重新渲染
        renderItem={({ item }) => {
          console.log('item', item);
          return (
            <TouchableOpacity
              className="border-b border-gray-300 p-4 bg-white hover:bg-gray-100 active:bg-gray-200 transition"
              activeOpacity={0.6}
            >
              <View className="flex-row items-start">
                {/* 图片（如果有才显示） */}
                {item.images && item.images[0] && item.images[0].trim() ? (
                  <Image source={{ uri: item.images[0] }} className="w-36 h-20 rounded-lg mr-3" resizeMode="cover" />
                ) : null}

                {/* 文字部分，确保 Text 可正常换行，不被 Image 挤压 */}
                <View className="flex-1">
                  <Text className="text-md font-semibold text-gray-900 flex-shrink">{item.text}</Text>
                  <Text className="text-sm text-gray-500 mt-1">{formatTimestamp(item.timestamp)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Filter popup */}
      <Filter
        applyFunction={applyFunction}
        setTargets={setTargets}
        setShowOptions={setShowOptions}
        showOptions={showOptions}
        tab={tab}
        setTab={setTab}
        current_data={current_data}
      />
    </SafeAreaView>
  );
};

export default TwitterScreen;
