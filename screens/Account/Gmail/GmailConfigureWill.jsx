import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, ScrollView, Image, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar, HelperText, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

import AccountHeader from '../../../components/Account/AutomaticWillHeader';
import Loading from '../../../components/Loading';
import { useNavigation } from '@react-navigation/native';
import showToast from '../../../utils/showToast';

const mockEmails = [
  { id: 1, subject: 'Work Updates', date: '2024-01-01' },
  { id: 2, subject: 'Family Gathering', date: '2024-02-15' },
  { id: 3, subject: 'Project Proposal', date: '2024-03-10' },
  { id: 4, subject: 'Newsletter: Weekly Highlights', date: '2024-04-20' },
  { id: 5, subject: 'Meeting Follow-up', date: '2024-05-05' },
];

const GmailConfigureWill = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [storageOption, setStorageOption] = useState('Will Server Only');
  const [forwardEmails, setForwardEmails] = useState(false);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [deleteBeforeDate, setDeleteBeforeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0.15);
  const [currentStep, setCurrentStep] = useState(1);
  const [animation, setAnimation] = useState('fadeInRight');
  const [selectedEmails, setSelectedEmails] = useState([]);

  const navigation = useNavigation();

  const handleNext = () => {
    if (currentStep === 5) {
      setShowLoading(true);
      console.log('Selected emails:', selectedEmails);
      setShowLoading(false);
      showToast('Gmail configuration completed successfully!', 'success');
      navigation.navigate('Home');
    } else {
      setAnimation('fadeInRight');
      setCurrentStep((prev) => prev + 1);
      setProgressStatus((prev) => Math.min(prev + 0.25, 1));
    }
  };

  const handlePrev = () => {
    setAnimation('fadeInLeft');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setProgressStatus((prev) => Math.max(prev - 0.25, 0.15));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deleteBeforeDate;
    setDeleteBeforeDate(currentDate);
  };

  const handleEmailSelection = (email) => {
    setSelectedEmails((current) =>
      current.includes(email) ? current.filter((item) => item !== email) : [...current, email]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Configure Gmail Will📝'} />
      <ProgressBar progress={progressStatus} color={'#036635'} />
      <View className="h-full">
        <Animatable.View animation={animation} duration={500} key={currentStep} style={{ flex: 1 }}>
          {/* Step 1: Choose Storage Option */}
          {currentStep === 1 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">🌍 Step 1: Choose Your Storage Option</Text>
              <Picker selectedValue={storageOption} onValueChange={(itemValue) => setStorageOption(itemValue)}>
                <Picker.Item label="Will Server Only" value="Will Server Only" />
                <Picker.Item label="Private Server Only" value="Private Server Only" />
                <Picker.Item label="Gmail Server Only" value="Gmail Server Only" />
                <Picker.Item label="Both" value="Both" />
                <Picker.Item label="None (Delete All)" value="None (Delete All)" />
              </Picker>
              <HelperText type="info" className="text-base ml-2 font-bold">
                Choose where you want your Gmail data to be stored after setting up your digital will.
              </HelperText>
            </View>
          )}

          {/* Step 2: Enable Forwarding */}
          {currentStep === 2 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">📧 Step 2: Forward Emails to Another Address</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: forwardEmails ? '#036635' : '#ccc',
                  padding: 10,
                  borderRadius: 10,
                  marginHorizontal: 15,
                  marginTop: 10,
                }}
                onPress={() => setForwardEmails(!forwardEmails)}
              >
                <Text className="text-white text-center font-bold">
                  {forwardEmails ? 'Forwarding Enabled' : 'Enable Forwarding'}
                </Text>
              </TouchableOpacity>
              <HelperText type="info" className="text-base ml-2 font-bold">
                Forward your important emails to a chosen address to ensure they reach the right people.
              </HelperText>
            </View>
          )}

          {/* Step 3: Enable Regular Backup */}
          {currentStep === 3 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">🔄 Step 3: Enable Regular Backup?</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: backupEnabled ? '#036635' : '#ccc',
                  padding: 10,
                  borderRadius: 10,
                  marginHorizontal: 15,
                  marginTop: 10,
                }}
                onPress={() => setBackupEnabled(!backupEnabled)}
              >
                <Text className="text-white text-center font-bold">
                  {backupEnabled ? 'Backup Enabled' : 'Enable Backup'}
                </Text>
              </TouchableOpacity>
              <HelperText type="info" className="text-base ml-2 font-bold">
                Keep your emails backed up to prevent any accidental data loss.
              </HelperText>
            </View>
          )}

          {/* Step 4: Select Important Emails */}
          {currentStep === 4 && (
            <View style={{ height: '80%' }}>
              <Text className="text-xl font-semibold my-5 mx-3">🗂 Step 4: Select Important Emails</Text>
              <FlatList
                data={mockEmails}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 15,
                      backgroundColor: selectedEmails.includes(item) ? '#cce7d0' : '#f4f4f4',
                      marginVertical: 5,
                      marginHorizontal: 15,
                      borderRadius: 8,
                    }}
                    onPress={() => handleEmailSelection(item)}
                  >
                    <Text className="text-lg">{item.subject}</Text>
                    <Text className="text-sm text-gray-600">{item.date}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                  <View className="justify-center items-center">
                    <Image source={EmptyImage} style={{ width: 200, height: 200 }} />
                    <Text className="text-gray-500">No emails found.</Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Step 5: Set Expiration Date */}
          {currentStep === 5 && (
            <View style={{ paddingBottom: 150 }}>
              <Text className="text-xl font-semibold mt-8 mx-3">⏳ Step 5: Set Expiration Date</Text>
              <DateTimePicker value={deleteBeforeDate} mode={'date'} is24Hour={true} onChange={onDateChange} />
              <HelperText type="info" className="text-base ml-2 font-bold">
                Set a date to automatically delete older emails and keep only the essentials.
              </HelperText>
            </View>
          )}
        </Animatable.View>
      </View>

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
        {currentStep !== 1 ? (
          <TouchableOpacity
            onPress={handlePrev}
            className="border border-gray-400 w-14 h-14 rounded-full justify-center items-center"
          >
            <Icon name="arrow-left" size={24} color="#7e7e7e" />
          </TouchableOpacity>
        ) : (
          <View className="w-14" />
        )}

        <TouchableOpacity
          onPress={handleNext}
          className="bg-green-700 w-14 h-14 rounded-full justify-center items-center"
        >
          <Icon name={currentStep === 5 ? 'check' : 'arrow-right'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GmailConfigureWill;
