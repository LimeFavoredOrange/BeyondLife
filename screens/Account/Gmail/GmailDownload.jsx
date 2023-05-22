import React from 'react';
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../../../components/Loading';

import { Icon } from '@rneui/base';

import AccountHeader from '../../../components/Account/AutomaticWillHeader';

// Download gmail backup
const GmailDownload = () => {
  const [keyword, setKeyword] = React.useState('');
  const [keywordList, setKeywordList] = React.useState([]);
  const [address, setAddress] = React.useState('');
  const [addressList, setAddressList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [showLoading, setShowLoading] = React.useState(false);

  const selectDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const navigation = useNavigation();

  React.useEffect(() => {
    alert('Download function is not available for this static demo');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AccountHeader title={'Download emails'} />
      <Loading showLoading={showLoading} />

      <View className="justify-center items-center mt-6 px-2 w-full">
        <View className="w-screen px-3">
          {/* Keywords input */}
          <Text className="text-lg font-semibold ">Download the emails that contain the following keywords:</Text>
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
        <View style={{ height: 50 }}>
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

        <View className="w-screen px-3">
          {/* Download email backup based on the email address */}
          <Text className="text-lg font-semibold ">Download the emails that sent from the following address:</Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={setKeyword}
            onEndEditing={() => {
              setAddressList([...addressList, address]);
              setAddress('');
            }}
            value={keyword}
            placeholder="Address"
            keyboardType="ascii-capable"
          />
        </View>
        <View style={{ height: 50 }}>
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

        <View className="p-3 items-center justify-center mb-6 w-screen px-3">
          {/* Download email backup based on the sending date */}
          <Text className="text-lg font-semibold ">Download the emails that before the following date:</Text>
          <DateTimePicker value={date} mode={'date'} is24Hour={true} onChange={selectDate} />
        </View>

        <TouchableOpacity
          className="p-2 rounded-xl mb-2"
          style={{ backgroundColor: '#1c7549', width: '50%' }}
          onPress={async () => {
            setShowLoading(true);
            const dateParam = date.toString().replace(/ /g, '_');
            // Download backup
            const downloadedFile = await FileSystem.downloadAsync(
              `https://tor2023-203l.onrender.com/gmail/download?keywords=${keywordList}&senders=${addressList}&before=${dateParam}`,
              FileSystem.documentDirectory + `emails-${Date.now()}.txt`
            );
            setShowLoading(false);
            const imageFileExts = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];
            const isIos = Platform.OS === 'ios';

            // Save the backup file in local storage.
            if (isIos && imageFileExts.every((x) => !downloadedFile.uri.endsWith(x))) {
              const UTI = 'gmail.item';
              await Sharing.shareAsync(downloadedFile.uri, { UTI });
            }

            navigation.goBack();
          }}
        >
          <Text className="text-white text-base font-bold text-center">Download</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GmailDownload;
