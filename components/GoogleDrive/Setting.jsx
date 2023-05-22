import { View, Text, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { Icon } from '@rneui/base';
import axios from 'axios';
import React from 'react';

const Setting = ({ showSetting, setShowSetting, setShowLoading }) => {
  const [keyword, setKeyword] = React.useState('');
  const [keywordList, setKeywordList] = React.useState([]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSetting}
      onRequestClose={() => {
        setShowSetting(!showSetting);
      }}
    >
      <View className="flex-1 justify-center items-center mt-6">
        <View className="bg-white rounded-xl shadow-lg items-center " style={{ height: vh(70), width: vw(80) }}>
          <View className="p-3">
            <Text className="text-lg font-semibold ">Delete the file that contains the following keywords:</Text>
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
              setShowLoading(true);
              // const response = await axios.put('https://tor2023-203l.onrender.com/googleDrive/files/delete', {
              //   keywords: keywordList,
              // });
              setShowLoading(false);
              setShowSetting(!showSetting);
            }}
          >
            <Text className="text-white text-base font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Setting;
