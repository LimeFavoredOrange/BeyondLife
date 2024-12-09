import { SafeAreaView, View, Text, TextInput, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

import axiosInstance from '../api';

const AccessWillDataScreen = () => {
  const token = useSelector(selectToken);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Access Will Data'} />
    </SafeAreaView>
  );
};

export default AccessWillDataScreen;
