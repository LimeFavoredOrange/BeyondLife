import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';

const GoogleDriveScreenHome = () => {
  const [showLoading, setShowLoading] = React.useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Google Drive Settings ☁️'} />

      <View className="flex-1 justify-start items-center pt-8 px-4">
        {/* Retrieve Tweets Button */}
        <TouchableOpacity
          className="py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => navigation.navigate('Google Drive List')}
          style={{ backgroundColor: '#036635' }}
        >
          <Text className="text-white text-center text-lg font-semibold tracking-wider">View Drive</Text>
        </TouchableOpacity>

        {/* Spacing between buttons */}
        <View className="h-5" />

        {/* Configure Will Button */}
        <TouchableOpacity
          className="bg-indigo-600 py-4 rounded-lg shadow-xl w-3/4"
          onPress={() => navigation.navigate('Google Drive Configure Will')}
          style={{ backgroundColor: '#028760' }}
        >
          <Text className="text-white text-center text-lg font-semibold tracking-wider">Configure Drive</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GoogleDriveScreenHome;
