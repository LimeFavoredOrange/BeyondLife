import { View, Text, SafeAreaView, FlatList, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import axios from 'axios';
import { Button, SearchBar, Badge } from '@rneui/themed';

import Filter from '../../components/Account/Filter';
import AutoSetting from '../../components/Account/AutoSetting';

import Loading from '../../components/Loading';
import { userData } from '../../Data/Twitter/twitterData';
import twitterBackup from '../../Data/Twitter/twitterBackup';
import { useNavigation } from '@react-navigation/native';

const TwitterScreen = () => {
  // const mlURL = 'https://5331-110-150-115-26.au.ngrok.io';
  const [tweets, setTweets] = React.useState(userData.tweets.data);
  const [targets, setTargets] = React.useState(userData.tweets.data);
  const [imageData, setImageData] = React.useState([]);
  const [offensiveData, setOffensiveData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  let current_data = tweets;

  const [medias, setMedias] = React.useState([]);

  const [tab, setTab] = React.useState('Tweets&replies');
  const [showOptions, setShowOptions] = React.useState(false);

  const [selectImage, setSelectImage] = React.useState(0);
  const [selectOffensive, setSelectOffensive] = React.useState(0);
  const [enable, setEnable] = React.useState(0);

  const [searching, setSearching] = React.useState('');

  const [showSetting, setShowSetting] = React.useState(false);

  const navigation = useNavigation();

  // Function to get all tweets
  const getTweets = async () => {
    setShowLoading(true);
    // const response = await axios.get('https://tor2023-203l.onrender.com/twitter/getTweets');
    // const response = await axios.get('https://1e86-110-150-54-105.ngrok-free.app/twitter/getTweets');
    const response = userData;
    // getUserSetting();
    const tweetsData = response.tweets.data;

    // Check if tweet is offensive
    // for (const tweet in tweetsData) {
    //   const checkOffensive = await detectOffensive(removeLink(tweetsData[tweet].text));
    //   if (checkOffensive === 'Toxicity: True') {
    //     tweetsData[tweet].offensive = true;
    //   } else {
    //     tweetsData[tweet].offensive = false;
    //   }
    // }

    setTweets(tweetsData);
    setTargets(tweetsData);
    setImageData(tweetsData.filter((item) => item.attachments).map((item) => item.id));
    setOffensiveData(tweetsData.filter((item) => item.offensive).map((item) => item.id));
    setMedias(response.tweets.includes.media);
    setShowLoading(false);
  };

  React.useEffect(() => {
    getTweets();
  }, []);

  // Function to check the input text is offensive or not
  // const detectOffensive = async (text) => {
  //   try {
  //     const response = await axios.get(`${mlURL}/detectToxicity`, { params: { text } });
  //     if (response.status === 200) {
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const removeLink = (text) => {
    const regex = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
    return text.replace(regex, '');
  };

  const getImage = (key) => {
    const media = medias.find((item) => item.media_key === key);
    return media?.url;
  };

  // Function to delete tweet
  const deleteTweet = async (id) => {
    // const response = await axios.post(`https://1e86-110-150-54-105.ngrok-free.app/twitter/delete/${id}`);
    // if (response.status === 200) {
    //   setTargets((current) => current.filter((item) => item.id !== id));
    // }
    setTargets((current) => current.filter((item) => item.id !== id));
  };

  const checkAutomaticAction = (target) => {
    if (selectImage === 1 && target.attachments) {
      return true;
    }
    if (selectOffensive === 1 && target.offensive) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const tar = tweets.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));
      setTargets(tar);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searching]);

  // Function to apply filter
  const applyFunction = async (option, offensive, tab, current_data) => {
    let tar = current_data.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));

    if (option === 'containMedia') {
      tar = tar.filter((item) => item.attachments);
    } else if (option === 'noMedia') {
      tar = tar.filter((item) => !item.attachments);
    }

    if (offensive === 'offensive') {
      tar = tar.filter((item) => item.offensive);
    }

    if (tab === 'Replies') {
      tar = tar.filter((item) => item.in_reply_to_user_id);
    }
    return tar;
  };

  // Function to get the current user setting
  // const getUserSetting = async () => {
  //   try {
  //     const res = await axios.get('https://tor2023-203l.onrender.com/twitter/autoSetting?userId=1');
  //     const { deleteimage, deleteoffensive } = res.data;
  //     console.log(deleteimage, deleteoffensive);
  //     if (deleteimage === true) {
  //       setSelectImage(1);
  //     } else {
  //       setSelectImage(0);
  //     }

  //     if (deleteoffensive === true) {
  //       setSelectOffensive(1);
  //     } else {
  //       setSelectOffensive(0);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Twitter'}
        icon={[
          { name: 'options', type: 'ionicon' },
          { name: 'refresh-auto', type: 'material-community' },
          { name: 'clouddownload', type: 'antdesign' },
          { name: 'upload-cloud', type: 'feather' },
          { name: 'unlock', type: 'feather' },
        ]}
        iconFunction={[
          () => {
            setShowOptions(true);
          },
          () => {
            setShowSetting(true);
          },
          async () => {
            // Send the local backup file to the user (twitterBackup.txt)
            // ../../Data/twitterData/tweetsData.txt
            const fileUri = FileSystem.documentDirectory + 'twitterBackup.txt';
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(twitterBackup));
            const downloadedFile = await FileSystem.getInfoAsync(fileUri);

            const imageFileExts = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];
            const isIos = Platform.OS === 'ios';

            if (isIos && imageFileExts.every((x) => !downloadedFile.uri.endsWith(x))) {
              const UTI = 'twitter.item';
              await Sharing.shareAsync(downloadedFile.uri, { UTI });
            } else {
              await Sharing.shareAsync(downloadedFile.uri);
            }
          },
          () => {
            // Navigate to the twitter setting screen
            navigation.navigate('Twitter Setting');
          },
          () => {
            // Navigate to the twitter decryption screen
            navigation.navigate('Twitter Decryption');
          },
        ]}
      />

      <SearchBar
        placeholder="Search tweets......"
        platform="ios"
        onChangeText={(e) => setSearching(e)}
        value={searching}
      />

      <FlatList
        data={targets}
        renderItem={({ item }) => {
          return (
            <View className="flex-row border-b">
              <View style={{ height: 230, width: '80%' }} className="bg-gray-100 p-2 ">
                <Text className="mb-2">id: {item.id}</Text>
                <Text className="mb-2">author_id: {item.author_id}</Text>
                <Text className="mb-2">created_at: {item.created_at}</Text>
                {checkAutomaticAction(item) && (
                  <Text>
                    <Badge className="mb-2" value="will be automatically delete" status="primary" />
                  </Text>
                )}
                {/* If the tweet doesn't contain image */}
                {item.attachments === undefined && <Text className="mb-2">text: {item.text}</Text>}

                {/* If the tweet contain image */}
                {item.attachments && (
                  <>
                    <Text className="mb-2">text: {removeLink(item.text)}</Text>
                    <Image
                      height={300}
                      width={300}
                      source={{ uri: `${getImage(item.attachments.media_keys[0])}`, width: 200, height: 110 }}
                    />
                  </>
                )}
              </View>
              <View className="justify-center items-center bg-gray-100 ">
                <Button color="#FF2E2E" buttonStyle={{ borderRadius: 15 }} onPress={() => deleteTweet(item.id)}>
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </View>
            </View>
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

      {/* Setting popup */}
      <AutoSetting
        showSetting={showSetting}
        setShowSetting={setShowSetting}
        setTargets={setTargets}
        tab={tab}
        current_data={current_data}
        setSelectImage={setSelectImage}
        setSelectOffensive={setSelectOffensive}
        setEnable={setEnable}
        enable={enable}
        selectImage={selectImage}
        selectOffensive={selectOffensive}
        imageData={imageData}
        offensiveData={offensiveData}
      />
    </SafeAreaView>
  );
};

export default TwitterScreen;
