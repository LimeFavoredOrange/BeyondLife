import { View, Text, Image, Linking } from 'react-native';
import { Button, Badge } from '@rneui/base';
import React, { memo } from 'react';

// Component to display file element in the flatlist.
const FileItem = ({ item, action, showOffensive, actionText, actionColor, children }) => {
  const isOffensive = item.offensive;
  const date = new Date(item.createdTime).toLocaleDateString('en-AU');

  return (
    <View className="border-b pb-5 px-3">
      <View className="flex-row">
        <View style={{ height: 200, width: '80%' }} className="bg-gray-100 p-2 ">
          <Image
            source={{ uri: `${item.iconLink}`, width: 30, height: 30 }}
            style={{ resizeMode: 'contain', marginBottom: 5 }}
          />
          <Text className="mb-2">Filename: {item.name}</Text>
          <Text className="mb-2">MIME Type: {item.mimeType}</Text>
          <Text className="mb-2">Created at: {date}</Text>
          {showOffensive && isOffensive && (
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
          <Button color={actionColor} buttonStyle={{ borderRadius: 15 }} onPress={() => action(item.id)}>
            <Text className="font-bold text-white">{actionText}</Text>
          </Button>
        </View>
      </View>

      {children}
    </View>
  );
};

export default memo(FileItem);
