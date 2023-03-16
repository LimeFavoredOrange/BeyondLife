import React from 'react';
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '@rneui/base';

import AccountHeader from '../../components/Account/AutomaticWillHeader';

const GmailScreen = () => {
  const [keyword, setKeyword] = React.useState('');
  const [keywordList, setKeywordList] = React.useState([]);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AccountHeader
        title={'Gmail'}
        icon={[
          { name: 'options', type: 'ionicon' },
          { name: 'clouddownload', type: 'antdesign' },
        ]}
        iconFunction={[
          () => {
            setShowSetting(true);
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
      <View className="flex-1 justify-center items-center mt-6">
        <View className="p-3">
          <Text className="text-lg font-semibold ">Delete the emails that contain the following keywords:</Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={setKeyword}
            onEndEditing={() => {
              setKeywordList([...keywordList, keyword]);
              setKeyword('');
            }}
            value={keyword}
            placeholder="Keyword"
            keyboardType="ascii-capable"
          />
        </View>

        <View className="flex-1">
          <FlatList
            data={keywordList}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center p-2 gap-2">
                <View>
                  <Text className="text-base font-semibold">
                    {index + 1}.{item}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setKeywordList(keywordList.filter((_, i) => i !== index));
                  }}
                >
                  <Icon size={18} type="ionicon" name="ios-remove-circle-sharp" color={'#FF2E2E'} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          className="p-2 rounded-xl mb-2"
          style={{ backgroundColor: '#FF2E2E', width: '50%' }}
          onPress={async () => {
            const response = await axios.put('http://localhost:8080/gmail/delete', {
              keywords: keywordList,
            });
            navigation.goBack();
          }}
        >
          <Text className="text-white text-base font-bold text-center">Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GmailScreen;
