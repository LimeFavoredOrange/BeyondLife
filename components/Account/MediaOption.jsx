import { View, Text } from 'react-native';
import React from 'react';
import { CheckBox } from '@rneui/themed';

const MediaOption = ({ option, setOption }) => {
  return (
    <View className="border-b-2">
      <View className="flex-row justify-center">
        <CheckBox
          checked={option === 'Default'}
          onPress={() => setOption('Default')}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          title={'Default'}
        />

        <CheckBox
          checked={option === 'containMedia'}
          onPress={() => setOption('containMedia')}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          title={'Contain media'}
        />
      </View>
      <CheckBox
        checked={option === 'noMedia'}
        onPress={() => setOption('noMedia')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'noMedia'}
      />
    </View>
  );
};

export default MediaOption;
