import { View, SafeAreaView, Text } from 'react-native';
import React from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';

const ExecutorScreen = () => {
  return (
    <SafeAreaView>
      <AccountHeader
        title={'Executors'}
        isTab={true}
        tabIcon={{ name: 'plus', type: 'entypo' }}
        tabIconFunction={() => navigation.navigate('Add Account')}
      />
    </SafeAreaView>
  );
};

export default ExecutorScreen;
