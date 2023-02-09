import { View, Text } from 'react-native';
import { CheckBox } from '@rneui/themed';
import React from 'react';

const ContentOption = ({ tab, setTab }) => {
  return (
    <View className="justify-center  w-full ">
      <CheckBox
        checked={tab === 'Tweets&replies'}
        onPress={() => setTab('Tweets&replies')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'Tweets&replies'}
      />

      <CheckBox
        checked={tab === 'Replies'}
        onPress={() => setTab('Replies')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'Replies'}
      />
    </View>
  );
};

export default ContentOption;
