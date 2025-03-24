import { View, Text, FlatList, Image, TextInput, StyleSheet } from 'react-native';

import React from 'react';
import { Badge } from '@rneui/themed';

import { userData } from '../../Data/Twitter/twitterData';
import { useNavigation } from '@react-navigation/native';

const TwitterSetting = () => {
  const [tweets, setTweets] = React.useState(userData.tweets.data);
  const [targets, setTargets] = React.useState(userData.tweets.data);

  const [medias, setMedias] = React.useState([]);

  const navigation = useNavigation();

  const [accessPolicy, setAccessPolicy] = React.useState(['', '', '']);

  const removeLink = (text) => {
    const regex = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
    return text.replace(regex, '');
  };

  const getImage = (key) => {
    const media = medias.find((item) => item.media_key === key);
    return media?.url;
  };

  return (
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

export default TwitterSetting;
