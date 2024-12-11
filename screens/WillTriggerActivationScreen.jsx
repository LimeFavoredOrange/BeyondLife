import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
// import { selectToken } from '../redux/slices/auth';
// import { useSelector } from 'react-redux';
// import axiosInstance from '../api';

const WillTriggerActivationScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWill, setSelectedWill] = useState(null);
  const [trigger, setTrigger] = useState(false);

  // 假数据：涵盖各种状态和类型
  const dummyWills = [
    {
      address: '0xWillVoting456',
      ownerName: 'Alice Smith',
      createdAt: '2024-03-15',
      type: 'X',
      status: 'Voting in Progress',
      heirs: ['0xHeirA', '0xHeirB', '0xHeirC'],
      voteCount: 1,
      remainingFreezingTime: 0,
      hasVoted: false, // 此用户还未投票
    },
    {
      address: '0xWillFreezingABC',
      ownerName: 'Catherine Liu',
      createdAt: '2024-05-20',
      // 没有type字段，以展示无type情况
      type: 'Gmail',
      status: 'Activated - In Freezing Period',
      heirs: ['0xHeirQ', '0xHeirW', '0xHeirE', '0xHeirR'],
      voteCount: 4,
      remainingFreezingTime: 3600, // 还有1小时冻结期
      hasVoted: false,
    },
    {
      address: '0xWillVoting789',
      ownerName: 'Bob Johnson',
      createdAt: '2024-04-01',
      type: 'Google Drive',
      status: 'Voting in Progress',
      heirs: ['0xHeirX', '0xHeirY'],
      voteCount: 1,
      remainingFreezingTime: 0,
      hasVoted: true, // 当前用户已经投票过，显示Withdraw按钮
    },
    {
      address: '0xWillPending123',
      ownerName: 'John Doe',
      createdAt: '2024-02-10',
      type: 'Twitter',
      status: 'Pending Activation',
      heirs: ['0xHeir1', '0xHeir2'],
      voteCount: 0,
      remainingFreezingTime: 0,
      hasVoted: false,
    },
    {
      address: '0xWillReadyXYZ',
      ownerName: 'David Kim',
      createdAt: '2024-06-30',
      type: 'Twitter',
      status: 'Activated - Ready to View',
      heirs: ['0xHeirM'],
      voteCount: 1,
      remainingFreezingTime: 0,
      hasVoted: false,
    },
  ];

  const [wills, setWills] = useState(dummyWills);

  // 原有真实数据请求已注释掉，仅供截图使用
  // const token = useSelector(selectToken);
  // useEffect(() => {
  //   const fetchWills = async () => {
  //     setShowLoading(true);
  //     try {
  //       const response = await axiosInstance.get('/twitter/willList', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log('Live Data:', response.data);
  //       setWills(response.data.wills || []);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setShowLoading(false);
  //     }
  //   };
  //   fetchWills();
  // }, [token, trigger]);

  const openWillDetails = (will) => {
    setSelectedWill(will);
    setModalVisible(true);
  };

  const renderStatusInfo = (status, will) => {
    const totalInheritors = will.heirs ? will.heirs.length : 0;
    const votedCount = will.voteCount || 0;
    const remainingFreezingTime = will.remainingFreezingTime || 0;

    switch (status) {
      case 'Pending Activation':
        return (
          <View>
            <Text className="text-sm text-gray-700">Status: Pending Activation</Text>
            <Text className="text-xs text-gray-500">Total Inheritors: {totalInheritors}</Text>
          </View>
        );
      case 'Voting in Progress':
        return (
          <View>
            <Text className="text-sm text-gray-700 mb-1">Status: Voting in Progress</Text>
            <View className="flex-row items-center space-x-2">
              <AnimatedCircularProgress
                size={50}
                width={5}
                fill={totalInheritors > 0 ? (votedCount / totalInheritors) * 100 : 0}
                tintColor="#036635"
                backgroundColor="#e5e7eb"
              >
                {() => (
                  <Text className="text-xs text-gray-700">
                    {votedCount}/{totalInheritors}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <Text className="text-xs text-gray-500">Current Voting Progress</Text>
            </View>
          </View>
        );
      case 'Activated - In Freezing Period':
        return (
          <View>
            <Text className="text-sm text-gray-700">Status: Activated - In Freezing Period</Text>
            <Text className="text-xs text-gray-500">
              Remaining Freezing Time: {remainingFreezingTime > 0 ? `${remainingFreezingTime} s` : 'N/A'}
            </Text>
          </View>
        );
      case 'Activated - Ready to View':
        return (
          <View>
            <Text className="text-sm text-green-600">Status: Activated - Ready to View</Text>
          </View>
        );
      default:
        return <Text className="text-sm text-gray-500">Unknown Status</Text>;
    }
  };

  // 原本triggerActivation/handleVote逻辑调用后端请求已不需要真实操作，仅供截图使用，可简化为alert
  const triggerActivation = (will) => {
    alert(`Activating Will: ${will.address}`);
  };

  const handleVote = (will, hasVoted) => {
    if (hasVoted) {
      alert(`Withdrawing vote for Will: ${will.address}`);
    } else {
      alert(`Voting for Will: ${will.address}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Will Trigger Activation'} />
      <ScrollView className="p-4">
        {wills.map((will, index) => {
          const title = `${will.ownerName}'s Digital Will`;

          let actionButton = null;
          if (will.status === 'Pending Activation') {
            actionButton = (
              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-full" onPress={() => triggerActivation(will)}>
                <Text className="text-white text-sm">Activate</Text>
              </TouchableOpacity>
            );
          } else if (will.status === 'Voting in Progress') {
            actionButton = (
              <TouchableOpacity
                className={`${will.hasVoted ? 'bg-red-500' : 'bg-blue-500'} px-4 py-2 rounded-full`}
                onPress={() => handleVote(will, will.hasVoted)}
              >
                <Text className="text-white text-sm">{will.hasVoted ? 'Withdraw' : 'Vote'}</Text>
              </TouchableOpacity>
            );
          } else if (will.status === 'Activated - In Freezing Period') {
            actionButton = (
              <TouchableOpacity className="border border-red-300 px-4 py-2 rounded-full" disabled>
                <Text className="text-red-600 text-sm">Freezing</Text>
              </TouchableOpacity>
            );
          } else if (will.status === 'Activated - Ready to View') {
            actionButton = (
              <TouchableOpacity
                className="border border-gray-300 px-4 py-2 rounded-full"
                onPress={() => alert('View Activation Details')}
              >
                <Text className="text-gray-700 text-sm">View</Text>
              </TouchableOpacity>
            );
          }

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
                  {will.type && (
                    <Text className="text-sm text-gray-500">
                      Type:{' '}
                      <Text className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-lg dark:bg-green-900 dark:text-green-300">
                        {will.type}
                      </Text>
                    </Text>
                  )}
                  <Text className="text-xs text-gray-400">Created At: {will.createdAt}</Text>
                </View>
              </View>

              <View className="mb-4">{renderStatusInfo(will.status, will)}</View>

              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={() => openWillDetails(will)}>
                  <Icon name="information-outline" size={24} color="#374151" />
                </TouchableOpacity>
                <View className="flex-row space-x-2">{actionButton}</View>
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
