import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import storageConfiguration from '../../assets/storage.png';
import heirConfiguration from '../../assets/heir.png';
import willTriggerSetting from '../../assets/willTriggerSetting.png';
import willActivation from '../../assets/willActivation.png';
import accessWillData from '../../assets/accessWillData.png';

const OnboardingModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to BeyondLife',
      description: 'Manage your digital legacy and ensure your important data is passed on securely.',
      image: accessWillData, // Image for the welcome step
    },
    {
      title: '1. Set Up Data Storage',
      description:
        'Choose a data storage method and link your personal platform accounts, such as Google Drive, GitHub, or Twitter.',
      image: storageConfiguration,
    },
    {
      title: '2. Add Heir Information',
      description: 'Set up your heirs to ensure they can access your data when needed.',
      image: heirConfiguration,
    },
    {
      title: '3. Configure Will Triggers',
      description:
        'BeyondLife offers multiple triggers, including time-based activation, biometric verification, or third-party confirmation.',
      image: willTriggerSetting,
    },
    {
      title: '4. Configure Your Digital Will',
      description: 'Define your digital will, including data distribution, automated tasks, and authorized heirs.',
      image: willActivation,
    },
  ];

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeen = await SecureStore.getItemAsync('hasSeenOnboarding');
      if (hasSeen === 'true') {
        onClose(); // Close modal if onboarding has already been completed
      }
    };
    checkOnboardingStatus();
  }, []);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true'); // Mark onboarding as completed
      onClose();
      setStep(0); // Reset step to 0
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="w-11/12 p-6 bg-white rounded-2xl shadow-lg">
          {/* Step Image */}
          <Image source={steps[step].image} className="w-full h-40 mb-4" resizeMode="contain" />

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</Text>
          <Text className="text-gray-700">{steps[step].description}</Text>

          {/* Progress Indicator */}
          <View className="flex-row justify-center mt-4">
            {steps.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${index === step ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </View>

          {/* Button Section */}
          <View className="flex-row justify-between mt-6">
            {/* Back Button (Hidden on the welcome step) */}
            {step > 0 ? (
              <TouchableOpacity onPress={() => setStep(step - 1)} className="p-2">
                <Text className="text-gray-500 text-lg">Back</Text>
              </TouchableOpacity>
            ) : (
              <View className="p-2" /> // Placeholder for alignment
            )}

            {/* Next / Finish Button (Bottom Right) */}
            <TouchableOpacity onPress={handleNext} className="p-2">
              <Text className="text-blue-500 text-lg font-semibold">
                {step === steps.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OnboardingModal;
