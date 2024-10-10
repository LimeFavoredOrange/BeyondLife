import { FlatList, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/slices/auth';
import { Badge } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { selectAccounts } from '../../redux/slices/accounts';
import { selectAccountNumber } from '../../redux/slices/homeSlice';

import axiosInstance from '../../api';

const AccountManagerDashboard = () => {
  const accountNumber = useSelector(selectAccountNumber);
  const token = useSelector(selectToken);
  const navigation = useNavigation();
  const [accounts, setAccounts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (accountNumber > 0) {
          const response = await axiosInstance.get(`accounts/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAccounts(response.data);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };
    fetchData();
  }, [accountNumber]);

  const tagColor = {
    Work: 'red',
    Social: 'blue',
    Gaming: 'green',
    Shopping: 'orange',
    Other: 'purple',
  };

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => `${item.accountid}_${item.platform}`}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 border-b px-2 space-x-2"
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate('View Account', { data: item });
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
