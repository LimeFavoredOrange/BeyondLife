import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import React from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

// Dashboard screen component
const Dashboard = () => {
  const navigation = useNavigation();
  const setup = [
    {
      id: 'Action number',
      title: '#Actions',
      backgroundColor: '#68a386',
      num: 3,
    },
    {
      id: 'Executor number',
      title: '#Executors',
      backgroundColor: '#68a386',
      num: 2,
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
    <ScrollView className="pt-8">
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
                style={{ backgroundColor: `${item.backgroundColor}`, width: 200, height: 120 }}
                className="p-5 bg-gray-200 m-2 rounded-xl"
                onPress={() => navigation.navigate('Executor')}
              >
                <View>
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-2xl font-bold">{item.num}</Text>
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
    </ScrollView>
  );
};

export default Dashboard;
