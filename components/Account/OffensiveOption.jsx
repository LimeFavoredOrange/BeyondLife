import { View } from 'react-native';
import React from 'react';
import { CheckBox } from '@rneui/themed';

// Checkbox option to detect offensive content.
const OffensiveOption = ({ offensive, setOffensive }) => {
  return (
    <View className="justify-center  w-full ">
      {/* Option: disable detection */}
      <CheckBox
        checked={offensive === 'noDetect'}
        onPress={() => setOffensive('noDetect')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'No offensive'}
      />

      {/* Option: Enable detection */}
      <CheckBox
        checked={offensive === 'offensive'}
        onPress={() => setOffensive('offensive')}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        title={'Contain offensive'}
      />
    </View>
  );
};

export default OffensiveOption;
