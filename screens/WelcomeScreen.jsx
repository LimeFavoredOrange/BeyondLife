import { Text, View, Image, StatusBar } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View className="w-screen h-screen items-center" style={{ backgroundColor: '#1c7549' }}>
      <Animatable.View animation="zoomIn" style={{ height: '66%' }} className=" justify-center items-center">
        <Image source={require('../assets/welcome.png')} style={{ width: 280, height: 280 }} resizeMode="contain" />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUpBig"
        delay={200}
        style={{ flex: 1 }}
        className="w-screen bg-white rounded-3xl"
      >
        <Text className="text-2xl mt-2 font-bold text-center">Digital will.app</Text>
        <View className="flex-1 justify-center items-center">
          <View className="gap-2">
            <Button
              color="#036635"
              buttonStyle={{ width: 300, borderRadius: 15 }}
              onPress={() => navigation.navigate('Home')}
            >
              <Text className="font-bold text-white text-xl">Login</Text>
            </Button>
            <Button color="#4630EB" buttonStyle={{ width: 300, borderRadius: 15 }}>
              <Text className="font-bold text-white text-xl">Register today</Text>
            </Button>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
};

export default WelcomeScreen;
