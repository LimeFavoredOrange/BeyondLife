import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const Loading = ({ showLoading }) => {
  return (
    <View
      className="justify-center items-center h-screen w-screen bg-gray-100"
      style={{
        display: showLoading ? undefined : 'none',
        zIndex: 1000,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <ActivityIndicator size="large" color={'#4630EB'} />
    </View>
  );
};

export default Loading;
