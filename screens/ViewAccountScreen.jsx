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
      <Text>Platform: {account?.platform}</Text>
      <Text>Tag: {account?.tag}</Text>
      <Text>Username: {account?.username}</Text>
      <Text>Password: {account?.password}</Text>
      <Text>Usefor: {account?.usefor}</Text>
      <Text>Note: {account?.note}</Text>
    </SafeAreaView>
  );
};

export default ViewAccountScreen;
