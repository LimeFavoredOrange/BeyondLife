import React from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';
import { Button } from '@rneui/base';

const GoogleDriveScreen = () => {
  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);

  const getData = async () => {
    setShowLoading(true);
    const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/files');
    console.log(response.data.files);
    setData(response.data.files);
    setShowLoading(false);
  };

  const deleteFile = async (id) => {
    const response = await axios.delete(`https://tor2023-203l.onrender.com/googleDrive/${id}`);
    if (response.status === 200) {
      setData((current) => current.filter((item) => item.id !== id));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View className="flex-row border-b">
              <View style={{ height: 200, width: '80%' }} className="bg-gray-100 p-2 ">
                <Text className="mb-2">id: {item.id}</Text>
                <Text className="mb-2">name: {item.name}</Text>
                <Text className="mb-2">MIME Type: {item.mimeType}</Text>
              </View>
              <View className="justify-center items-center bg-gray-100 ">
                <Button color="#FF2E2E" buttonStyle={{ borderRadius: 15 }} onPress={() => deleteFile(item.id)}>
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveScreen;
