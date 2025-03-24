import React, { useState } from 'react';
import { View, Image, SafeAreaView, TouchableOpacity, Text, TextInput, FlatList, ScrollView } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar, Modal, Portal, Button, PaperProvider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/FontAwesome';
import { HelperText } from 'react-native-paper';

import AccountHeader from '../../components/Account/AutomaticWillHeader';
import Loading from '../../components/Loading';

import { useNavigation } from '@react-navigation/native';

import showToast from '../../utils/showToast';
import axiosInstance from '../../api';
import { selectToken } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

import { formatPolicy } from '../../utils/policyFormator';
import { SearchBar } from '@rneui/themed';

import driveData from '../../Data/GoogleDrive/driveData';
import { Platform } from 'react-native';
import FileItem from '../../components/GoogleDrive/FileItem';

import EmptyImage from '../../assets/empty.png';

const storageOptionDescription = {
  'Will Server Only': 'Data will be kept on the Will server only, which is a secure server that hosting by us.',
  'Private Server Only':
    "Data will be split across your configured storage locations, if you haven't set them up, they will be stored on our server (save as above)",
  'Google Driver Only': 'Data will be kept on the Google Driver only. We are not going to keep any data on our server.',
  Both: 'Data will be kept on both servers, by default, the data will be unchanged on Google Drive and  kept on the Will server for backup',
  'None (Delete All)': 'Delete all data.',
};

