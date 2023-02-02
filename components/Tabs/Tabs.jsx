import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Icon, Divider } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedTab, setSelectedTab } from '../../redux/slices/homeSlice';

const Tabs = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector(selectSelectedTab);

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, height: '10%' }} className="bg-white w-full">
      <Divider width={0.5} />
      <View className="flex-row pt-3">
        <TouchableOpacity className="flex-1" onPress={() => dispatch(setSelectedTab('Home'))}>
          {selectedTab === 'Home' ? (
            <Icon size={30} name="ios-home" type="ionicon" color={'#036635'} />
          ) : (
            <Icon size={30} name="ios-home-outline" type="ionicon" color={'gray'} />
          )}
        </TouchableOpacity>

        <TouchableOpacity className="flex-1" onPress={() => dispatch(setSelectedTab('Link'))}>
          {selectedTab === 'Link' ? (
            <Icon size={30} name="link" type="ionicon" color={'#036635'} />
          ) : (
            <Icon size={30} name="link-outline" type="ionicon" color={'gray'} />
          )}
        </TouchableOpacity>

        <TouchableOpacity className="flex-1" onPress={() => dispatch(setSelectedTab('Key'))}>
          {selectedTab === 'Key' ? (
            <Icon size={30} name="ios-key" type="ionicon" color={'#036635'} />
          ) : (
            <Icon size={30} name="ios-key-outline" type="ionicon" color={'gray'} />
          )}
        </TouchableOpacity>

        <TouchableOpacity className="flex-1" onPress={() => dispatch(setSelectedTab('Document'))}>
          {selectedTab === 'Document' ? (
            <Icon size={30} name="document-text" type="ionicon" color={'#036635'} />
          ) : (
            <Icon size={30} name="document-text-outline" type="ionicon" color={'gray'} />
          )}
        </TouchableOpacity>

        <TouchableOpacity className="flex-1" onPress={() => dispatch(setSelectedTab('Setting'))}>
          {selectedTab === 'Setting' ? (
            <Icon size={30} name="settings" type="ionicon" color={'#036635'} />
          ) : (
            <Icon size={30} name="settings-outline" type="ionicon" color={'gray'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Tabs;
