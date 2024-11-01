import React from 'react';
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../../../components/Loading';

import { Icon } from '@rneui/base';

import AccountHeader from '../../../components/Account/AutomaticWillHeader';

// Forward the gmail screen
const GmailForward = () => {
  const [keyword, setKeyword] = React.useState('');
  const [keywordList, setKeywordList] = React.useState([]);
  const [address, setAddress] = React.useState('');
  const [addressList, setAddressList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [targetEmail, setTargetEmail] = React.useState('');
  const [showLoading, setShowLoading] = React.useState(false);

  const selectDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const navigation = useNavigation();

  // React.useEffect(() => {
  //   alert('Forward function is not available for this static demo');
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AccountHeader title={'Forward emails'} />
      <Loading showLoading={showLoading} />

      <View className=" items-center mt-6 px-2 w-full flex-1">
        <View className="w-screen px-3">
          {/* Keywords input */}
          <Text className="text-lg font-semibold ">Forward the emails that contain the following keywords:</Text>
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

        {/* Forward email based on the email address */}
        <View className="w-screen px-3">
          <Text className="text-lg font-semibold ">Forward the emails that sent from the following address:</Text>
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

        {/* Forward the email based on the date */}
        <View className="items-center justify-center mb-6 w-screen px-3">
          <Text className="text-lg font-semibold ">Forward the emails that before the following date:</Text>
          {/* <DateTimePicker value={date} mode={'date'} is24Hour={true} onChange={selectDate} /> */}
        </View>

        <View className="w-screen px-3">
          <Text className="text-lg font-semibold ">Target email:</Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={setTargetEmail}
            value={targetEmail}
            placeholder="Receiver"
            keyboardType="ascii-capable"
          />
        </View>

        <TouchableOpacity
          className="p-2 rounded-xl mb-2 mt-8 bg-blue-500"
          style={{ width: '50%' }}
          onPress={async () => {
            setShowLoading(true);
            // Send the request to the backend
            await axios.put('https://tor2023-203l.onrender.com/gmail/forward', {
              keywords: keywordList,
              senders: addressList,
              before: date,
              targetEmail: targetEmail,
            });
            setShowLoading(false);
            navigation.goBack();
          }}
        >
          <Text className="text-white text-base font-bold text-center">Forward</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GmailForward;