const GoogleDriveConfigureWill = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [storageOption, setStorageOption] = useState('Will Server Only');
  const [offensiveTweets, setOffensiveTweets] = useState('Disable');
  const [tweetsWithImages, setTweetsWithImages] = useState('Disable');
  const [deleteBeforeDate, setDeleteBeforeDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0.15);
  const [currentStep, setCurrentStep] = useState(1);
  const [animation, setAnimation] = useState('fadeInRight');
  const [currentPolicy, setCurrentPolicy] = useState('');
  const [showOffensive, setShowOffensive] = React.useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  // TODO:
  const [showOption, setShowOption] = useState(false);

  const navigation = useNavigation();
  const token = useSelector(selectToken);

  // For Step 2
  const [offensiveTweetsEnabled, setOffensiveTweetsEnabled] = useState(false);

  // For Step 4
  const [keywords, setKeywords] = useState('');
  const [keywordsList, setKeywordsList] = useState([]);

  const [attributesList, setAttributesList] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const [attributeModalVisible, setAttributeModalVisible] = useState(false);

  const [skippedSteps, setSkippedSteps] = useState(false);

  const [data, setData] = React.useState(driveData.files);
  const [searching, setSearching] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get('auth/attributes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Attributes:', response.data.attributes);
        setAttributesList(response.data.attributes);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    }
    fetchData();
  }, []);

  const [inputedPolicy, setInputedPolicy] = useState('');

  const hideModal = () => {
    // Validate the policy
    validatePolicy(selectedAttributes, inputedPolicy);

    // Reset selected attributes
    setSelectedAttributes([]);
    setAttributeModalVisible(false);
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '50%',
    alignSelf: 'center',
  };

  const [tweetsAccessPolicies, setTweetsAccessPolicies] = useState({});
  const [policyError, setPolicyError] = useState('');

  const [currentFileID, setCurrentFileID] = useState(null);

  const handleAssignAttributes = (fileID) => {
    setCurrentFileID(fileID);
    setAttributeModalVisible(true);
  };

  const validatePolicy = (attributeList, policy) => {
    const validAttributes = attributeList || [];

    // Check if the policy contains some attributes that are not in the list, except for 'and' and 'or'
    const invalidAttributes = policy
      .split(' ')
      .filter((word) => !['and', 'or'].includes(word) && !validAttributes.includes(word));

    if (policy !== '' && invalidAttributes.length > 0) {
      setPolicyError(
        "You can only use the selected attributes. Invalid attributes: '" + invalidAttributes.join(', ') + "'"
      );
      return;
    }

    const pattern = new RegExp(`^(${validAttributes.join('|')})( (and|or) (${validAttributes.join('|')}))*$`, 'i');

    if (policy !== '' && !pattern.test(policy)) {
      setPolicyError('Invalid policy! Only use selected attributes connected with "and" or "or"');
    } else {
      setPolicyError(null);
      // Set the policy for the current selected file (specified by currentFileID)
    }
  };

  const handlePrev = () => {
    setAnimation('fadeInLeft');
    if (skippedSteps && currentStep === 5) {
      setCurrentStep(1);
      setProgressStatus(0.15);
      setSkippedSteps(false);
    } else {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
      setProgressStatus((prevProgress) => Math.max(prevProgress - 0.25, 0.15));
    }
  };

  const handleNext = async () => {
    if (currentStep === 5) {
      setShowLoading(true);
      console.log('Selected files:', selectedFiles);
      setShowLoading(false);
      showToast('Will configuration completed successfully!', 'success');
      navigation.navigate('Home');
    } else {
      setAnimation('fadeInRight');
      if (currentStep === 1 && storageOption === 'None (Delete All)') {
        setCurrentStep(5);
        setProgressStatus(1);
        setSkippedSteps(true);
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
        setProgressStatus((prevProgress) => Math.min(prevProgress + 0.25, 1));
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deleteBeforeDate;
    setDeleteBeforeDate(currentDate);
  };

  const toggleAttribute = (attribute) => {
    if (selectedAttributes.includes(attribute)) {
      setSelectedAttributes((current) => current.filter((item) => item !== attribute));
    } else {
      setSelectedAttributes((current) => [...current, attribute]);
    }
  };

  const addFile = async (id) => {
    const file = data.find((file) => file.id === id);
    setSelectedFiles((current) => [...current, file]);
  };

  const removeFile = (id) => {
    setSelectedFiles((current) => current.filter((file) => file.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Configure Will📝'} />
      <ProgressBar progress={progressStatus} color={'#036635'} />
      <View className="h-full">
        <Animatable.View animation={animation} duration={500} key={currentStep} style={{ flex: 1 }}>
          {/* Step 1 */}
          {currentStep === 1 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">🌍 Step 1: Pick Your Tweets’ Forever Home</Text>
              <Picker selectedValue={storageOption} onValueChange={(itemValue) => setStorageOption(itemValue)}>
                <Picker.Item label="Will Server Only" value="Will Server Only" />
                <Picker.Item label="Private Server Only" value="Private Server Only" />
                <Picker.Item label="Google Driver Only" value="Google Driver Only" />
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
          {/* Step 2 */}
          {currentStep === 2 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3" onPress={() => console.log(showOption)}>
                🔄 Step 2: Backup Your Data Regularly?
              </Text>
              <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
                <View className="flex-row gap-2 px-6">
                  <TouchableOpacity
                    style={{ backgroundColor: offensiveTweetsEnabled ? '#036635' : '#ccc' }}
                    onPress={() => setOffensiveTweetsEnabled(true)}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Enable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: !offensiveTweetsEnabled ? '#036635' : '#ccc' }}
                    onPress={() => setOffensiveTweetsEnabled(false)}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Disable</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showOption === false && (
                <View className="flex-row items-center ml-6 pr-3 mt-5">
                  <Icon name="info-circle" size={20} color="#036635" />
                  <HelperText type="info" className="text-base ml-2 font-bold">
                    “Set it and forget it!” Enable automatic backups to keep everything safe and sound—no surprises down
                    the line. Choose how often you want your files to back up to your selected storage.
                  </HelperText>
                </View>
              )}

              {showOption === true && offensiveTweetsEnabled && (
                <Animatable.View animation="fadeInDown" duration={800} style={{ margin: 10 }}>
                  <Picker selectedValue={offensiveTweets} onValueChange={(itemValue) => setOffensiveTweets(itemValue)}>
                    <Picker.Item label="Will Server Only" value="Will Server Only" />
                    <Picker.Item label="Private Server Only" value="Private Server Only" />
                    <Picker.Item label="X Server Only" value="X Server Only" />
                    <Picker.Item label="Both" value="Both" />
                  </Picker>
                  <View className="flex-row items-center ml-6 pr-3">
                    <Icon name="info-circle" size={20} color="#036635" />
                    <HelperText type="info" className="text-base ml-2 font-bold">
                      Offensive tweets refer to those that contain sensitive or inappropriate language. We will help you
                      to identify them by our AI assistant, you can choose to delete them or not.
                    </HelperText>
                  </View>
                </Animatable.View>
              )}
            </View>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <View style={{ height: '80%' }}>
              <Text className="text-xl font-semibold my-5 mx-3">🗂 Step 3: Pick Files for the Spotlight</Text>
              <SearchBar
                placeholder="Search keywords for files"
                platform="ios"
                onChangeText={(e) => setSearching(e)}
                value={searching}
                searchIcon={Platform.OS === 'ios' ? { name: 'search' } : null}
                clearIcon={Platform.OS === 'ios' ? { name: 'close-circle' } : null}
              />

              <TouchableOpacity
                className="w-screen flex-row items-center justify-center bg-gray-400"
                style={{ height: 40 }}
                onPress={() => navigation.navigate('Google Drive Folder')}
              >
                <Text className="text-lg font-semibold">
                  {' '}
                  <Icon name="folder" type="entypo" /> Show folders {'>>>'}
                </Text>
              </TouchableOpacity>

              <FlatList
                data={data}
                renderItem={({ item }) => {
                  return (
                    <FileItem
                      item={item}
                      showOffensive={showOffensive}
                      action={selectedFiles.includes(item) ? removeFile : addFile}
                      actionColor={`${selectedFiles.includes(item) ? '#FF2E2E' : ''}`}
                      actionText={`${selectedFiles.includes(item) ? 'Remove' : 'Add'}`}
                    />
                  );
                }}
              />
            </View>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <View style={{ height: '80%' }}>
              <Text className="text-xl font-semibold my-5 mx-3" onPress={() => console.log(data.length)}>
                🔐 Step 4: Control Who Sees What
              </Text>

              {selectedFiles.length === 0 && (
                <View className="justify-center items-center h-full">
                  <Image source={EmptyImage} style={{ width: 250, height: 250 }} />
                  <Text className="text-xl text-gray-500 font-semibold text-center mt-5">No files selected</Text>
                </View>
              )}

              <FlatList
                data={selectedFiles}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <FileItem
                        item={item}
                        showOffensive={showOffensive}
                        action={selectedFiles.includes(item) ? removeFile : addFile}
                        actionColor={selectedFiles.includes(item) ? '#FF2E2E' : ''}
                        actionText={selectedFiles.includes(item) ? 'Remove' : 'Add'}
                        showInput={true}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#036635',
                            padding: 10,
                            margin: 10,
                            borderRadius: 5,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => handleAssignAttributes(item.id)}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 8 }}>Assign Attributes</Text>
                          <Icon name="chevron-down" size={16} color="#fff" />
                        </TouchableOpacity>

                        {/* <View className="m-3 p-2 border border-gray-300 rounded-lg">
                        <Text>Selected Attributes: {item.attributes.join(', ') || 'None selected'}</Text>
                      </View> */}

                        <TextInput
                          placeholder="More specific policy for this tweet, press enter to save"
                          // onFocus={() => {
                          //   setCurrentTweetId(item.id);
                          // }}
                          // onChangeText={(text) => {
                          //   validatePolicyForTweet(item.attributes, text);
                          // }}
                          style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                        />
                      </FileItem>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id.toString()}
              />

              <Modal visible={attributeModalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <Text className="text-xl font-semibold mb-4 text-center">Select Attributes</Text>

                {/* Scrollable area for attributes */}
                <ScrollView
                  contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  {attributesList.map((attribute) => (
                    <TouchableOpacity
                      key={attribute}
                      onPress={() => toggleAttribute(attribute)}
                      className={`px-4 py-2 rounded-full m-1 ${
                        selectedAttributes.includes(attribute) ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      style={{
                        minWidth: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        className={`${selectedAttributes.includes(attribute) ? 'text-white' : 'text-gray-700'} text-sm`}
                      >
                        {attribute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Button
                  mode="contained"
                  onPress={hideModal}
                  className="mt-4 rounded-lg"
                  style={{ width: '40%', alignSelf: 'center' }}
                >
                  Done
                </Button>
              </Modal>
            </View>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <View style={{ flex: 1, paddingBottom: 150 }}>
              <Text className="text-xl font-semibold mt-8 mx-3">⏳ Step 5: Set an Expiration Date</Text>
              <View className="flex justify-center items-center mt-6">
                <DateTimePicker value={deleteBeforeDate} mode={'date'} is24Hour={true} onChange={onDateChange} />
              </View>

              <View className="flex-row items-center ml-6 pr-3 mt-5">
                <Icon name="info-circle" size={20} color="#036635" />
                <HelperText type="info" className="text-base ml-2 font-bold">
                  “Some things are timeless, others—maybe not!” Decide if and when specific files should be
                  automatically deleted, so only the essentials remain.
                </HelperText>
              </View>
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

export default GoogleDriveConfigureWill;
