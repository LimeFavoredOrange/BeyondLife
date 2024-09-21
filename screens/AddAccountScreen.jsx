import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import { vw } from 'react-native-expo-viewport-units';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useSelector, useDispatch } from 'react-redux';
import { selectToken } from '../redux/slices/auth';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api';

import { setAccounts, setAccountsDetail, selectAccountsDetail } from '../redux/slices/accounts';

function getRandomChars(strings) {
  const targetLength = strings[0].length;

  const mergedString = strings.join('');

  let randomChars = '';
  for (let i = 0; i < targetLength; i++) {
    const randomIndex = Math.floor(Math.random() * mergedString.length);
    randomChars += mergedString.charAt(randomIndex);
  }

  return randomChars;
}

const randomStrings = [
  '$2a$12$dRHMN5tjyeur/W7znk/b5ejg6JClu93AH73nTdl9AWQKofCNQbRZC',
  '$2a$12$ZTe6TzmkzpWQE23p5LdqbeK8a.KnXAmthEAQ5mfcv460Xll1TZvCS',
  '$2a$12$MIduspaVwx11Y7o1JR3GtuPk0QFM2aWD6zn0n95qFQ8CO9aDqkeuu',
];

const AddAccountScreen = () => {
  const [platform, setPlatform] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [useFor, setUseFor] = React.useState('');
  const [note, setNote] = React.useState('');

  const [executors, setExecutors] = React.useState([{ name: 'John' }, { name: 'Peter' }]);

  const token = useSelector(selectToken);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const tags = [
    { color: 'red', name: 'Work' },
    { color: 'blue', name: 'Social' },
    { color: 'green', name: 'Gaming' },
    { color: 'orange', name: 'Shopping' },
    { color: 'purple', name: 'Other' },
  ];

  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 25,
        alignItems: 'center',
      }}
    >
      {/* Platform input */}
      <Input
        containerStyle={{ width: vw(90) }}
        inputContainerStyle={{ borderBottomWidth: 1.5, borderWidth: 1.5, borderRadius: 15, padding: 5 }}
        placeholder="Platform"
        leftIcon={
          <Icon style={{ marginRight: 5 }} name="format-title" type="material-community" size={24} color={'#036635'} />
        }
        onChangeText={(text) => setPlatform(text)}
      />

      {/* Username input */}
      <Input
        containerStyle={{ width: vw(90) }}
        inputContainerStyle={{ borderBottomWidth: 1.5, borderWidth: 1.5, borderRadius: 15, padding: 5 }}
        placeholder="Username"
        leftIcon={<Icon style={{ marginRight: 5 }} name="idcard" type="antdesign" size={24} color={'#036635'} />}
        onChangeText={(text) => setUsername(text)}
      />

      {/* Password input */}
      <Input
        containerStyle={{ width: vw(90) }}
        inputContainerStyle={{ borderBottomWidth: 1.5, borderWidth: 1.5, borderRadius: 15, padding: 5 }}
        placeholder="Password"
        secureTextEntry={true}
        leftIcon={
          <Icon style={{ marginRight: 5 }} name="onepassword" type="material-community" size={24} color={'#036635'} />
        }
        onChangeText={(text) => setPassword(text)}
      />

      <View
        style={{
          width: vw(85),
          borderRadius: 15,
          borderWidth: 1.5,
          borderColor: 'gray',
          height: 100,
          marginBottom: 20,
        }}
      >
        <View
          className="flex-row justify-center items-center"
          style={{ backgroundColor: '#036635', borderTopLeftRadius: 13, borderTopRightRadius: 13, padding: 5 }}
        >
          <Text className="text-xl text-gray-100">Executors</Text>
        </View>

        {/* Executor input */}
        <SelectDropdown
          data={executors}
          onSelect={(selectedItem, index) => {
            setTag(selectedItem.name);
          }}
          defaultButtonText={'Link executor'}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <View className="flex-row justify-center items-center">
                <View className="flex-1">
                  <Text className="font-semibold">{item.name}</Text>
                </View>
              </View>
            );
          }}
          renderDropdownIcon={(isOpened) => {
            return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'black'} size={18} />;
          }}
          dropdownIconPosition={'right'}
          buttonStyle={{
            flex: 1,
            backgroundColor: '#F3F4F6',
            width: '100%',
            height: 40,
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
          }}
        />
      </View>

      <View
        style={{
          width: vw(85),
          borderRadius: 15,
          borderWidth: 1.5,
          borderColor: 'gray',
          height: 100,
          marginBottom: 20,
        }}
      >
        <View
          className="flex-row justify-center items-center"
          style={{ backgroundColor: '#036635', borderTopLeftRadius: 13, borderTopRightRadius: 13, padding: 5 }}
        >
          <Icon style={{ marginRight: 5 }} name="toolbox" type="font-awesome-5" size={24} color="#F3F4F6" />
          <Text className="text-xl text-gray-100">Use this account for</Text>
        </View>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          onChangeText={(text) => setUseFor(text)}
          value={useFor}
          style={{ padding: 8 }}
        />
      </View>

      <View
        style={{
          width: vw(85),
          borderRadius: 15,
          borderWidth: 1.5,
          borderColor: 'gray',
          height: 100,
          marginBottom: 20,
        }}
      >
        <View
          className="flex-row justify-center items-center"
          style={{ backgroundColor: '#036635', borderTopLeftRadius: 13, borderTopRightRadius: 13, padding: 5 }}
        >
          <Icon style={{ marginRight: 5 }} name="tags" type="antdesign" size={24} color="#F3F4F6" />
          <Text className="text-xl text-gray-100">Category tag</Text>
        </View>
        <SelectDropdown
          data={tags}
          onSelect={(selectedItem, index) => {
            setTag(selectedItem.name);
          }}
          defaultButtonText={'Select tag'}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <View className="flex-row justify-center items-center">
                <View className="flex-1 flex-row justify-end">
                  <View
                    style={{
                      backgroundColor: `${item.color}`,
                      height: 25,
                      width: 25,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold">{item.name}</Text>
                </View>
              </View>
            );
          }}
          renderDropdownIcon={(isOpened) => {
            return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'black'} size={18} />;
          }}
          dropdownIconPosition={'right'}
          buttonStyle={{
            flex: 1,
            backgroundColor: '#F3F4F6',
            width: '100%',
            height: 40,
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
          }}
        />
      </View>

      <View
        style={{
          width: vw(85),
          borderRadius: 15,
          borderWidth: 1.5,
          borderColor: 'gray',
          height: 100,
          marginBottom: 20,
        }}
      >
        <View
          className="flex-row justify-center items-center"
          style={{ backgroundColor: '#036635', borderTopLeftRadius: 13, borderTopRightRadius: 13, padding: 5 }}
        >
          <Icon style={{ marginRight: 5 }} name="sticky-note" type="font-awesome" size={24} color="#F3F4F6" />
          <Text className="text-xl text-gray-100">Note for executors</Text>
        </View>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          onChangeText={(text) => setNote(text)}
          value={note}
          style={{ padding: 8 }}
        />
      </View>

      <Button
        color="#036635"
        buttonStyle={{ width: 300, borderRadius: 15 }}
        onPress={async () => {
          try {
            const response = await axiosInstance.post(
              `accounts/add`,
              {
                platform,
                username,
                password,
                tag,
                useFor,
                note,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            navigation.goBack();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Text className="font-bold text-white text-xl">Submit</Text>
      </Button>
    </ScrollView>
  );
};

export default AddAccountScreen;
