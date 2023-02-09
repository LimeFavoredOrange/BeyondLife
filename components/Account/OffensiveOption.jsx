import { View } from 'react-native';
import React from 'react';
import { CheckBox } from '@rneui/themed';

const OffensiveOption = ({ offensive, setOffensive }) => {
  return (
    <View className="justify-center  w-full ">
      <CheckBox
        checked={offensive === 'noDetect'}
        onPress={() => setOffensive('noDetect')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'No detect offensive'}
      />

      <CheckBox
        checked={offensive === 'offensive'}
        onPress={() => setOffensive('offensive')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'Detect offensive'}
      />
    </View>
  );
};

export default OffensiveOption;
