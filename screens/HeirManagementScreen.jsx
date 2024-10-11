import { SafeAreaView, View, TouchableOpacity, Text, TextInput, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../api';
import { selectToken } from '../redux/slices/auth';
import { useSelector } from 'react-redux';
import { ProgressBar } from 'react-native-paper';
import showToast from '../utils/showToast';
import { setHeirNumber, selectHeirNumber } from '../redux/slices/homeSlice';
import { useDispatch } from 'react-redux';

const HeirManagementScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAddHeirScreen, setShowAddHeirScreen] = useState(false);
  const [heirs, setHeirs] = useState([]);
  const [heirName, setHeirName] = useState('');
  const [heir, setHeir] = useState(undefined);
  const [heirEmail, setHeirEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [progressStatus, setProgressStatus] = useState(0.2);
  const [currentAnimation, setCurrentAnimation] = useState('slideInRight');
  const token = useSelector(selectToken);

  const dispatch = useDispatch();
  const heirNumber = useSelector(selectHeirNumber);

  const predefinedAttributes = ['Reliable', 'Family', 'Friend', 'Trusted', 'Work'];
  const [selectedAttributes, setSelectedAttributes] = useState([]);
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
      setSelectedAttributes([...selectedAttributes, customAttribute.trim()]);
      setCustomAttributes([...customAttributes, customAttribute.trim()]);
      setCustomAttribute('');
    }
  };

  const handleDeleteAttribute = (attribute) => {
    setCustomAttributes(customAttributes.filter((item) => item !== attribute));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentAnimation('slideInLeft');
      setCurrentStep(currentStep - 1);
      setProgressStatus(progressStatus - 0.2);
    }
  };

  const handleFirstStep = () => {
    if (!heirName) {
      showToast('Please enter heir name', 'error');
      throw new Error('Please enter heir name');
    }
    // Check the given name is not in the Heirs list
    const nameExists = heirs.find((heir) => heir.alias === heirName);
    if (nameExists) {
      showToast('Heir name already exists', 'error');
      throw new Error('Heir name already exists');
    }
  };

  const handleSecondStep = async () => {
    try {
      const response = await axiosInstance.get('auth/check', {
        params: { email: heirEmail },
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeir(response.data['message']);
    } catch (error) {
      if (error.response) {
        showToast(error.response.data.message || 'An error occurred', 'error');
      } else {
        showToast('Network error or server did not respond', 'error');
      }
      throw error;
    }
  };

  const handleThirdStep = () => {
    console.log('Selected Attributes:', selectedAttributes);
  };

  const handleAddHeir = async (name, heir, attributes) => {
    try {
      setShowLoading(true);
      const response = await axiosInstance.post(
        'heirs/add',
        {
          alias: name,
          heir: heir,
          attributes: attributes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Heir added:', response.data);
      setHeirs([...heirs, { alias: name, userId: heir, attributes: attributes }]);
    } catch (error) {
      console.error('Error adding heir:', error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleNextStep = async () => {
    console.log('Current Step:', currentStep);
    if (currentStep < 4) {
      try {
        if (currentStep === 1) {
          handleFirstStep();
        } else if (currentStep === 2) {
          await handleSecondStep();
        } else if (currentStep === 3) {
          handleThirdStep();
        }
        setCurrentAnimation('slideInRight');
        setCurrentStep(currentStep + 1);
        setProgressStatus(progressStatus + 0.2);
      } catch (error) {
        setShowLoading(false);
      }
    } else {
      // If the selected attributes are empty, show an error
      if (selectedAttributes.length === 0) {
        showToast('Please select at least one attribute', 'error');
        return;
      }
      handleAddHeir(heirName, heirEmail, selectedAttributes.join(','));

      setShowAddHeirScreen(false);
      setHeirName('');
      setHeirEmail('');
      setSelectedAttributes([]);
      setCustomAttributes([]);
      setCurrentStep(1);
      setProgressStatus(0.2);
      dispatch(setHeirNumber(heirNumber + 1));
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
      dispatch(setHeirNumber(heirNumber - 1));
    } catch (error) {
      console.error('Error deleting heir:', error);
      setShowLoading(false);
    }
  };

  const renderStepContent = () => (
    <Animatable.View animation={currentAnimation} duration={500} key={currentStep} className="w-full">
      {currentStep === 1 && (
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
      )}
      {currentStep === 2 && (
        <View>
          <Text className="text-xl mb-4 text-center">
            Let’s keep your chosen one in the loop! Please enter the email of an heir who’s already registered with
            BeyondLife.
          </Text>
          <TextInput
            value={heirEmail}
            onChangeText={setHeirEmail}
            placeholder="Heir's email"
            className="p-4 bg-white rounded-lg"
          />
        </View>
      )}

      {currentStep === 3 && (
        <View className="items-center px-4">
          <Text className="text-xl mb-4 text-center">
            Let’s paint a picture of <Text className="font-bold">{heirName}</Text>, select some fitting attributes!
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
          {/* Cannot find fitting attributes */}
          <TouchableOpacity
            onPress={() => {
              setCurrentStep((prev) => prev + 1);
              setProgressStatus((progressStatus) => progressStatus + 0.2);
            }}
            className="mt-4 p-2"
          >
            <Text className=" text-blue-600 font-semibold text-sm">Can't find fitting attributes? Add your own!</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 4 && (
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
          <Text className="text-base text-center mb-4 text-gray-600">
            Spice it up! Think about their role, where they live, or that quirky trait only they have!
          </Text>

          {customAttributes.length > 0 && (
            <FlatList
              data={customAttributes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="flex-row items-center bg-gray-200 rounded-lg p-3 mb-2">
                  <Text className="flex-1 text-gray-700 text-lg">{item}</Text>
                  <TouchableOpacity onPress={() => handleDeleteAttribute(item)}>
                    <Icon name="delete" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      )}

      {currentStep === 5 && (
        <View>
          <Text className="text-xl mb-4 text-center">All set! Your heir has been added to your list.</Text>
        </View>
      )}
    </Animatable.View>
  );

  useEffect(() => {
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

      <View className="p-6">
        <TouchableOpacity
          className="p-4 bg-blue-600 rounded-lg flex-row items-center justify-center"
          onPress={() => setShowAddHeirScreen(true)}
        >
          <Icon name="plus" size={24} color="#fff" />
          <Text className="text-white font-bold text-center ml-2">Add New Heir</Text>
        </TouchableOpacity>
      </View>

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
          animation="slideInRight"
          duration={800}
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 h-screen w-screen"
        >
          <View style={{ paddingTop: 80 }} className="p-6 w-full h-full">
            <ProgressBar className=" mb-8 " progress={progressStatus} color={'#036635'} />
            {renderStepContent()}

            <View
              style={{
                position: 'absolute',
                bottom: 35,
                left: 30,
                right: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {currentStep > 1 ? (
                <TouchableOpacity
                  onPress={handlePrevStep}
                  className="bg-gray-400 w-14 h-14 rounded-full justify-center items-center"
                >
                  <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 56 }} />
              )}

              <TouchableOpacity
                onPress={async () => await handleNextStep()}
                className="bg-green-600 w-14 h-14 rounded-full justify-center items-center"
              >
                <Icon name={currentStep === 4 ? 'check' : 'arrow-right'} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default HeirManagementScreen;
