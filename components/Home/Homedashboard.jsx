import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  selectAccountNumber,
  selectHeirNumber,
  selectNoteNumber,
  selectWillsNumber,
  selectStorageNumber,
  setSelectedTab,
} from '../../redux/slices/homeSlice';
import { useSelector, useDispatch } from 'react-redux';

import storageConfiguration from '../../assets/storage.png';
import heirConfiguration from '../../assets/heir.png';

// Dashboard screen component
const Dashboard = ({ setShowStorageOptionScreen }) => {
  const navigation = useNavigation();
  const accountNumber = useSelector(selectAccountNumber);
  const heirNumber = useSelector(selectHeirNumber);
  const noteNumber = useSelector(selectNoteNumber);
  const willsNumber = useSelector(selectWillsNumber);
  const storageNumber = useSelector(selectStorageNumber);
  const dispatch = useDispatch();

  const setup = [
    {
      id: 'Action number',
      title: '#Accounts',
      backgroundColor: '#036635',
      num: accountNumber,
      linkTo: () => dispatch(setSelectedTab('Link')),
    },
    {
      id: 'Executor number',
      title: '#Heirs',
      backgroundColor: '#045948',
      num: heirNumber,
      linkTo: () => navigation.navigate('Heir Management'),
    },
    {
      id: 'Storage number',
      title: '#Storage',
      backgroundColor: '#02735E',
      num: storageNumber,
      linkTo: () => setShowStorageOptionScreen(true),
    },
    {
      id: 'Notes number',
      title: '#Passwords',
      backgroundColor: '#056A47',
      num: noteNumber,
      linkTo: () => dispatch(setSelectedTab('Key')),
    },
    {
      id: 'Will number',
      title: '#Wills',
      backgroundColor: '#028760',
      num: willsNumber,
      linkTo: () => dispatch(setSelectedTab('Document')),
    },
  ];

  const cards = [
    {
      id: 'Storage Configuration',
      title: 'Storage Configuration',
      image: storageConfiguration,
      action: () => setShowStorageOptionScreen(true),
    },
    {
      id: 'Heir Management',
      title: 'Heir Management',
      image: heirConfiguration,
      action: () => navigation.navigate('Heir Management'),
    },
  ];

  return (
    <View className="pt-8">
      <View>
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl font-bold pl-3 mr-1">Current setup</Text>
          <Icon name="wifi-protected-setup" type="materialicons" color={'#036635'} />
        </View>

        <FlatList
          data={setup}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{ backgroundColor: item.backgroundColor, width: 200, height: 120 }}
                className="relative p-5 m-2 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                onPress={() => item.linkTo()}
              >
                <View className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-30 rounded-xl"></View>
                <View className="relative z-10">
                  <Text className="text-xl  font-semibold text-white">{item.title}</Text>
                  <Text className="text-2xl font-bold text-white">{item.num}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View className="mt-3">
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl font-bold pl-3 mr-1">Functions</Text>
          <Icon name="hands-helping" type="font-awesome-5" color={'#036635'} />
        </View>
        <FlatList
          data={cards}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                className="p-2 bg-gray-200 m-2 rounded-lg"
                style={{ width: 135 }}
                onPress={() => item.action()}
              >
                <View>
                  <Text className="mt-2 text-lg font-semibold" numberOfLines={2} style={{ flexWrap: 'wrap' }}>
                    {item.title}
                  </Text>
                  <Image
                    source={item.image}
                    style={{ width: 100, height: 100, resizeMode: 'contain', alignSelf: 'left' }}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View className="mt-3 pb-16">
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl font-bold pl-3 mr-1">What's new</Text>
          <Icon name="info-with-circle" type="entypo" color={'#036635'} />
        </View>
        <View>
          <View className="justify-center items-center " style={{ height: 120, backgroundColor: '#036635' }}>
            <Text className="text-white text-2xl font-bold">Digital will System</Text>
            <Text className="text-gray-300 text-base font-semibold ">@Beyond Life</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
