import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Input, Icon, Button } from '@rneui/themed';
import { View } from 'react-native-animatable';
import showToast from '../../utils/showToast';

import axiosInstance from '../../api';

import { generateKeyPairFromPassword } from '../../utils/pki';

const Register = ({ setAnimating, setCurrentMode, setCurrentHeight, loginAnimation, loginHeight, setShowLoading }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // const showToast = useSelector(getShowToast);
  const handleRegister = async () => {
    // Check the given email is not empty and in the correct format, check the format properly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || emailRegex.test(email) === false) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (password === confirmPassword) {
      setShowLoading(true);
      try {
        // Generate the key pair from the email and password
        const { publicKey, privateKey } = await generateKeyPairFromPassword(email, password);

        await axiosInstance.post('auth/register', {
          email,
          password,
          publicKey,
        });

        setAnimating(loginAnimation);
        setCurrentHeight(loginHeight);
        setCurrentMode('Login');
        setShowLoading(false);

        // Notify the user that the registration is successful
        showToast('Registration successful ✅', 'success');
      } catch (error) {
        setShowLoading(false);
        console.log(error.response.data);
        showToast(error.response.data.message, 'error');
      }
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

        {/* The following 2 inputs is password style */}
        <Input
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 1, borderWidth: 1, borderRadius: 15, padding: 5 }}
          placeholder="Password"
          leftIcon={<Icon name="onepassword" type="material-community" size={24} color={'#036635'} />}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        <Input
          containerStyle={{ width: 300 }}
          inputContainerStyle={{ borderBottomWidth: 1, borderWidth: 1, borderRadius: 15, padding: 5 }}
          placeholder="Confirm password"
          leftIcon={<Icon name="form-textbox-password" type="material-community" size={24} color={'#036635'} />}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry={true}
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
