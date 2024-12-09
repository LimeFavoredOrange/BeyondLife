import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';

const dummyWills = [
  {
    id: '1',
    title: "John Doe's Digital Will #1",
    ownerName: 'John Doe',
    createdAt: '2024-01-01',
    status: 'not_started',
    totalInheritors: 5,
    votedCount: 0,
    freezeTimeLeft: null,
  },
  {
    id: '2',
    title: "Alice Smith's Digital Will #2",
    ownerName: 'Alice Smith',
    createdAt: '2024-02-10',
    status: 'voting',
    totalInheritors: 4,
    votedCount: 3,
    freezeTimeLeft: null,
  },
  {
    id: '3',
    title: "Michael Brown's Digital Will #3",
    ownerName: 'Michael Brown',
    createdAt: '2024-03-15',
    status: 'freezing',
    totalInheritors: 6,
    votedCount: 6,
    freezeTimeLeft: '10 hours',
  },
  {
    id: '4',
    title: "Sarah Johnson's Digital Will #4",
    ownerName: 'Sarah Johnson',
    createdAt: '2024-04-20',
    status: 'activated',
    totalInheritors: 3,
    votedCount: 3,
    freezeTimeLeft: null,
  },
];

const WillTriggerActivationScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWill, setSelectedWill] = useState(null);

  const openWillDetails = (will) => {
    setSelectedWill(will);
    setModalVisible(true);
  };

  const renderStatusInfo = (status, will) => {
    switch (status) {
      case 'not_started':
        return (
          <View>
            <Text className="text-sm text-gray-700">Status: Pending Activation</Text>
            <Text className="text-xs text-gray-500">Total Inheritors: {will.totalInheritors}</Text>
          </View>
        );
      case 'voting':
        return (
          <View>
            <Text className="text-sm text-gray-700 mb-1">Status: Voting in Progress</Text>
            <View className="flex-row items-center space-x-2">
              <AnimatedCircularProgress
                size={50}
                width={5}
                fill={(will.votedCount / will.totalInheritors) * 100}
                tintColor="#036635"
                backgroundColor="#e5e7eb"
              >
                {() => (
                  <Text className="text-xs text-gray-700">
                    {will.votedCount}/{will.totalInheritors}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <Text className="text-xs text-gray-500">Current Voting Progress</Text>
            </View>
          </View>
        );
      case 'freezing':
        return (
          <View>
            <Text className="text-sm text-gray-700">Status: Activated - In Freezing Period</Text>
            <Text className="text-xs text-gray-500">Remaining Freezing Time: {will.freezeTimeLeft}</Text>
          </View>
        );
      case 'activated':
        return (
          <View>
            <Text className="text-sm text-green-600">Status: Activated - Ready to Claim</Text>
          </View>
        );
      default:
        return <Text className="text-sm text-gray-500">Unknown Status</Text>;
    }
  };

  const triggerActivation = (will) => {
    alert(`Activating Will: ${will.title}`);
  };

  const handleVote = (will) => {
    alert(`Voting for Will: ${will.title}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Will Trigger Activation'} />
      <ScrollView className="p-4">
        {dummyWills.map((will, index) => (
          <Animatable.View
            key={will.id || index}
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
                <Text className="text-lg font-semibold">{will.title}</Text>
                <Text className="text-sm text-gray-500">Owner: {will.ownerName}</Text>
                <Text className="text-xs text-gray-400">Created At: {will.createdAt}</Text>
              </View>
            </View>

            <View className="mb-4">{renderStatusInfo(will.status, will)}</View>

            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => openWillDetails(will)}>
                <Icon name="information-outline" size={24} color="#374151" />
              </TouchableOpacity>
              <View className="flex-row space-x-2">
                {will.status === 'not_started' && (
                  <TouchableOpacity
                    className="bg-green-500 px-4 py-2 rounded-full"
                    onPress={() => triggerActivation(will)}
                  >
                    <Text className="text-white text-sm">Activate</Text>
                  </TouchableOpacity>
                )}
                {will.status === 'voting' && (
                  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full" onPress={() => handleVote(will)}>
                    <Text className="text-white text-sm">Vote</Text>
                  </TouchableOpacity>
                )}
                {will.status === 'freezing' && (
                  <TouchableOpacity className="border border-red-300 px-4 py-2 rounded-full" disabled>
                    <Text className="text-red-600 text-sm">Freezing</Text>
                  </TouchableOpacity>
                )}
                {will.status === 'activated' && (
                  <TouchableOpacity
                    className="border border-gray-300 px-4 py-2 rounded-full"
                    onPress={() => alert('View Activation Details')}
                  >
                    <Text className="text-gray-700 text-sm">View</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animatable.View>
        ))}
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
              <Text className="text-lg font-semibold mb-2">{selectedWill.title}</Text>
              <Text className="text-sm text-gray-700 mb-1">Owner: {selectedWill.ownerName}</Text>
              <Text className="text-sm text-gray-700 mb-1">Created At: {selectedWill.createdAt}</Text>
              <Text className="text-sm text-gray-700 mb-3">Status: {selectedWill.status}</Text>
              <Text className="text-sm text-gray-500 mb-3">
                More details can be shown here, such as inheritor list, conditions, and history.
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

export default WillTriggerActivationScreen;
