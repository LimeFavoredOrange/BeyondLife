import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { ButtonGroup } from '@rneui/themed';
import axios from 'axios';

const AutoSetting = ({
  showSetting,
  setShowSetting,
  selectImage,
  selectOffensive,
  setSelectImage,
  setSelectOffensive,
  imageData,
  offensiveData,
  enable,
  setEnable,
}) => {
  const updateSetting = async () => {
    await axios.put('https://tor2023-203l.onrender.com/autosetting', {
      userId: 1,
      deleteImage: selectImage === 1 ? true : false,
      deleteoffensive: selectOffensive === 1 ? true : false,
      isenable: enable === 1 ? true : false,
    });

    let target = [];
    if (selectImage === 1) {
      target = imageData;
    }

    if (selectOffensive === 1) {
      target = [...new Set(target.concat(offensiveData))];
    }

    console.log(target);
    console.log(target.toString());
    try {
      await axios.put('https://tor2023-203l.onrender.com/autodata', {
        userId: 1,
        targetData: target.toString(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSetting}
        onRequestClose={() => {
          setShowSetting(!showSetting);
        }}
      >
        <View className="flex-1 justify-center items-center ">
          <View className="bg-white  rounded-xl shadow-lg relative p-3" style={{ height: 420, width: 350 }}>
            <ScrollView>
              <View className="items-center">
                <Text className="text-base font-semibold">
                  1. Do you want to delete all the post that contains images?
                </Text>
                <ButtonGroup
                  buttons={['No', 'YES']}
                  selectedIndex={selectImage}
                  onPress={(value) => {
                    setSelectImage(value);
                  }}
                  containerStyle={{ marginBottom: 20 }}
                  selectedButtonStyle={{ backgroundColor: '#036635' }}
                />

                <Text className="text-base font-semibold">
                  2. Do you want to delete all the post that contains offensive words?
                </Text>
                <ButtonGroup
                  buttons={['No', 'Yes']}
                  selectedIndex={selectOffensive}
                  onPress={(value) => {
                    setSelectOffensive(value);
                  }}
                  containerStyle={{ marginBottom: 20 }}
                  selectedButtonStyle={{ backgroundColor: '#036635' }}
                />

                <Text className="text-base font-semibold">3. Do you want to enable the auto-delete?</Text>
                <ButtonGroup
                  buttons={['No', 'Yes']}
                  selectedIndex={enable}
                  onPress={(value) => {
                    setEnable(value);
                  }}
                  containerStyle={{ marginBottom: 20 }}
                  selectedButtonStyle={{ backgroundColor: '#036635' }}
                />

                <TouchableOpacity
                  className="mt-3 p-2 rounded-xl "
                  style={{ backgroundColor: '#036635', width: '50%' }}
                  onPress={async () => {
                    setShowSetting(!showSetting);
                    updateSetting();
                  }}
                >
                  <Text className="text-white text-base font-bold text-center">Set & close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AutoSetting;
