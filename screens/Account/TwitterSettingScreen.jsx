import { View, Text, SafeAreaView, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import axios from 'axios';
import { Button, SearchBar, Badge, Input } from '@rneui/themed';

import Loading from '../../components/Loading';
import { userData } from '../../Data/Twitter/twitterData';
import { useNavigation } from '@react-navigation/native';

const TwitterSettingScreen = () => {
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

  const [accessPolicy, setAccessPolicy] = React.useState(['', '', '']);

  // Function to get all tweets
  const getTweets = async () => {
    setShowLoading(true);
    const response = userData;
    const tweetsData = response.tweets.data;

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

  const removeLink = (text) => {
    const regex = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
    return text.replace(regex, '');
  };

  const getImage = (key) => {
    const media = medias.find((item) => item.media_key === key);
    return media?.url;
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Setup Twitter'}
        icon={[{ name: 'arrow-right-circle', type: 'feather' }]}
        iconFunction={[
          () => {
            // Navigate to the twitter setting screen
            console.log(accessPolicy);
            navigation.navigate('Heir Setting', { accessPolicy });
          },
        ]}
      />

      <FlatList
        data={targets}
        renderItem={({ item }) => {
          // Just render the first 3 tweets
          if (item.index > 3) {
            return null;
          }
          return (
            <View className="flex-row border-b">
              <View style={{ width: '80%' }} className="bg-gray-100 p-2 min-h-fit ">
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

                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    // Update the access policy, access policy is a array
                    const newAccessPolicy = [...accessPolicy];
                    newAccessPolicy[item.index - 1] = text;
                    setAccessPolicy(newAccessPolicy);
                  }}
                  value={accessPolicy[item.index - 1]}
                  placeholder="Enter access policy"
                  keyboardType="text"
                />
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 30,
    marginTop: 6,
    borderWidth: 0.5,
    padding: 5,
  },
});

export default TwitterSettingScreen;
