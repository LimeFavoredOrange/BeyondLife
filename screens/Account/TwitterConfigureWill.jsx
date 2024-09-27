import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import Date Picker
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icon
import { HelperText } from 'react-native-paper';

import AccountHeader from '../../components/Account/AutomaticWillHeader';
import Loading from '../../components/Loading';

import TwitterSetting from './TwitterSetting';

const storageOptionDescription = {
  'Will Server Only': 'Data will be kept on Will server only, which is a secure server that hosting by us.',
  'X Server Only': 'Data will be kept on X server only. We are not going to keep any data on our server.',
  Both: 'Data will be kept on both servers.',
  'None (Delete All)': 'Delete all data.',
};

const TwitterConfigureWill = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [storageOption, setStorageOption] = useState('Will Server Only');
  const [offensiveTweets, setOffensiveTweets] = useState('Will Server Only'); // For step 2
  const [tweetsWithImages, setTweetsWithImages] = useState('Will Server Only'); // For step 3
  const [deleteKeywords, setDeleteKeywords] = useState(false); // For step 4
  const [deleteBeforeDate, setDeleteBeforeDate] = useState(new Date()); // For new step - Delete before date
  const [showDatePicker, setShowDatePicker] = useState(false); // Show/Hide DatePicker

  const [progressStatus, setProgressStatus] = useState(0.16); // Progress for 6 steps
  const [currentStep, setCurrentStep] = useState(1);
  const [keywords, setKeywords] = useState(''); // For step 5
  const [skippedSteps, setSkippedSteps] = useState(false); // New flag to track if we skipped steps

  const handlePrev = () => {
    // Check if we jumped to step 6 by selecting "None (Delete All)" and go back to step 1 directly
    if (skippedSteps && currentStep === 6) {
      setCurrentStep(1);
      setProgressStatus(0.16); // Reset progress to step 1
      setSkippedSteps(false); // Reset the skipped flag
    } else {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
      setProgressStatus((prevProgress) => Math.max(prevProgress - 0.16, 0.16)); // Adjusted for 6 steps
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && storageOption === 'None (Delete All)') {
      setCurrentStep(6); // Directly jump to final confirmation step
      setProgressStatus(1); // Full progress when skipping steps
      setSkippedSteps(true); // Set skipped flag to true
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
      setProgressStatus((prevProgress) => Math.min(prevProgress + 0.16, 1)); // Normal increment
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deleteBeforeDate;
    setShowDatePicker(false);
    setDeleteBeforeDate(currentDate); // Update selected date
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Configure Will📝'} />
      <ProgressBar progress={progressStatus} color={'#036635'} />
      <View className="h-full">
        {currentStep === 1 && (
          <View>
            <Text className="text-xl font-semibold mt-8 mx-3">Step 1: Where should data be kept?</Text>
            <Picker
              selectedValue={storageOption}
              onValueChange={(itemValue) => setStorageOption(itemValue)} // Save storage option, but do not jump immediately
            >
              <Picker.Item label="Will Server Only" value="Will Server Only" />
              <Picker.Item label="X Server Only" value="X Server Only" />
              <Picker.Item label="Both" value="Both" />
              <Picker.Item label="None (Delete All)" value="None (Delete All)" />
            </Picker>
            <View className="flex-row items-center ml-6 pr-3">
              <Icon name="info-circle" size={20} color="#036635" />
              <HelperText type="info" className="text-base ml-2 font-bold">
                {storageOptionDescription[storageOption]}
              </HelperText>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text className="text-xl font-semibold mt-8 mx-3">Step 2: Do you want to delete offensive tweets?</Text>
            <Picker
              selectedValue={offensiveTweets}
              onValueChange={(itemValue) => setOffensiveTweets(itemValue)} // Save offensive tweets option
            >
              <Picker.Item label="Will Server Only" value="Will Server Only" />
              <Picker.Item label="X Server Only" value="X Server Only" />
              <Picker.Item label="Both" value="Both" />
            </Picker>
            <View className="flex-row items-center ml-6 pr-3">
              <Icon name="info-circle" size={20} color="#036635" />
              <HelperText type="info" className="text-base ml-2 font-bold">
                Offensive tweets are tweets that contain sensitive content. We will help you to identify them by our AI
                assistant.
              </HelperText>
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text className="text-xl font-semibold mt-8 mx-3">
              Step 3: Do you want to delete tweets that contain images?
            </Text>
            <Picker
              selectedValue={tweetsWithImages}
              onValueChange={(itemValue) => setTweetsWithImages(itemValue)} // Save tweets with images option
            >
              <Picker.Item label="Will Server Only" value="Will Server Only" />
              <Picker.Item label="X Server Only" value="X Server Only" />
              <Picker.Item label="Both" value="Both" />
            </Picker>
          </View>
        )}

        {currentStep === 4 && (
          <View>
            <Text className="text-xl font-semibold mt-8 mx-3">Step 4: Delete tweets before a certain date?</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Select Date"
                value={deleteBeforeDate.toDateString()} // Display the selected date
                editable={false}
                style={{
                  margin: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={deleteBeforeDate} mode="date" display="default" onChange={onDateChange} />
            )}
          </View>
        )}

        {currentStep === 5 && (
          <View>
            <Text className="text-xl font-semibold mt-8 mx-3">Step 5: Do you want to delete tweets by keywords?</Text>
            <TextInput
              placeholder="Enter keywords"
              value={keywords}
              onChangeText={setKeywords}
              style={{
                margin: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
              }}
            />
          </View>
        )}

        {currentStep === 6 && (
          <View className=" h-3/4 ">
            <Text className="text-xl font-semibold mt-8 mx-3 mb-3">Step 6: Final Confirmation</Text>
            <Divider />
            <TwitterSetting />
          </View>
        )}
      </View>

      {/* Circular Buttons with Updated Colors */}
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
        {/* Conditionally render Prev Button or a Placeholder */}
        {currentStep !== 1 ? (
          <TouchableOpacity
            onPress={handlePrev}
            style={{
              borderColor: '#7e7e7e', // Gray color for the outline
              borderWidth: 2,
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="arrow-left" size={24} color="#7e7e7e" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        {/* Next Button - Solid Dark Green */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: '#036635',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TwitterConfigureWill;
