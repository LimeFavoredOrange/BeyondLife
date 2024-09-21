import { View, SafeAreaView, Text } from 'react-native';
import React from 'react';

// Screen to view account detail
const ViewAccountScreen = ({ route }) => {
  console.log(route.params);
  const { data } = route.params;

  return (
    <SafeAreaView>
      <View className="border-b p-1">
        <Text>Platform: {data?.platform}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Username: {data?.username}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Password: {data?.password}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Usefor: {data?.useFor}</Text>
      </View>
      {/* <View className="border-b p-1">
        <Text>Executor: {account?.name}</Text>
      </View> */}
      <View className="border-b p-1">
        <Text>Note: {data?.note}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewAccountScreen;
