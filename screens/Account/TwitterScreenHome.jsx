import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';

import { selectToken } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';

import axiosInstance from '../../api';

const TwitterScreenHome = () => {
  const [showLoading, setShowLoading] = React.useState(false);
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [alreadySetupWill, setAlreadySetupWill] = React.useState(false);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'X Settings⚙️'} />

      <View className="flex-1 justify-start items-center pt-8 px-4">
        {/* Retrieve Tweets Button */}
        <TouchableOpacity
          className="py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => navigation.navigate('TwitterList')}
          style={{ backgroundColor: '#036635' }}
        >
          <Text className="text-white text-center text-lg font-semibold tracking-wider">Retrieve Tweets</Text>
        </TouchableOpacity>

        {/* Spacing between buttons */}
        <View className="h-5" />

        {/* Configure Will Button */}
        <TouchableOpacity
          className="py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => navigation.navigate('Twitter Configure Will')}
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
