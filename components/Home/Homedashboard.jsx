import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  selectAccountNumber,
  selectHeirNumber,
  selectNoteNumber,
  selectWillsNumber,
} from '../../redux/slices/homeSlice';
import { useSelector } from 'react-redux';

// Dashboard screen component
const Dashboard = () => {
  const navigation = useNavigation();
  const accountNumber = useSelector(selectAccountNumber);
  const heirNumber = useSelector(selectHeirNumber);
  const noteNumber = useSelector(selectNoteNumber);
  const willsNumber = useSelector(selectWillsNumber);

  const setup = [
    {
      id: 'Action number',
      title: '#Accounts',
      backgroundColor: '#036635',
      num: accountNumber,
    },
    {
      id: 'Executor number',
      title: '#Heirs',
      backgroundColor: '#045948',
      num: heirNumber,
    },
    {
      id: 'Notes number',
      title: '#Notes',
      backgroundColor: '#02735E',
      num: noteNumber,
    },
    {
      id: 'Will number',
      title: '#Wills',
      backgroundColor: '#056A47',
      num: willsNumber,
    },
  ];

  const cards = [
    {
      id: 'actions',
      title: 'Actions',
      image: 'actions.png',
    },
    {
      id: 'executors',
      title: 'Executors',
      image: 'executors.png',
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
                onPress={() => navigation.navigate('Executor')}
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
              <TouchableOpacity className="p-2 bg-gray-200 m-2">
                <View>
                  <Text className="mt-2 text-lg font-semibold">{item.title}</Text>
                  {item.id === 'actions' ? (
                    <Image
                      source={require(`../../assets/actions.png`)}
                      style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    />
                  ) : (
                    <Image
                      source={require(`../../assets/executors.png`)}
                      style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    />
                  )}
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
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
