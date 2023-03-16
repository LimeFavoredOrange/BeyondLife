import { View, Text, Image, Linking } from 'react-native';
import { Button, Badge } from '@rneui/base';
import React, { memo } from 'react';

const FileItem = ({ item, deleteFile }) => {
  const isOffensive = item.offensive;
  const date = new Date(item.createdTime).toLocaleDateString('en-AU');
  return (
    <View className="flex-row border-b">
      <View style={{ height: 200, width: '80%' }} className="bg-gray-100 p-2 ">
        <Image
          source={{ uri: `${item.iconLink}`, width: 30, height: 30 }}
          style={{ resizeMode: 'contain', marginBottom: 5 }}
        />
        <Text className="mb-2">Filename: {item.name}</Text>
        <Text className="mb-2">MIME Type: {item.mimeType}</Text>
        <Text className="mb-2">Created at: {date}</Text>
        {isOffensive && (
          <Text>
            <Badge className="mb-2" value="contain offensive word(s)" status="primary" />
          </Text>
        )}
        <Button
          color="#036635"
          buttonStyle={{ borderRadius: 15, width: '50%' }}
          onPress={() => Linking.openURL(item.webViewLink)}
        >
          <Text className="font-bold text-white">View & Download</Text>
        </Button>
      </View>
      <View className="justify-center items-center bg-gray-100 ">
        <Button color="#FF2E2E" buttonStyle={{ borderRadius: 15 }} onPress={() => deleteFile(item.id)}>
          <Text className="font-bold text-white">Delete</Text>
        </Button>
      </View>
    </View>
  );
};

export default memo(FileItem);
