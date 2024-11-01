import React, { memo } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';
import FileItem from '../../components/GoogleDrive/FileItem';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const folderContent = {
  '17zrNAkTPqHtFbGbhTwhks9TLBfJYkq6h': {
    files: [
      {
        mimeType: 'text/plain',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
        webViewLink: 'https://drive.google.com/file/d/1vpUNbBE7PlVLCAImCOkbGke6TWcJS9VP/view?usp=drivesdk',
        webContentLink: 'https://drive.google.com/uc?id=1vpUNbBE7PlVLCAImCOkbGke6TWcJS9VP&export=download',
        id: '1vpUNbBE7PlVLCAImCOkbGke6TWcJS9VP',
        name: 'text2.txt',
        createdTime: 1684746429440,
      },
      {
        mimeType: 'text/plain',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
        webViewLink: 'https://drive.google.com/file/d/109YhGdWHdfCNNaw6rcp9cwADIlh59_BK/view?usp=drivesdk',
        webContentLink: 'https://drive.google.com/uc?id=109YhGdWHdfCNNaw6rcp9cwADIlh59_BK&export=download',
        id: '109YhGdWHdfCNNaw6rcp9cwADIlh59_BK',
        name: 'badword2.txt',
        createdTime: 1684746428552,
      },
    ],
  },
  '1fgx5QC8h-GZDZ-u9xD0GuU3xhwLfDDbk': {
    files: [
      {
        mimeType: 'text/plain',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
        webViewLink: 'https://drive.google.com/file/d/1oGOPjrjF5FKJMLO0s_aoMouPWAhUg72-/view?usp=drivesdk',
        webContentLink: 'https://drive.google.com/uc?id=1oGOPjrjF5FKJMLO0s_aoMouPWAhUg72-&export=download',
        id: '1oGOPjrjF5FKJMLO0s_aoMouPWAhUg72-',
        name: 'text1.txt',
        createdTime: 1684746452601,
      },
      {
        mimeType: 'text/plain',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
        webViewLink: 'https://drive.google.com/file/d/1aaNbIJfsRo724LRjQLugsxFxndQjgMtO/view?usp=drivesdk',
        webContentLink: 'https://drive.google.com/uc?id=1aaNbIJfsRo724LRjQLugsxFxndQjgMtO&export=download',
        id: '1aaNbIJfsRo724LRjQLugsxFxndQjgMtO',
        name: 'badword1.txt',
        createdTime: 1684746451761,
      },
    ],
  },
};

const GoogleDriveFolderContent = ({ route }) => {
  const folderId = route.params.folderId;
  const [data, setData] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);

  // Function to get the folder content in Google Drive.
  const getData = async () => {
    setShowLoading(true);
    // const response = await axios.get(`https://tor2023-203l.onrender.com/googleDrive/folders/${folderId}`);
    // setData(response.data.files);
    setData(folderContent[folderId].files);
    setShowLoading(false);
  };

  // Function to delete specific file in the folder
  const deleteFile = async (id) => {
    // const response = await axios.delete(`https://tor2023-203l.onrender.com/googleDrive/folders/${id}`);
    // if (response.status === 200) {
    //   setData((current) => current.filter((item) => item.id !== id));
    // }
    setData((current) => current.filter((item) => item.id !== id));
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
          return <FileItem actionColor="#FF2E2E" item={item} action={deleteFile} actionText="Delete" />;
        }}
      />
    </SafeAreaView>
  );
};

export default GoogleDriveFolderContent;
