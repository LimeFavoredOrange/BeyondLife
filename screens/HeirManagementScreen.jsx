import { SafeAreaView, View, TouchableOpacity, Text, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../api';
import { selectToken } from '../redux/slices/auth';
import { useSelector } from 'react-redux';

const HeirManagementScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAddHeirScreen, setShowAddHeirScreen] = useState(false);
  const [heirs, setHeirs] = useState([]);
  const [heirName, setHeirName] = useState('');
  const [heirEmail, setHeirEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();

  const token = useSelector(selectToken);

  // Predefined attributes for the heir
  const predefinedAttributes = ['Reliable', 'Family', 'Friend', 'Trusted', 'Work'];
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  // Customized attributes for the heir
  const [customAttribute, setCustomAttribute] = useState('');
  const [customAttributes, setCustomAttributes] = useState([]);

  const toggleAttribute = (attribute) => {
    if (selectedAttributes.includes(attribute)) {
      setSelectedAttributes(selectedAttributes.filter((item) => item !== attribute));
    } else {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  const handleAddAttribute = () => {
    if (customAttribute.trim()) {
      setCustomAttributes([...customAttributes, customAttribute.trim()]);
      setCustomAttribute('');
    }
  };

  const handleDeleteAttribute = (attribute) => {
    setCustomAttributes(customAttributes.filter((item) => item !== attribute));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowAddHeirScreen(false);
      setHeirs([
        ...heirs,
        { name: heirName, email: heirEmail, attributes: [...selectedAttributes, ...customAttributes] },
      ]);
      setHeirName('');
      setHeirEmail('');
      setSelectedAttributes([]);
      setCustomAttributes([]);
      setCurrentStep(1);
    }
  };

  const handleDeleteHeir = async (heir) => {
    try {
      setShowLoading(true);
      const response = await axiosInstance.delete(`heirs/delete/${heir}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Heir deleted:', response.data);
      setHeirs(heirs.filter((item) => item.userId !== heir));
      setShowLoading(false);
    } catch (error) {
      console.error('Error deleting heir:', error);
      setShowLoading(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <View>
          <Text className="text-xl mb-4 text-center">
            Who’s the special person you trust to inherit your digital world?
          </Text>
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
          <Text className="text-xl mb-4 text-center">
            Let’s keep your chosen one in the loop! Please enter the email of an heir who’s already registered with
            BeyondLife
          </Text>
          <TextInput
            value={heirEmail}
            onChangeText={setHeirEmail}
            placeholder="Heir's email"
            className="p-4 bg-white rounded-lg"
          />
        </View>
      );
    } else if (currentStep === 3) {
      return (
        <View className="items-center px-4">
          <Text className="text-xl mb-4 text-center">
            Let’s paint a picture of {heirName}—select some fitting attributes!
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-4">e.g., Reliable, Family, Friend...</Text>

          <View className="flex-row flex-wrap justify-center">
            {predefinedAttributes.map((attribute) => (
              <TouchableOpacity
                key={attribute}
                className={`px-4 py-2 rounded-full m-2 ${
                  selectedAttributes.includes(attribute) ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onPress={() => toggleAttribute(attribute)}
              >
                <Text className={`${selectedAttributes.includes(attribute) ? 'text-white' : 'text-gray-700'} text-sm`}>
                  {attribute}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (currentStep === 4) {
      return (
        <View className="px-4">
          <Text className="text-xl mb-4 text-center">Add some unique attributes for your heir!</Text>

          <View className="flex-row items-center mb-4">
            <TextInput
              value={customAttribute}
              onChangeText={setCustomAttribute}
              placeholder="Enter custom attribute"
              className="flex-1 p-3 bg-white rounded-lg border border-gray-300"
            />
            <TouchableOpacity
              onPress={handleAddAttribute}
              className="ml-2 p-3 bg-green-500 rounded-lg justify-center items-center"
            >
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {customAttributes.length > 0 && (
            <FlatList
              data={customAttributes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="flex-row items-center bg-gray-200 rounded-lg p-3 mb-2">
                  <Text className="flex-1 text-gray-700 text-lg">{item}</Text>
                  <TouchableOpacity onPress={() => handleDeleteAttribute(item)}>
                    <Icon name="delete" size={24} color="#ff0000" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      );
    } else if (currentStep === 5) {
      return (
        <View>
          <Text className="text-xl mb-4 text-center">All set! Your heir has been added to your list.</Text>
        </View>
      );
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setShowLoading(true);
        const response = await axiosInstance.get('heirs/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Heirs:', response.data);
        setHeirs(response.data);
        setShowLoading(false);
      } catch (error) {
        console.error('Error fetching heirs:', error);
        setShowLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Heirs Management'} />

      {/* The button to add a new user */}
      <View className="p-6">
        <TouchableOpacity
          className="p-4 bg-blue-600 rounded-lg flex-row items-center justify-center"
          onPress={() => setShowAddHeirScreen(true)}
        >
          <Icon name="plus" size={24} color="#fff" />
          <Text className="text-white font-bold text-center ml-2">Add New Heir</Text>
        </TouchableOpacity>
      </View>

      {/* A list to show all the heirs */}
      <View className="p-6">
        <Text className="text-lg font-semibold mb-4">Your Heirs:</Text>
        {heirs.length > 0 ? (
          <FlatList
            data={heirs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="p-4 bg-white mb-2 rounded-lg flex-row justify-between items-center">
                <View>
                  <Text className="text-lg">{item.alias}</Text>
                  <Text className="text-sm text-gray-600">{item.attributes}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteHeir(item.userId)}>
                  <Icon name="delete" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text className="text-base text-gray-600">You haven't added any heirs yet.</Text>
        )}
      </View>

      {showAddHeirScreen && (
        <Animatable.View
          animation="slideInUp"
          duration={800}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 h-screen w-screen"
        >
          <View style={{ paddingTop: 80 }} className="p-6 w-full h-full">
            {renderStepContent()}
            {currentStep > 1 && (
              <TouchableOpacity
                className="p-4 bg-gray-400 rounded-lg flex-row items-center justify-center mt-4"
                onPress={handlePrevStep}
              >
                <Text className="text-white font-bold text-center">Prev</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="p-4 bg-green-600 rounded-lg flex-row items-center justify-center mt-2"
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
