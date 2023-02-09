import { View, Text, FlatList, Image, SafeAreaView } from 'react-native';
import React from 'react';

const ViewBackupScreen = ({ route }) => {
  const [data, setData] = React.useState([]);
  const [medias, setMedias] = React.useState([]);
  console.log(data);

  React.useEffect(() => {
    const { data } = route.params;
    setData(data.data);
    setMedias(data.includes.media);
  }, []);

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
                      source={{ uri: `${getImage(item.attachments.media_keys[0])}`, width: 100, height: 100 }}
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
