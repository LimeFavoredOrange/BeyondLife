import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';

import { selectToken } from '../redux/slices/auth';
import { useSelector } from 'react-redux';
import axiosInstance from '../api';
import { useNavigation } from '@react-navigation/native';

import { getPrivateKeyFromSecureStore } from '../components/Welcome/Login';
import { decryptData } from '../utils/pki';

const AccessWillDataScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [selectedWill, setSelectedWill] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [wills, setWills] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const token = useSelector(selectToken);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWills = async () => {
      setShowLoading(true);
      try {
        const response = await axiosInstance.get('/twitter/willList', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Live Data:', response.data);

        // Filter all the wills that are ready to access
        const readyWills = response.data.wills.filter((will) => will.status === 'Activated - Ready to View');
        setWills(readyWills || []);
      } catch (error) {
        console.error(error);
      } finally {
        setShowLoading(false);
      }
    };

    fetchWills();
  }, [token, trigger]);

  const openWillDetails = (will) => {
    setSelectedWill(will);
    setModalVisible(true);
  };

  const handleAccess = async (will) => {
    // 这里可以模拟访问操作
    try {
      setShowLoading(true);
      console.log('Accessing will:', will);
      const response = await axiosInstance.get('/twitter/accessWill', {
        params: { creator_id: will.creatorInfo },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Access Will Response:', response.data);
      const target = response.data.data;
      const privateKey = await getPrivateKeyFromSecureStore('private_key');

      const output = [];
      for (let i = 0; i < target.length; i++) {
        const check = await decryptData(target[i], privateKey);
        output.push(check);
      }
      console.log('Decrypted Data:', output);

      // 这里可以将解密后的数据传递给下一个页面
      navigation.navigate('View Data', { data: output });

      setShowLoading(false);
    } catch (error) {
      console.error(error);
      setShowLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Access Will Data'} />

      <ScrollView className="p-4">
        {wills.map((will, index) => {
          const title = `${will.ownerName}'s Digital Will`;
          return (
            <Animatable.View
              key={will.address || index}
              animation="fadeInUp"
              duration={700}
              delay={index * 100}
              className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200"
            >
              <View className="flex-row items-center mb-3">
                <View className="mr-3">
                  <Icon name="account-circle" size={40} color="#036635" />
                </View>
                <View>
                  <Text className="text-lg font-semibold">{title}</Text>
                  <Text className="text-sm text-gray-500">Owner: {will.ownerName}</Text>
                  {will.type && <Text className="text-sm text-gray-500">Type: {will.type}</Text>}
                  <Text className="text-xs text-gray-400">Created At: {will.createdAt}</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-sm text-green-700">This Will is fully activated and ready to access.</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={() => openWillDetails(will)}>
                  <Icon name="information-outline" size={24} color="#374151" />
                </TouchableOpacity>
                <Button
                  mode="contained"
                  onPress={() => handleAccess(will)}
                  buttonColor="#036635"
                  labelStyle={{ color: '#fff', fontSize: 14 }}
                  className="rounded-full"
                >
                  Access
                </Button>
              </View>
            </Animatable.View>
          );
        })}
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
      >
        <View className="bg-white p-4 rounded-xl">
          {selectedWill && (
            <>
              <Text className="text-lg font-semibold mb-2">{`${selectedWill.ownerName}'s Digital Will`}</Text>
              <Text className="text-sm text-gray-700 mb-1">Owner: {selectedWill.ownerName}</Text>
              {selectedWill.type && <Text className="text-sm text-gray-700 mb-1">Type: {selectedWill.type}</Text>}
              <Text className="text-sm text-gray-700 mb-1">Created At: {selectedWill.createdAt}</Text>
              <Text className="text-sm text-green-700 mb-3">Status: This Will is ready to access data.</Text>
              <Text className="text-sm text-gray-500 mb-3">
                More details can be shown here. For example, inheritors, conditions, or data keys.
              </Text>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-full self-end"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-sm">Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccessWillDataScreen;
