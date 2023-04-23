import { View, SafeAreaView, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/auth';
import axios from 'axios';

const ViewAccountScreen = ({ route }) => {
  const { accountid } = route.params;
  const token = useSelector(selectToken);

  const [account, setAccount] = React.useState({});
  console.log(accountid);

  const getAccountDetail = async () => {
    try {
      const response = await axios.get(`https://tor2023-203l.onrender.com/account/get/${accountid}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setAccount(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAccountDetail();
  }, []);

  return (
    <SafeAreaView>
      <View className="border-b p-1">
        <Text>Platform: {account?.platform}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Username: {account?.username}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Password: {account?.password}</Text>
      </View>
      <View className="border-b p-1">
        <Text>Usefor: {account?.useFor}</Text>
      </View>
      {/* <View className="border-b p-1">
        <Text>Executor: {account?.name}</Text>
      </View> */}
      <View className="border-b p-1">
        <Text>Note: {account?.note}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewAccountScreen;
