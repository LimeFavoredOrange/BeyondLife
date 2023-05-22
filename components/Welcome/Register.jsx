import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Input, Icon, Button } from '@rneui/themed';
import { View } from 'react-native-animatable';
import axios from 'axios';

const Register = ({ setAnimating, setCurrentMode, setCurrentHeight, loginAnimation, loginHeight, setShowLoading }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = async () => {
    if (password === confirmPassword) {
      setShowLoading(true);
      // const response = await axios.post('https://tor2023-203l.onrender.com/auth/register', {
      //   email,
      //   password,
      // });
      setShowLoading(false);
      setAnimating(loginAnimation);
      setCurrentHeight(loginHeight);
      setCurrentMode('Login');
    }
  };
  return (
    <View animation={'fadeIn'} duration={1500}>
      <Text className="text-3xl mt-5 font-bold " style={{ fontSize: 38 }}>
        Register
      </Text>
      <ScrollView
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
        />
        <Input
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 1, borderWidth: 1, borderRadius: 15, padding: 5 }}
          placeholder="Confirm password"
          leftIcon={<Icon name="form-textbox-password" type="material-community" size={24} color={'#036635'} />}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <Button
          color="#036635"
          buttonStyle={{ width: 300, borderRadius: 15, marginBottom: 15 }}
          onPress={() => {
            handleRegister();
          }}
        >
          <Text className="font-bold text-white text-xl">Register</Text>
        </Button>

        <Button
          color="#4630EB"
          buttonStyle={{ width: 300, borderRadius: 15 }}
          onPress={() => {
            setAnimating(loginAnimation);
            setCurrentHeight(loginHeight);
            setCurrentMode('Login');
          }}
        >
          <Text className="font-bold text-white text-xl">Already have account</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default Register;
