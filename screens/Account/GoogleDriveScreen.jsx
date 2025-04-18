import React from 'react';
import { Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { Icon } from '@rneui/base';
import FileItem from '../../components/GoogleDrive/FileItem';
import Setting from '../../components/GoogleDrive/Setting';
import Date1 from '../../components/GoogleDrive/Date';
import driveData from '../../Data/GoogleDrive/driveData';
import { SearchBar } from '@rneui/themed';
import { Platform } from 'react-native';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const GoogleDriveScreen = () => {
  const mlURL = 'https://18c7-2001-8003-3c4d-f200-2d1a-40cb-8ade-c996.au.ngrok.io';

  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [searching, setSearching] = React.useState('');

  const [showSetting, setShowSetting] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [showOffensive, setShowOffensive] = React.useState(false);

  // Function to search file in Google Drive
  const applySearch = async (keyword) => {
    // alert('Search, keyword delete and date range delete functions are not available for this static demo');
    // if (keyword === '') {
    //   getData();
    // }
    // setShowLoading(true);
    // const response = await axios.get(`https://tor2023-203l.onrender.com/googleDrive/files/search`, {
    //   params: { keyword },
    // });
    // setData(response.data.files);
    // setShowLoading(false);
  };

  // Function to detect offensive content in google drive files
  // const detectOffensive = async () => {
  //   const fileIds = [];
  //   const currentData = data;
  //   setShowLoading(true);
  //   const pervious = await axios.get('https://tor2023-203l.onrender.com/googleDrive/getToxicity');
  //   const perviousData = pervious.data.timestamp;
  //   const perviousFileIds = pervious.data.fileIds.split(',');

  //   const checkFiles = currentData.filter((item) => {
  //     item.modifiedTime > perviousData;
  //   });

  //   if (checkFiles.length === 0) {
  //     for (const item in currentData) {
  //       if (perviousFileIds.includes(currentData[item].id)) {
  //         currentData[item].offensive = true;
  //       }
  //     }
  //     setData(currentData);
  //     setShowLoading(false);
  //     return;
  //   }

  //   for (const item in currentData) {
  //     if (
  //       currentData[item].mimeType == 'application/vnd.google-apps.document' &&
  //       checkFiles.includes(currentData[item])
  //     ) {
  //       const response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/getContent/Doc', {
  //         params: { fileId: currentData[item].id },
  //       });
  //       let result = null;
  //       try {
  //         result = await checkOffensive(response.data.content);
  //       } catch (error) {
  //         console.log('here');
  //       }
  //       if (result === 'Toxicity: True') {
  //         currentData[item].offensive = true;
  //         fileIds.push(currentData[item].id);
  //       } else {
  //         currentData[item].offensive = false;
  //       }
  //     } else if (currentData[item].mimeType == 'text/plain' && checkFiles.includes(currentData[item])) {
  //       console.log(currentData[item].name);
  //       let response = undefined;
  //       try {
  //         response = await axios.get('https://tor2023-203l.onrender.com/googleDrive/getContent/plain', {
  //           params: { fileId: currentData[item].id },
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }

  //       try {
  //         const result = await checkOffensive(response.data.content);
  //         if (result === 'Toxicity: True') {
  //           currentData[item].offensive = true;
  //           fileIds.push(currentData[item].id);
  //         } else {
  //           currentData[item].offensive = false;
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   }

  //   const target = [...new Set([...perviousFileIds, ...fileIds])];

  //   const response = await axios.post('https://tor2023-203l.onrender.com/googleDrive/detectToxicity', {
  //     fileIds: target,
  //   });
  //   console.log(response.data);
  //   setData(currentData);
  //   setShowLoading(false);
  // };

  // const checkOffensive = async (text) => {
  //   try {
  //     const response = await axios.post(`${mlURL}/detectToxicity`, { text: text });
  //     if (response.status === 200) {
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // React.useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     applySearch(searching);
  //   }, 300);
  //   return () => clearTimeout(delayDebounceFn);
  // }, [searching]);

  React.useEffect(() => {
    getData();
  }, []);

  // Function to get data from Google Drive
  const getData = async () => {
    setShowLoading(true);
    setData(driveData.files);
    setShowLoading(false);
  };

  // Function to delete file from Google Drive
  const deleteFile = async (id) => {
    // const response = await axios.delete(`https://tor2023-203l.onrender.com/googleDrive/${id}`);
    // if (response.status === 200) {
    //   setData((current) => current.filter((item) => item.id !== id));
    // }
    setData((current) => current.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Google Drive'}
        icon={[
          { name: 'options', type: 'ionicon' },
          { name: 'date', type: 'fontisto' },
          { name: 'refresh-auto', type: 'material-community' },
          // { name: 'clouddownload', type: 'antdesign' },
        ]}
        iconFunction={[
          () => {
            setShowSetting(true);
          },
          () => {
            setShowDate(true);
          },
          () => {
            // detectOffensive();
            setShowLoading(true);
            setShowOffensive(true);
            setShowLoading(false);
          },
          // async () => {
          //   const downloadedFile = await FileSystem.downloadAsync(
          //     'https://tor2023-203l.onrender.com/twitter/backup',
          //     FileSystem.documentDirectory + 'tweetsData.txt'
          //   );
          //   const imageFileExts = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];
          //   const isIos = Platform.OS === 'ios';

          //   if (isIos && imageFileExts.every((x) => !downloadedFile.uri.endsWith(x))) {
          //     const UTI = 'twitter.item';
          //     await Sharing.shareAsync(downloadedFile.uri, { UTI });
          //   }
          // },
        ]}
      />

      <SearchBar
        placeholder="Search tweets......"
        platform="ios"
        onChangeText={(e) => setSearching(e)}
        value={searching}
        searchIcon={Platform.OS === 'ios' ? { name: 'search' } : null}
        clearIcon={Platform.OS === 'ios' ? { name: 'close-circle' } : null}
      />

      <TouchableOpacity
        className="w-screen flex-row items-center justify-center bg-gray-400"
        style={{ height: 40 }}
        onPress={() => navigation.navigate('Google Drive Folder')}
      >
        <Text className="text-lg font-semibold">
          {' '}
          <Icon name="folder" type="entypo" /> Show folders {'>>>'}
        </Text>
      </TouchableOpacity>

      <Setting showSetting={showSetting} setShowSetting={setShowSetting} setShowLoading={setShowLoading} />
      <Date1 showDate={showDate} setShowDate={setShowDate} setShowLoading={setShowLoading} />

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <FileItem
              actionColor="#FF2E2E"
              item={item}
              action={deleteFile}
              showOffensive={showOffensive}
              actionText="Delete"
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveScreen;
