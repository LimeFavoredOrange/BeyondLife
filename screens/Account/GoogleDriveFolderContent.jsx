import React, { memo } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';
import FileItem from '../../components/GoogleDrive/FileItem';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const GoogleDriveFolderContent = ({ route }) => {
  const folderId = route.params.folderId;
  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);

  const getData = async () => {
    setShowLoading(true);
    const response = await axios.get(`http://localhost:8080/googleDrive/folders/${folderId}`);

    setData(response.data.files);
    setShowLoading(false);
  };

  const deleteFile = async (id) => {
    const response = await axios.delete(`http://localhost:8080/googleDrive/folders/${id}`);
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
      <AccountHeader setShowLoading={setShowLoading} title={'Folder Content'} />

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return <FileItem item={item} deleteFolder={deleteFile} />;
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveFolderContent;
