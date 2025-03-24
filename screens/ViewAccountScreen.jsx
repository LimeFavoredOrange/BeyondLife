import { View, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/base';

const ViewAccountScreen = ({ route }) => {
  const { data } = route.params;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4">
        {/* Platform input */}
        <View className="bg-white rounded-xl shadow-md p-4 mt-6 border-l-4 border-[#036635]">
          <Text className="text-lg font-bold text-[#036635]">Platform</Text>
          <Text className="text-base text-gray-900">{data?.platform}</Text>
        </View>

        {/* Username input */}
        <View className="bg-white rounded-xl shadow-md p-4 mt-4 border-l-4 border-[#036635]">
          <Text className="text-lg font-bold text-[#036635]">Username</Text>
          <Text className="text-base text-gray-900">{data?.username}</Text>
        </View>

        {/* Password input */}
        <View className="bg-white rounded-xl shadow-md p-4 mt-4 flex-row justify-between items-center border-l-4 border-[#036635]">
          <View>
            <Text className="text-lg font-bold text-[#036635]">Password</Text>
            <Text className="text-base text-gray-900">{showPassword ? data?.password : '••••••••'}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} type="feather" size={22} color="#036635" />
          </TouchableOpacity>
        </View>

        {/* Use for input */}
        <View className="bg-white rounded-xl shadow-md p-4 mt-4 border-l-4 border-[#036635]">
          <Text className="text-lg font-bold text-[#036635]">Use For</Text>
          <Text className="text-base text-gray-900">{data?.useFor}</Text>
        </View>

        {/* Give a note */}
        <View className="bg-white rounded-xl shadow-md p-4 mt-4 mb-10 border-l-4 border-[#036635]">
          <Text className="text-lg font-bold text-[#036635]">Note</Text>
          <Text className="text-base text-gray-900">{data?.note}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAccountScreen;
