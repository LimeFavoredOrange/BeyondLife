import { SafeAreaView, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import React from 'react';
import AccountHeader from '../../../components/Account/AutomaticWillHeader';

import { useNavigation } from '@react-navigation/native';

const GmailNav = () => {
  // Options for Gmail
  const options = [
    { id: 1, title: 'Delete emails', linkTo: 'GmailDelete' },
    { id: 2, title: 'Forward emails', linkTo: 'GmailForward' },
    { id: 3, title: 'Download emails', linkTo: 'GmailDownload' },
  ];

  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AccountHeader title={'Gmail'} />
      <FlatList
        data={options}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex flex-row justify-between items-center px-4 py-2"
            onPress={() => navigation.navigate(item.linkTo)}
          >
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Icon size={18} type="ionicon" name="ios-arrow-forward" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default GmailNav;
