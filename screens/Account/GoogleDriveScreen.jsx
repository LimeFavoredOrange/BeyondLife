import React, { memo } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Linking } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';
import { SearchBar } from '@rneui/base';
import FileItem from '../../components/GoogleDrive/FileItem';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const GoogleDriveScreen = () => {
  const mlURL = 'https://5331-110-150-115-26.au.ngrok.io';

  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [searching, setSearching] = React.useState('');

  const [showOptions, setShowOptions] = React.useState(false);
  const [showSetting, setShowSetting] = React.useState(false);

  const applySearch = async (keyword) => {
    if (keyword === '') {
      getData();
    }
    setShowLoading(true);
    const response = await axios.get(`https://tor2023-203l.onrender.com/googleDrive/files/search`, {
      params: { keyword },
    });
    setData(response.data.files);
    setShowLoading(false);
  };

  const detectOffensive = async () => {
    const currentData = data;
    setShowLoading(true);
    for (const item in currentData) {
      if (currentData[item].mimeType == 'application/vnd.google-apps.document') {
        const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/getContent/Doc', {
          params: { fileId: currentData[item].id },
        });
        const result = await checkOffensive(response.data.content);
        if (result === 'Toxicity: True') {
          currentData[item].offensive = true;
        } else {
          currentData[item].offensive = false;
        }
      } else if (currentData[item].mimeType == 'text/plain') {
        const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/getContent/plain', {
          params: { fileId: currentData[item].id },
        });
        const result = await checkOffensive(response.data.content);
        if (result === 'Toxicity: True') {
          currentData[item].offensive = true;
        } else {
          currentData[item].offensive = false;
        }
      }
    }
    setData(currentData);
    setShowLoading(false);
  };

  const checkOffensive = async (text) => {
    try {
      const response = await axios.get(`${mlURL}/detectToxicity`, { params: { text } });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      applySearch(searching);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searching]);

  const getData = async () => {
    setShowLoading(true);
    const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/files');
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
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Google Drive'}
        icon={[
          { name: 'options', type: 'ionicon' },
          { name: 'refresh-auto', type: 'material-community' },
          { name: 'clouddownload', type: 'antdesign' },
        ]}
        iconFunction={[
          () => {
            setShowOptions(true);
          },
          () => {
            detectOffensive();
          },
          async () => {
            const downloadedFile = await FileSystem.downloadAsync(
              'https://tor2023-203l.onrender.com/twitter/backup',
              FileSystem.documentDirectory + 'tweetsData.txt'
            );
            const imageFileExts = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];
            const isIos = Platform.OS === 'ios';

            if (isIos && imageFileExts.every((x) => !downloadedFile.uri.endsWith(x))) {
              const UTI = 'twitter.item';
              await Sharing.shareAsync(downloadedFile.uri, { UTI });
            }
          },
        ]}
      />

      <SearchBar placeholder="Search content" platform="ios" onChangeText={(e) => setSearching(e)} value={searching} />

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return <FileItem item={item} deleteFile={deleteFile} />;
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveScreen;
