import { View, Text } from 'react-native';
import { Button } from '@rneui/base';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const FolderItem = ({ item, deleteFolder }) => {
  const navigation = useNavigation();
  const date = new Date(item.createdTime).toLocaleDateString('en-AU');

  return (
    <View className="flex-row border-b">
      <View style={{ height: vh(15), width: vw(80) }} className="bg-gray-100 p-2 ">
        <Text className="mb-2">Filename: {item.name}</Text>
        <Text className="mb-2">Created at: {date}</Text>
        <Button
          color="#036635"
          buttonStyle={{ borderRadius: 15, width: '50%' }}
          onPress={() => navigation.navigate('Google Drive Folder Content', { folderId: item.id })}
        >
          <Text className="font-bold text-white">View folder</Text>
        </Button>
      </View>
      <View className="justify-center items-center bg-gray-100 ">
        <Button color="#FF2E2E" buttonStyle={{ borderRadius: 15 }} onPress={() => deleteFolder(item.id)}>
          <Text className="font-bold text-white">Delete</Text>
        </Button>
      </View>
    </View>
  );
};

export default FolderItem;
