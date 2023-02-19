import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Input, Icon, Button } from '@rneui/themed';
import { View } from 'react-native-animatable';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLogin, setToken } from '../../redux/slices/auth';

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
      const response = await axios.post('https://tor2023-203l.onrender.com/auth/login', {
        email,
        password,
      });
      setShowLoading(false);
      dispatch(setIsLogin(true));
      dispatch(setToken(response.data.data.token));
    } catch (error) {
      setShowLoading(false);
      console.log(error);
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
          <Text className="font-bold text-white text-xl">no account yet</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default Login;
