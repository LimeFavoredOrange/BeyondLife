import { SafeAreaView, View, TouchableOpacity, Text, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HeirManagementScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAddHeirScreen, setShowAddHeirScreen] = useState(false); // 控制是否显示添加继承人页面
  const [heirs, setHeirs] = useState([]); // 存储已添加的继承人
  const [heirName, setHeirName] = useState('');
  const [heirEmail, setHeirEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 当前步骤
  const navigation = useNavigation();

  // 添加继承人的引导流程
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // 完成引导，添加新的继承人
      const newHeir = { name: heirName, email: heirEmail };
      setHeirs([...heirs, newHeir]);
      setShowAddHeirScreen(false);
      setCurrentStep(1);
      setHeirName('');
      setHeirEmail('');
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <View>
          <Text className="text-xl mb-4 text-center">Who’s the lucky person you’re adding to your will today?</Text>
          <TextInput
            value={heirName}
            onChangeText={setHeirName}
            placeholder="Enter their name"
            className="p-4 bg-white rounded-lg"
          />
        </View>
      );
    } else if (currentStep === 2) {
      return (
        <View>
          <Text className="text-xl mb-4 text-center">Let’s make sure we can contact them! What’s their email?</Text>
          <TextInput
            value={heirEmail}
            onChangeText={setHeirEmail}
            placeholder="Enter their email"
            className="p-4 bg-white rounded-lg"
          />
        </View>
      );
    } else if (currentStep === 3) {
      return (
        <View>
          <Text className="text-xl mb-4 text-center">What best describes {heirName}? Pick some fun attributes!</Text>
          {/* 这里可以是一些属性选择的按钮或复选框 */}
          <Text className="text-base text-center">e.g., Reliable, Caring, Funny...</Text>
          {/* Add actual attribute selections here */}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Heirs Management'} />

      {/* 添加新继承人的按钮 */}
      <View className="p-6">
        <TouchableOpacity
          className="p-4 bg-blue-600 rounded-lg flex-row items-center justify-center"
          onPress={() => setShowAddHeirScreen(true)}
        >
          <Icon name="plus" size={24} color="#fff" />
          <Text className="text-white font-bold text-center ml-2">Add New Heir</Text>
        </TouchableOpacity>
      </View>

      {/* 展示已添加的继承人列表 */}
      <View className="p-6">
        <Text className="text-lg font-semibold mb-4">Your Heirs:</Text>
        {heirs.length > 0 ? (
          <FlatList
            data={heirs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="p-4 bg-white mb-2 rounded-lg">
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.email}</Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-base text-gray-600">You haven't added any heirs yet.</Text>
        )}
      </View>

      {/* 添加继承人的滑动页面 */}
      {showAddHeirScreen && (
        <Animatable.View
          animation="slideInUp"
          duration={800}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100"
        >
          <View className="p-6 w-full h-full">
            {renderStepContent()}
            <TouchableOpacity
              className="p-4 bg-green-600 rounded-lg flex-row items-center justify-center mt-4"
              onPress={handleNextStep}
            >
              <Text className="text-white font-bold text-center">Next</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default HeirManagementScreen;
