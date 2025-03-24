import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';

// Component to pick the date
const Date1 = ({ showDate, setShowDate, setShowLoading }) => {
  const [date, setDate] = React.useState(new Date());

  const selectDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDate}
      onRequestClose={() => {
        setShowDate(!showDate);
      }}
    >
      <View className="flex-1 justify-center items-center mt-6">
        <View className="bg-white rounded-xl shadow-lg items-center p-2" style={{ height: vh(30), width: vw(80) }}>
          <View className="p-3">
            <Text className="text-lg font-semibold ">Delete the file that before the following date:</Text>
          </View>

          <DateTimePicker value={date} mode={'date'} is24Hour={true} onChange={selectDate} />

          <View className="flex-1"></View>
          <TouchableOpacity
            className="p-2 rounded-xl mb-2"
            style={{ backgroundColor: '#FF2E2E', width: '50%' }}
            onPress={async () => {
              setShowLoading(true);
              setShowLoading(false);
              setShowDate(!showDate);
            }}
          >
            <Text className="text-white text-base font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Date1;
