import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';

import FolderItem from '../../components/GoogleDrive/FolderItem';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const GoogleDriveFolderScreen = () => {
  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);

  const getData = async () => {
    setShowLoading(true);
    const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/folders');

    setData(response.data.folders);
    setShowLoading(false);
  };

  const deleteFolder = async (id) => {
    const response = await axios.delete(`https://tor2023-203l.onrender.com/googleDrive/folders/${id}`);
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
      <AccountHeader setShowLoading={setShowLoading} title={'Google Drive Folders'} />

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return <FolderItem item={item} deleteFolder={deleteFolder} />;
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveFolderScreen;
