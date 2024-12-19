import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, TextInput, FlatList, ScrollView, Image } from 'react-native';

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

import { selectContractAddress, selectName } from '../../redux/slices/homeSlice';
import { set } from 'ramda';

import ProgressLoading from '../../components/ProgressLoading/ProgressLoading';

const storageOptionDescription = {
  beyondLifeServer:
    'Data will be securely stored on the BeyondLife server, which is managed and maintained by our trusted infrastructure.',
  personalCloudServer:
    'Data will be distributed across your configured personal cloud storage locations. If no configuration is provided, the data will default to being stored on the BeyondLife server.',
  xServer:
    'Data will remain intact and exclusively stored on the X server, with no alterations or backups retained on the BeyondLife server.',
  beyondLifeAndPersonalServers:
    'Data will be redundantly stored on both the BeyondLife server and your personal cloud server, providing enhanced availability and reliability.',
  beyondLifeAndXServer:
    'Data will be stored on both the BeyondLife server and the X server. This setup combines the security of BeyondLife infrastructure with the accessibility of the X platform.',
  personalAndXServers:
    'Data will be redundantly stored on both your personal cloud server and the X server, providing enhanced availability and reliability.',
  deleteAll: 'All data will be permanently deleted from our systems and associated servers. (Including the X server)',
};

