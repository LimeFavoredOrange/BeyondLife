import { View, Text, FlatList, Image, SafeAreaView } from 'react-native';
import React from 'react';
import twitterRestore from '../Data/Twitter/twitterRestore';

// Screen to view backup data from backup file
const ViewBackupScreen = ({ route }) => {
  const [data, setData] = React.useState(twitterRestore.data.data);
  const [medias, setMedias] = React.useState(twitterRestore.data.includes.media);
  console.log(medias);

  // React.useEffect(() => {
  //   const { data } = route.params;
  //   const target = JSON.parse(data);
  //   setData(target.data);
  //   console.log(target.data);
  //   setMedias(target.data.includes.media);
  //   console.log(target.data.includes.media);
  // }, []);

  const getImage = (key) => {
    const media = medias.find((item) => item.media_key === key);
    return media?.url;
  };

  const removeLink = (text) => {
    const regex = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
    return text.replace(regex, '');
  };

  return (
    <SafeAreaView>
      {/* <View>
        <Text>View Backup</Text>
        <Text>`${data[0].id}`</Text>
      </View> */}
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View className="flex-row border-b">
              <View style={{ height: 200, width: '80%' }} className="bg-gray-100 p-2 ">
                <Text className="mb-2">id: {item.id}</Text>
                <Text className="mb-2">author_id: {item.author_id}</Text>
                <Text className="mb-2">created_at: {item.created_at}</Text>
                {item.attachments === undefined && <Text className="mb-2">text: {item.text}</Text>}
                {item.attachments && (
                  <>
                    <Text className="mb-2">text: {removeLink(item.text)}</Text>
                    <Image
                      className="mb-2"
                      height={300}
                      width={300}
                      source={{
                        uri: `${getImage(item.attachments.media_keys[0])}`,
                        width: 100,
                        height: 100,
                        resizeMode: 'contain',
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default ViewBackupScreen;
