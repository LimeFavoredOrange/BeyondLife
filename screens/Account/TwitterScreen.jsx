import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import AccountHeader from '../../components/Account/AccountHeader';
import axios from 'axios';
import { Button, SearchBar, CheckBox, Divider } from '@rneui/themed';

const TwitterScreen = () => {
  const [tweets, setTweets] = React.useState([]);
  const [targets, setTargets] = React.useState([]);
  let current_data = tweets;

  const [medias, setMedias] = React.useState([]);
  const [likes, setLikes] = React.useState([]);

  const [option, setOption] = React.useState('Default');
  const [offensive, setOffensive] = React.useState('noDetect');
  const [tab, setTab] = React.useState('Tweets&replies');
  const [showOptions, setShowOptions] = React.useState(false);

  const [searching, setSearching] = React.useState('');

  const getTweets = async () => {
    const response = await axios.get('http://localhost:8080/getTweets');
    // const likes = (await axios.get('http://localhost:8080/likes')).data.likedTweets.data;
    setTweets(response.data.tweets.data);
    setTargets(response.data.tweets.data);
    setMedias(response.data.tweets.includes.media);
    setLikes(likes);
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

  const deleteTweet = async (id) => {
    const response = await axios.post(`http://localhost:8080/delete/${id}`);
    if (response.status === 200) {
      setTargets((current) => current.filter((item) => item.id !== id));
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // console.log(searching);
      // console.log(targets);
      const tar = tweets.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));
      setTargets(tar);
      // console.log(applyFunction(option, offensive, tab));
      // setTargets((current) => current.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase())));
      // setTargets(applyFunction(option, offensive, tab));
      // handleSearch();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searching]);

  const applyFunction = async (option, offensive, tab, current_data) => {
    let tar = current_data.filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()));

    if (option === 'containMedia') {
      tar = tar
        .filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()))
        .filter((item) => item.attachments);
    } else if (option === 'noMedia') {
      tar = tar
        .filter((item) => item.text.toUpperCase().includes(searching.toUpperCase()))
        .filter((item) => !item.attachments);
    }

    if (offensive === 'offensive') {
      const offensiveList = [];
      for (const item of tar) {
        // console.log(item);
        const response = await checkOffensive(item.text);
        if (response === 'Toxicity: True') {
          offensiveList.push(item);
        }
      }
      tar = offensiveList;
    }

    if (tab === 'Replies') {
      tar = tar.filter((item) => item.in_reply_to_user_id);
    }
    return tar;
  };

  const handleSearch = async () => {
    const tar = await applyFunction(option, offensive, tab, current_data);
    setTargets(tar);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AccountHeader
        title={'Twitter'}
        icon={{ name: 'options', type: 'ionicon' }}
        iconFunction={() => {
          setShowOptions(true);
        }}
      />
      <SearchBar placeholder="Type Here..." platform="ios" onChangeText={(e) => setSearching(e)} value={searching} />
      <FlatList
        data={targets}
        renderItem={({ item }) => {
          return (
            <View className="flex-row border-b">
              <View style={{ height: 200, width: '80%' }} className="bg-gray-100 p-2">
                <Text>id: {item.id}</Text>
                <Text>author_id: {item.author_id}</Text>
                <Text>created_at: {item.created_at}</Text>
                {item.attachments === undefined && <Text>text: {item.text}</Text>}
                {item.attachments && (
                  <>
                    <Text>text: {removeLink(item.text)}</Text>
                    <Image
                      height={300}
                      width={300}
                      source={{ uri: `${getImage(item.attachments.media_keys[0])}`, width: 100, height: 100 }}
                    />
                  </>
                )}
              </View>
              <View className="justify-center items-center">
                <Button color="#FF2E2E" buttonStyle={{ borderRadius: 15 }} onPress={() => deleteTweet(item.id)}>
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </View>
            </View>
          );
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptions}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowOptions(!showOptions);
        }}
      >
        <View className="flex-1 justify-center items-center mt-6">
          <View className="bg-white rounded-xl shadow-lg items-center relative" style={{ width: 300, height: 350 }}>
            <View className="flex-row justify-center">
              <CheckBox
                checked={option === 'Default'}
                onPress={() => setOption('Default')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={'Default'}
              />

              <CheckBox
                checked={option === 'containMedia'}
                onPress={() => setOption('containMedia')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={'Contain media'}
              />
            </View>
            <CheckBox
              checked={option === 'noMedia'}
              onPress={() => setOption('noMedia')}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'noMedia'}
            />

            <TouchableOpacity
              className="p-2 rounded-xl absolute bottom-2"
              style={{ backgroundColor: '#036635', width: '50%' }}
              onPress={async () => {
                setShowOptions(!showOptions);
                setTargets(await applyFunction(option, offensive, tab, current_data));
              }}
            >
              <Text className="text-white text-center">Set options</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TwitterScreen;
