import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Input, Icon, Button } from '@rneui/themed';
import { View } from 'react-native-animatable';
import { useDispatch } from 'react-redux';
import { setIsLogin, setToken } from '../../redux/slices/auth';
import {
  setAccountNumber,
  setHeirNumber,
  setNoteNumber,
  setWillsNumber,
  setLinkToFacebook,
  setLinkToTwitter,
  setLinkToInstagram,
  setLinkToGmail,
  setLinkToGoogleDrive,
} from '../../redux/slices/homeSlice';
import showToast from '../../utils/showToast';

import axiosInstance from '../../api';

const Login = ({
  setAnimating,
  setCurrentMode,
  setCurrentHeight,
  registerAnimation,
  registerHeight,
  setShowLoading,
}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      setShowLoading(true);
      const response = await axiosInstance.post('auth/login', {
        email,
        password,
      });
      console.log(response.data);
      const {
        account_number,
        heir_number,
        note_number,
        wills_number,
        link_to_facebook,
        link_to_twitter,
        link_to_instagram,
        link_to_gmail,
        link_to_google_drive,
      } = response.data;
      dispatch(setAccountNumber(account_number));
      dispatch(setHeirNumber(heir_number));
      dispatch(setNoteNumber(note_number));
      dispatch(setWillsNumber(wills_number));
      dispatch(setLinkToFacebook(link_to_facebook));
      dispatch(setLinkToTwitter(link_to_twitter));
      dispatch(setLinkToInstagram(link_to_instagram));
      dispatch(setLinkToGmail(link_to_gmail));
      dispatch(setLinkToGoogleDrive(link_to_google_drive));
      setShowLoading(false);
      dispatch(setIsLogin(true));
      dispatch(setToken(response.data.access_token));
      showToast('Login successful ✅', 'success');
    } catch (error) {
      setShowLoading(false);
      console.log(error);
      showToast('Login failed ❌', 'error');
    }
  };

  return (
    <View animation={'fadeIn'} duration={1500}>
      <Text className="mt-5 font-bold " style={{ fontSize: 38 }}>
        Login
      </Text>

      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Input
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 1, borderWidth: 1, borderRadius: 15, padding: 5 }}
          placeholder="Email"
          leftIcon={<Icon name="email" type="material-community" size={24} color={'#036635'} />}
          onChangeText={(text) => setEmail(text)}
        />

        <Input
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 1, borderWidth: 1, borderRadius: 15, padding: 5 }}
          placeholder="Password"
          leftIcon={<Icon name="onepassword" type="material-community" size={24} color={'#036635'} />}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        <Button
          color="#036635"
          buttonStyle={{ width: 300, borderRadius: 15, marginBottom: 15 }}
          onPress={() => {
            handleLogin();
          }}
        >
          <Text className="font-bold text-white text-xl">Login</Text>
        </Button>

        <Button
          color="#4630EB"
          buttonStyle={{ width: 300, borderRadius: 15 }}
          onPress={() => {
            setAnimating(registerAnimation);
            setCurrentHeight(registerHeight);
            setCurrentMode('Register');
          }}
        >
          <Text className="font-bold text-white text-xl">No account yet</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default Login;
