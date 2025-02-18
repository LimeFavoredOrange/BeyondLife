import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';

import { selectToken } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';

import axiosInstance from '../../api';

import { setSelectedTab } from '../../redux/slices/homeSlice';
import { useDispatch } from 'react-redux';

const TwitterScreenHome = () => {
  const [showLoading, setShowLoading] = React.useState(false);
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [alreadySetupWill, setAlreadySetupWill] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Check does the current user already setup a will or not
    const checkWill = async () => {
      try {
        const response = await axiosInstance.get('/twitter/willSettings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check does the response contains message key
        if (response.data.message) {
          setAlreadySetupWill(false);
        } else {
          setAlreadySetupWill(true);
        }
      } catch (error) {
        console.error('Error checking will settings:', error);
      }
    };
    checkWill();
  }, []);

  const removeExistingWill = async () => {
    try {
      const response = await axiosInstance.post(
        '/twitter/removeWill',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlreadySetupWill(false);
    } catch (error) {
      console.error('Error checking will settings:', error);
    }
  };

  const handleNavigateTOTwitterList = async () => {
    // Check does the current user already link to the twitter account or not
    // If not, navigate to the Home screen and set the selected tab to Link
    const response = await axiosInstance.get('link/status', { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.twitter === 'None') {
      dispatch(setSelectedTab('Link'));
      navigation.navigate('Home');
    } else {
      navigation.navigate('TwitterList');
    }
  };

  const handleSetupWillPreCheck = async () => {
    // Check does the current user already link to the twitter account or not
    // If not, navigate to the Home screen and set the selected tab to Link
    let response = await axiosInstance.get('link/status', { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.twitter === 'None') {
      dispatch(setSelectedTab('Link'));
      navigation.navigate('Home');
      return;
    }

    // Check does the current user already setup the storage location or not
    // If not, navigate to the Home screen with pamameter showStorageOptionScreen=true
    response = await axiosInstance.get('upload/setup_status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // 检查有没有至少 2 个true
    if (Object.values(response.data).filter((val) => val === true).length < 2) {
      dispatch(setSelectedTab('Home'));
      navigation.navigate('Home', { showStorageOptionScreen: true });
      return;
    }

    // Check if all the value in the returned object is false, then not setup yet
    if (Object.values(response.data).every((val) => val === false)) {
      dispatch(setSelectedTab('Home'));
      navigation.navigate('Home', { showStorageOptionScreen: true });
      return;
    }

    // Check does the current user already setup heirs or not
    // If not, navigate to the Heir Management screen
    response = await axiosInstance.get('heirs/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.length === 0) {
      navigation.navigate('Heir Management');
      return;
    }

    // Check does the current user already setup the will trigger condition or not
    // If not, navigate to the Will Trigger Setting screen
    response = await axiosInstance.get('auth/willtrigger', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.threshold === 0) {
      navigation.navigate('Will Trigger Setting');
      return;
    }
    navigation.navigate('Twitter Configure Will');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'X Settings⚙️'} />

      <View className="flex-1 justify-start items-center pt-8 px-4">
        {/* Retrieve Tweets Button */}
        <TouchableOpacity
          className="py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => handleNavigateTOTwitterList()}
          style={{ backgroundColor: '#036635' }}
        >
          <Text className="text-white text-center text-lg font-semibold tracking-wider">Retrieve Tweets</Text>
        </TouchableOpacity>

        {/* Spacing between buttons */}
        <View className="h-5" />

        {/* Configure Will Button */}
        <TouchableOpacity
          className="py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => handleSetupWillPreCheck()}
          style={{ backgroundColor: '#028760' }}
        >
          <Text className="text-white text-center text-lg font-semibold tracking-wider">Configure Will</Text>
        </TouchableOpacity>

        {/* Spacing between buttons */}
        <View className="h-5" />

        {/* Remove Configured Will Button */}
        {alreadySetupWill && (
          <TouchableOpacity
            className="py-4 rounded-lg shadow-xl w-3/4"
            onPress={async () => await removeExistingWill()}
            style={{ backgroundColor: '#D14343' }}
          >
            <Text className="text-white text-center text-lg font-semibold tracking-wider">Remove Configured Will</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TwitterScreenHome;