const TwitterConfigureWill = () => {
  const [showLoading, setShowLoading] = useState(false);

  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [progressTaskID, setProgressTaskID] = useState('');

  const [storageOption, setStorageOption] = useState('beyondLifeServer');
  const [offensiveTweets, setOffensiveTweets] = useState('Disable');
  const [tweetsWithImages, setTweetsWithImages] = useState('Disable');
  const [deleteBeforeDate, setDeleteBeforeDate] = useState('Disable');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0.16);
  const [currentStep, setCurrentStep] = useState(1);
  const [animation, setAnimation] = useState('fadeInRight');
  const [currentPolicy, setCurrentPolicy] = useState('');

  const contractAddress = useSelector(selectContractAddress);
  const name = useSelector(selectName);

  // TODO: Remove if for now
  const [showOption, setShowOption] = useState(false);

  const navigation = useNavigation();
  const token = useSelector(selectToken);

  // For Step 2
  const [offensiveTweetsEnabled, setOffensiveTweetsEnabled] = useState(false);

  // For Step 3
  const [tweetsWithImagesEnabled, setTweetsWithImagesEnabled] = useState(false);

  // For Step 5
  const [keywords, setKeywords] = useState('');
  const [keywordsList, setKeywordsList] = useState([]);

  const [attributesList, setAttributesList] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const [attributeModalVisible, setAttributeModalVisible] = useState(false);

  const [skippedSteps, setSkippedSteps] = useState(false);

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

  useEffect(() => {
    // Send a request to see if the use has already set up a will and get the settings
    const fetchWillSettings = async () => {
      try {
        setShowLoading(true);
        const response = await axiosInstance.get('/twitter/willSettings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Will Settings:', response.data.settings);
        if (response.data.message !== 'No settings found') {
          const { settings, tweetsList } = response.data;
          setStorageOption(settings.storage_option);
          setOffensiveTweets(settings.offensive_tweets);
          setOffensiveTweetsEnabled(settings.offensive_tweets === 'Enable');

          setTweetsWithImages(settings.tweets_with_images);
          setTweetsWithImagesEnabled(settings.tweets_with_images === 'Enable');

          if (settings.delete_before_date !== 'Disable') {
            setDeleteBeforeDate(new Date(settings.delete_before_date));
            setShowDatePicker(true);
          } else {
            setDeleteBeforeDate('Disable');
          }
          setKeywordsList(JSON.parse(settings.keywords_list));
          setPolicyMatch(settings.policy_match);

          // For the dummy tweets list, change the corresponding attributes and policies
          const updatedTweetsList = dummy_tweets_list.map((tweet) => {
            // Find the matching id in the tweetsList
            const matchingTweet = tweetsList.find((dummyTweet) => dummyTweet.id === tweet.id);
            if (matchingTweet) {
              return {
                ...tweet,
                attributes: JSON.parse(matchingTweet.attributes),
                policy: matchingTweet.policy,
              };
            } else {
              return tweet;
            }
          });

          // console.log('Updated Tweets List:', updatedTweetsList);

          setTweetsList(updatedTweetsList);
        }
      } catch (error) {
        console.error('Error fetching will settings:', error);
      } finally {
        setShowLoading(false);
      }
    };

    fetchWillSettings();
  }, []);

  const [policyMatch, setPolicyMatch] = useState('subset');

  const [inputedPolicy, setInputedPolicy] = useState('');

  const dummy_tweets_list = [
    {
      id: 1,
      text: 'First tweet, welcome to Sydney',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-JI9zihxNGOqiYdiX2OuqegWCEiev0eAPAw&s'],
      attributes: [],
      policy: '',
      timestamp: '2024-11-26 06:40:57',
    },
    {
      id: 2,
      text: 'Second tweet, Call for Papers: Exploring the History of the Web, from Inception to Present @TheWebConf 2025 @TheOfficialACM',
      attributes: [],
      images: [''],
      policy: '',
      timestamp: '2024-11-28 21:40:57',
    },
    {
      id: 3,
      text: 'Third tweet, #TheWebConf24 Cheers, beers, volunteers! Thank you!',
      images: [''],
      attributes: [],
      policy: '',
      timestamp: '2024-12-05 08:40:57',
    },
    // Offensive tweet example
    {
      id: 4,
      text: 'This is for testing purpose only: what the fuck!',
      images: [''],
      attributes: [],
      policy: '',
      timestamp: '2024-12-07 09:40:57',
    },
  ];

  const [tweetsList, setTweetsList] = useState([]);

  const hideModal = () => {
    // Set the current selected attributes to the selected tweet
    const tweetIndex = tweetsList.findIndex((tweet) => tweet.id === currentTweetId);
    const updatedTweetsList = [...tweetsList];
    updatedTweetsList[tweetIndex].attributes = selectedAttributes;
    setTweetsList(updatedTweetsList);
    validatePolicyForTweet(selectedAttributes, inputedPolicy);

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

  const [currentTweetId, setCurrentTweetId] = useState(null);

  const handleAssignAttributes = (tweetId) => {
    setCurrentTweetId(tweetId);

    // Set the selected attributes for the current tweet
    const tweet = tweetsList.find((tweet) => tweet.id === tweetId);
    setSelectedAttributes(tweet.attributes);
    setAttributeModalVisible(true);
  };

  const validatePolicyForTweet = (attributeList, policy) => {
    const validAttributes = attributeList || [];

    // Check if the policy contains some attributes that are not in the list, except for 'and' and 'or'
    const invalidAttributes = policy
      .split(' ')
      .filter((word) => !['and', 'or'].includes(word) && !validAttributes.includes(word));

    console.log(invalidAttributes);
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
      // Set the policy for the current tweet
      const tweetIndex = tweetsList.findIndex((tweet) => tweet.id === currentTweetId);
      const updatedTweetsList = [...tweetsList];
      updatedTweetsList[tweetIndex].policy = policy;
      setTweetsList(updatedTweetsList);
    }
  };

  const handlePrev = () => {
    setAnimation('fadeInLeft');
    if (skippedSteps && currentStep === 7) {
      setCurrentStep(1);
      setProgressStatus(0.15);
      setSkippedSteps(false);
    } else {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
      setProgressStatus((prevProgress) => Math.max(prevProgress - 0.15, 0.15));
    }
  };

  const handleNext = async () => {
    if (currentStep === 7) {
      const tweetsListWithoutText = tweetsList.map(({ text, ...rest }) => rest);

      const requestData = {
        storageOption,
        offensiveTweets,
        tweetsWithImages,
        keywordsList,
        attributesList,
        policyMatch,
        tweetsListWithoutText,
        contractAddress,
        name,
      };

      if (showDatePicker === true) {
        requestData.deleteBeforeDate = deleteBeforeDate;
      } else {
        requestData.deleteBeforeDate = 'Disable';
      }

      console.log('Request Data:', JSON.stringify(requestData));

      try {
        setShowLoading(true);

        const response = await axiosInstance.post('/twitter/setup', requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Accept: 'application/xml',
            'Content-Type': 'application/json',
          },
          responseType: 'text',
        });
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        setShowLoading(false);
        setShowProgressLoading(true);
        setProgressTaskID(data.task_id);

        // if (response.data) {
        //   const xmlContent = response.data;

        //   const fileUri = `${FileSystem.cacheDirectory}DigitalWill.xml`;
        //   await FileSystem.writeAsStringAsync(fileUri, xmlContent, {
        //     encoding: FileSystem.EncodingType.UTF8,
        //   });

        //   if (await Sharing.isAvailableAsync()) {
        //     await Sharing.shareAsync(fileUri);
        //     showToast('✅ Your will has been successfully set and shared!', 'success');
        //   } else {
        //     showToast('⚠️ Sharing is not available on this device.', 'error');
        //   }
        // } else {
        //   showToast('⚠️ Failed to retrieve XML data from server response.', 'error');
        // }

        // navigation.navigate('Home');
      } catch (error) {
        console.error('Error setting up Twitter will:', error);
        showToast('❌ Error setting up your will. Please try again.', 'error');
      } finally {
        setShowLoading(false);
      }
    } else {
      setAnimation('fadeInRight');
      if (currentStep === 1 && storageOption === 'None (Delete All)') {
        setCurrentStep(7);
        setProgressStatus(1);
        setSkippedSteps(true);
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
        setProgressStatus((prevProgress) => Math.min(prevProgress + 0.15, 1));
      }
    }
  };

  const handleAddKeyword = () => {
    if (keywords.trim()) {
      setKeywordsList([...keywordsList, keywords.trim()]);
      setKeywords('');
    }
  };

  // Function to delete a keyword from the list
  const handleDeleteKeyword = (index) => {
    const updatedList = keywordsList.filter((_, i) => i !== index);
    setKeywordsList(updatedList);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <ProgressLoading
        showLoading={showProgressLoading}
        taskID={progressTaskID}
        setShowLoading={setShowProgressLoading}
      />
      <AccountHeader setShowLoading={setShowLoading} title={'Configure Will📝'} />
      <ProgressBar progress={progressStatus} color={'#036635'} />
      <View className="h-full">
        <Animatable.View animation={animation} duration={500} key={currentStep} style={{ flex: 1 }}>
          {/* Step 1 */}
          {currentStep === 1 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">🌍 Step 1: Pick Your Tweets' Forever Home</Text>
              <Picker selectedValue={storageOption} onValueChange={(itemValue) => setStorageOption(itemValue)}>
                <Picker.Item label="BeyondLife Server" value="beyondLifeServer" />
                <Picker.Item label="Personal Cloud Server" value="personalCloudServer" />
                <Picker.Item label="X Server" value="xServer" />
                <Picker.Item label="BeyondLife and Personal Servers" value="beyondLifeAndPersonalServers" />
                <Picker.Item label="BeyondLife and X Servers" value="beyondLifeAndXServer" />
                <Picker.Item label="Personal and X Servers" value="personalAndXServers" />
                <Picker.Item label="None (Delete All)" value="deleteAll" />
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
              <Text className="text-xl font-semibold mt-8 mx-3">
                🧹 Step 2: Time to Toss Out the Troublesome Tweets!
              </Text>
              <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
                <View className="flex-row gap-2 px-6">
                  <TouchableOpacity
                    style={{ backgroundColor: offensiveTweetsEnabled ? '#036635' : '#ccc' }}
                    onPress={() => {
                      setOffensiveTweetsEnabled(true);
                      setOffensiveTweets('Enable');
                    }}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Enable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: !offensiveTweetsEnabled ? '#036635' : '#ccc' }}
                    onPress={() => {
                      setOffensiveTweetsEnabled(false);
                      setOffensiveTweets('Disable');
                    }}
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
                    Offensive tweets refer to those that contain sensitive or inappropriate language. We will help you
                    to identify them by our AI assistant, you can choose to delete them or not.
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
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">📷 Step 3: Filter Out Those Snapshot Moments!</Text>
              <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
                <View className="flex-row gap-2 px-6">
                  <TouchableOpacity
                    style={{ backgroundColor: tweetsWithImagesEnabled ? '#036635' : '#ccc' }}
                    onPress={() => {
                      setTweetsWithImagesEnabled(true);
                      setTweetsWithImages('Enable');
                    }}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Enable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: !tweetsWithImagesEnabled ? '#036635' : '#ccc' }}
                    onPress={() => {
                      setTweetsWithImagesEnabled(false);
                      setTweetsWithImages('Disable');
                    }}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Disable</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showOption === false && (
                <View className="flex-row items-center ml-6 pr-3">
                  <Icon name="info-circle" size={20} color="#036635" />
                  <HelperText type="info" className="text-base ml-2 font-bold">
                    Snapshot moments refer to tweets that contain images. We will help you to identify them by our AI
                    assistant, you can choose to delete them or not.
                  </HelperText>
                </View>
              )}

              {showOption === true && tweetsWithImagesEnabled && (
                <Animatable.View animation="fadeInDown" duration={800} style={{ margin: 10 }}>
                  <Picker
                    selectedValue={tweetsWithImages}
                    onValueChange={(itemValue) => setTweetsWithImages(itemValue)}
                  >
                    <Picker.Item label="Will Server Only" value="Will Server Only" />
                    <Picker.Item label="Private Server Only" value="Private Server Only" />
                    <Picker.Item label="X Server Only" value="X Server Only" />
                    <Picker.Item label="Both" value="Both" />
                  </Picker>
                  <View className="flex-row items-center ml-6 pr-3">
                    <Icon name="info-circle" size={20} color="#036635" />
                    <HelperText type="info" className="text-base ml-2 font-bold">
                      Snapshot moments refer to tweets that contain images. We will help you to identify them by our AI
                      assistant, you can choose to delete them or not.
                    </HelperText>
                  </View>
                </Animatable.View>
              )}
            </View>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">
                ⏰ Step 4: Set the Clock - Say Farewell to Old Tweets!
              </Text>
              <View>
                <View
                  style={{
                    margin: 10,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                  }}
                >
                  <View className="flex-row gap-2 px-6">
                    <TouchableOpacity
                      style={{
                        backgroundColor: `${showDatePicker === true ? '#036635' : '#ccc'}`,
                      }}
                      onPress={() => {
                        setDeleteBeforeDate(new Date());
                        setShowDatePicker(true);
                      }}
                      className="flex-1 h-8 bg-gray-400 rounded-lg justify-center items-center font-bold"
                    >
                      <Text className="text-white font-bold">Enable</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: `${showDatePicker === false ? '#036635' : '#ccc'}`,
                      }}
                      onPress={() => {
                        setShowDatePicker(false);
                        setDeleteBeforeDate('Disable');
                      }}
                      className="flex-1 h-8 rounded-lg justify-center items-center"
                    >
                      <Text className="text-white font-bold">Disable</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {showDatePicker && (
                  <Animatable.View
                    animation="fadeInDown"
                    duration={800}
                    onAnimationEnd={() => !showDatePicker && setShowDatePicker(false)}
                  >
                    <View
                      style={{
                        margin: 10,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#036635',
                        borderRadius: 10,
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Text className="text-lg font-semibold ">Delete all tweets before the the date:</Text>
                      <DateTimePicker value={deleteBeforeDate} mode={'date'} is24Hour={true} onChange={onDateChange} />
                    </View>

                    <View className="flex-row items-center ml-6 pr-3">
                      <Icon name="info-circle" size={20} color="#036635" />
                      <HelperText type="info" className="text-base ml-2 font-bold">
                        This will delete all tweets before the selected date. Be careful, this action is irreversible!
                        If you are not sure about what will be deleted, please disable it and use the later options.
                      </HelperText>
                    </View>
                  </Animatable.View>
                )}
              </View>
            </View>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <View style={{ flex: 1, paddingBottom: 150 }}>
              {/* Ensure padding at the bottom */}
              <Text className="text-xl font-semibold mt-8 mx-3">🔍 Step 5: Keep It Clean - Search by Keywords</Text>
              {/* Input Field for Keywords */}
              <TextInput
                placeholder="Enter keywords, and press enter to add more"
                value={keywords}
                onChangeText={setKeywords}
                onSubmitEditing={handleAddKeyword} // Press Enter to add keyword
                className="m-3 p-2 border border-gray-300 rounded-lg"
              />
              {/* Keywords List */}
              <FlatList
                data={keywordsList}
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1, marginHorizontal: 10 }} // Ensure space for buttons
                renderItem={({ item, index }) => (
                  <Animatable.View
                    animation="fadeIn"
                    className="flex-row justify-between p-3 mb-2 bg-gray-200 rounded-lg items-center shadow"
                  >
                    <Text className="text-lg">{item}</Text>
                    <TouchableOpacity onPress={() => handleDeleteKeyword(index)}>
                      <Icon name="trash" size={20} color="#ff0000" />
                    </TouchableOpacity>
                  </Animatable.View>
                )}
              />
            </View>
          )}

          {/* Step 6 (Default Policy) */}
          {currentStep === 6 && (
            <View style={{ flex: 1, paddingBottom: 150 }}>
              <Text className="text-xl font-semibold mt-8 mx-3">
                🔒 Step 6: Perfect Match or Partial Fit? Choose Your Access Rule!
              </Text>

              <View
                style={{
                  margin: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#036635',
                  borderRadius: 10,
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Text className="text-lg font-medium">
                  Should all attributes of an object match with those of the heir, or is a subset enough?
                </Text>
                <View className="flex-row gap-2 justify-around">
                  <TouchableOpacity
                    style={{ backgroundColor: policyMatch === 'subset' ? '#036635' : '#ccc' }}
                    onPress={() => setPolicyMatch('subset')}
                    className="w-40 h-10 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Subset is enough</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: policyMatch === 'full' ? '#036635' : '#ccc' }}
                    onPress={() => setPolicyMatch('full')}
                    className="w-40 h-10 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Full match</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center mt-10 ml-6 pr-3">
                <Icon name="info-circle" size={20} color="#036635" />
                <HelperText type="info" className="text-base ml-2 font-bold">
                  Choose "Subset" if just a few attributes match, like "Family" or "Friend." For a stricter rule, pick
                  "Full Match"— all attributes must line up!
                </HelperText>
              </View>
            </View>
          )}

          {/* Step 7 (Access control for each tweet) */}
          {currentStep === 7 && (
            <View style={{ flex: 1, paddingBottom: 150 }}>
              <Text className="text-xl font-semibold mt-8 mx-3 mb-3">🎫 Step 7: Fine-Tune Who Gets Tweet Access</Text>
              <FlatList
                className="px-2"
                data={tweetsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    key={item.id}
                    style={{ marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.text}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>{item.timestamp}</Text>
                    {item.images.length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                        {item.images.map((image, index) => {
                          if (image !== '') {
                            return (
                              <Image
                                key={index}
                                source={{ uri: image }}
                                style={{ width: '90%', height: 150, borderRadius: 10, margin: 5 }}
                              />
                            );
                          }
                        })}
                      </View>
                    )}

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

                    <View className="m-3 p-2 border border-gray-300 rounded-lg">
                      <Text>Selected Attributes: {item.attributes.join(', ') || 'None selected'}</Text>
                    </View>

                    <TextInput
                      placeholder="More specific policy for this tweet, press enter to save"
                      onFocus={() => {
                        setCurrentTweetId(item.id);
                      }}
                      onChangeText={(text) => {
                        validatePolicyForTweet(item.attributes, text);
                      }}
                      style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                    />
                    {currentTweetId === item.id && policyError && <HelperText type="error">{policyError}</HelperText>}
                    {currentTweetId === item.id && policyError === null && (
                      <>
                        <Text className="text-green-700 text-sm font-semibold">Policy saved ✅</Text>
                        {/* <TouchableOpacity
                          className="inline-block"
                          onPress={() => {
                            formatPolicy();
                          }}
                        >
                          <Text className="text-blue-500 underline text-sm font-semibold">View Policy</Text>
                        </TouchableOpacity> */}
                      </>
                    )}
                  </View>
                )}
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
          <Icon name={currentStep === 7 ? 'check' : 'arrow-right'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TwitterConfigureWill;
