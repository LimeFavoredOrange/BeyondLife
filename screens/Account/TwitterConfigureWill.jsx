import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, TextInput, FlatList, Modal, ScrollView } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar, Divider } from 'react-native-paper';
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

const storageOptionDescription = {
  'Will Server Only': 'Data will be kept on Will server only, which is a secure server that hosting by us.',
  'X Server Only': 'Data will be kept on X server only. We are not going to keep any data on our server.',
  Both: 'Data will be kept on both servers.',
  'None (Delete All)': 'Delete all data.',
};

const TwitterConfigureWill = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [storageOption, setStorageOption] = useState('Will Server Only');
  const [offensiveTweets, setOffensiveTweets] = useState('Will Server Only');
  const [tweetsWithImages, setTweetsWithImages] = useState('Will Server Only');
  const [deleteBeforeDate, setDeleteBeforeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0.16);
  const [currentStep, setCurrentStep] = useState(1);
  const [animation, setAnimation] = useState('fadeInRight');

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
  const [selectedAttributes, setSelectedAttributes] = useState({});

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

  // For Step 8 (Default policy)
  const [policyMatch, setPolicyMatch] = useState('subset');

  const [skippedSteps, setSkippedSteps] = useState(false);

  // For Step 9
  const [tweetsList, setTweetsList] = useState([
    { id: 1, text: 'First tweet' },
    { id: 2, text: 'Second tweet' },
    { id: 3, text: 'Third tweet' },
  ]);

  const [tweetsAccessPolicies, setTweetsAccessPolicies] = useState({});
  const [policyError, setPolicyError] = useState('');

  const [currentTweetId, setCurrentTweetId] = useState(null);

  const handleAssignAttributes = (tweetId) => {
    setCurrentTweetId(tweetId);
    setAttributeModalVisible(true);
  };

  const validatePolicyForTweet = (tweetId, policy) => {
    const validAttributes = selectedAttributes[tweetId] || [];
    const pattern = new RegExp(`^(${validAttributes.join('|')})( (and|or) (${validAttributes.join('|')}))*$`, 'i');
    if (!pattern.test(policy)) {
      setPolicyError('Invalid policy! Only use selected attributes connected with "and" or "or".');
    } else {
      setPolicyError('');
      setTweetsAccessPolicies({
        ...tweetsAccessPolicies,
        [tweetId]: policy,
      });
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

  const handleNext = () => {
    if (currentStep === 7) {
      // Submit data
      console.log('Submit data:', {
        storageOption,
        offensiveTweets,
        tweetsWithImages,
        deleteBeforeDate,
        keywordsList,
        attributesList,
        heirsList,
        policyMatch,
        tweetsAccessPolicies,
      });
      // Navigate back to Home screen
      navigation.navigate('Home');
      showToast('✅ Your will has been successfully set on X!', 'success');
      return;
    }

    setAnimation('fadeInRight');
    if (currentStep === 1 && storageOption === 'None (Delete All)') {
      setCurrentStep(7);
      setProgressStatus(1);
      setSkippedSteps(true);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
      setProgressStatus((prevProgress) => Math.min(prevProgress + 0.15, 1));
    }
  };

  // Function to add keyword to list and clear input
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

              {offensiveTweetsEnabled && (
                <Animatable.View animation="fadeInDown" duration={800} style={{ margin: 10 }}>
                  <Picker selectedValue={offensiveTweets} onValueChange={(itemValue) => setOffensiveTweets(itemValue)}>
                    <Picker.Item label="Will Server Only" value="Will Server Only" />
                    <Picker.Item label="X Server Only" value="X Server Only" />
                    <Picker.Item label="Both" value="Both" />
                  </Picker>
                  <View className="flex-row items-center ml-6 pr-3">
                    <Icon name="info-circle" size={20} color="#036635" />
                    <HelperText type="info" className="text-base ml-2 font-bold">
                      Offensive tweets refer to those that contain sensitive or inappropriate language. We will help you
                      to identify them by our AI assistant.
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
                    onPress={() => setTweetsWithImagesEnabled(true)}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Enable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: !tweetsWithImagesEnabled ? '#036635' : '#ccc' }}
                    onPress={() => setTweetsWithImagesEnabled(false)}
                    className="flex-1 h-8 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold">Disable</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {tweetsWithImagesEnabled && (
                <Animatable.View animation="fadeInDown" duration={800} style={{ margin: 10 }}>
                  <Picker
                    selectedValue={tweetsWithImages}
                    onValueChange={(itemValue) => setTweetsWithImages(itemValue)}
                  >
                    <Picker.Item label="Will Server Only" value="Will Server Only" />
                    <Picker.Item label="X Server Only" value="X Server Only" />
                    <Picker.Item label="Both" value="Both" />
                  </Picker>
                </Animatable.View>
              )}
            </View>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <View>
              <Text className="text-xl font-semibold mt-8 mx-3">
                ⏰ Step 4: Set the Clock – Say Farewell to Old Tweets!
              </Text>
              <View>
                <View
                  onPress={() => setShowDatePicker(true)}
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
                      onPress={() => setShowDatePicker(true)}
                      className="flex-1 h-8 bg-gray-400 rounded-lg justify-center items-center font-bold"
                    >
                      <Text className="text-white font-bold">Enable</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: `${showDatePicker === false ? '#036635' : '#ccc'}`,
                      }}
                      onPress={() => setShowDatePicker(false)}
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
                  </Animatable.View>
                )}
              </View>
            </View>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <View style={{ flex: 1, paddingBottom: 150 }}>
              {/* Ensure padding at the bottom */}
              <Text className="text-xl font-semibold mt-8 mx-3">🔍 Step 5: Keep It Clean – Search by Keywords</Text>
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
              <Text className="m-3 font-semibold">
                Should all attributes of an object match with those of the heir, or is a subset enough?
              </Text>
              <View className="flex-row justify-around mx-3">
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

              <Text className="font-semibold mt-5 text-gray-700 ml-3 ">
                Choose "Subset" if just a few attributes match, like "Family" or "Friend." For a stricter rule, pick
                "Full Match"— all attributes must line up!
              </Text>
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

                    {/* "Assign Attributes" 按钮 */}
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
                      <Text>Selected Attributes: {selectedAttributes[item.id]?.join(', ') || 'None selected'}</Text>
                    </View>

                    {/* 访问策略输入框 */}
                    <TextInput
                      placeholder="Enter access policy (e.g., 'Attribute1 and Attribute2')"
                      value={tweetsAccessPolicies[item.id] || ''}
                      onChangeText={(text) => validatePolicyForTweet(item.id, text)}
                      style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                    />

                    {/* 策略错误显示 */}
                    {policyError && <HelperText type="error">{policyError}</HelperText>}
                  </View>
                )}
              />
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
