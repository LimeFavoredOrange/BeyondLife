import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import { vw } from 'react-native-expo-viewport-units';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/auth';
import { useNavigation } from '@react-navigation/native';

const AddAccountScreen = () => {
  const [platform, setPlatform] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [useFor, setUseFor] = React.useState('');
  const [note, setNote] = React.useState('');

  const [executors, setExecutors] = React.useState([]);

  const token = useSelector(selectToken);
  const navigation = useNavigation();

  const getExecutors = async () => {
    const response = await axios.get('https://tor2023-203l.onrender.com/executor/all', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setExecutors(response.data.data);
  };

  React.useEffect(() => {
    getExecutors();
  }, []);

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
      <Input
        containerStyle={{ width: vw(90) }}
        inputContainerStyle={{ borderBottomWidth: 1.5, borderWidth: 1.5, borderRadius: 15, padding: 5 }}
        placeholder="Platform"
        leftIcon={
          <Icon style={{ marginRight: 5 }} name="format-title" type="material-community" size={24} color={'#036635'} />
        }
        onChangeText={(text) => setPlatform(text)}
      />
      <Input
        containerStyle={{ width: vw(90) }}
        inputContainerStyle={{ borderBottomWidth: 1.5, borderWidth: 1.5, borderRadius: 15, padding: 5 }}
        placeholder="Username"
        leftIcon={<Icon style={{ marginRight: 5 }} name="idcard" type="antdesign" size={24} color={'#036635'} />}
        onChangeText={(text) => setUsername(text)}
      />
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
          console.log(useFor);
          try {
            console.log(token);
            const response = await axios.post(
              'https://tor2023-203l.onrender.com/account/create',
              {
                platform,
                username,
                password,
                useFor,
                tag,
                note,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.data.status === 'success') {
              navigation.navigate('Home');
            }
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
