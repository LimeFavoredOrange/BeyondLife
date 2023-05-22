import { FlatList, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/slices/auth';
import { Badge } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { selectAccounts } from '../../redux/slices/accounts';

const AccountManagerDashboard = () => {
  const accounts = useSelector(selectAccounts);
  const token = useSelector(selectToken);
  const navigation = useNavigation();

  const tagColor = {
    Work: 'red',
    Social: 'blue',
    Gaming: 'green',
    Shopping: 'orange',
    Other: 'purple',
  };

  // const getAccounts = async () => {
  //   try {
  //     const response = await axios.get('https://tor2023-203l.onrender.com/account/get', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(response.data.data);
  //     setAccounts(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // React.useEffect(() => {
  //   getAccounts();
  // }, []);

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.accountid}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 border-b px-2 space-x-2"
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate('View Account', { accountid: item.accountid });
            }}
          >
            <Text className="text-lg font-semibold mx-3">{item.platform}</Text>
            <Badge value={item.tag} badgeStyle={{ backgroundColor: `${tagColor[item.tag]}` }} />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AccountManagerDashboard;
