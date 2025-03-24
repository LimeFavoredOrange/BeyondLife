import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

import MediaOption from './MediaOption';
import OffensiveOption from './OffensiveOption';

// Filter popup component
const Filter = ({ applyFunction, setTargets, showOptions, setShowOptions, tab, setTab, current_data }) => {
  const [option, setOption] = React.useState('Default');
  const [offensive, setOffensive] = React.useState('noDetect');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showOptions}
      onRequestClose={() => {
        setShowOptions(!showOptions);
      }}
    >
      <View className="flex-1 justify-center items-center mt-6">
        <View className="bg-white w-fit rounded-xl shadow-lg items-center relative" style={{ height: 350 }}>
          <MediaOption option={option} setOption={setOption} />
          <OffensiveOption offensive={offensive} setOffensive={setOffensive} />

          <TouchableOpacity
            className="p-2 rounded-xl absolute bottom-2"
            style={{ backgroundColor: '#036635', width: '50%' }}
            onPress={async () => {
              setShowOptions(!showOptions);
              const temp = applyFunction(option, offensive, tab, current_data);
              setTargets(temp);
            }}
          >
            <Text className="text-white text-base font-bold text-center">Set & close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Filter;
