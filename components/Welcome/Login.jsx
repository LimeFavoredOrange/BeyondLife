import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Input, Icon, Button } from '@rneui/themed';
import { View } from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLogin, setToken, selectNotificationToken } from '../../redux/slices/auth';
import {
  setAccountNumber,
  setHeirNumber,
  setNoteNumber,
  setWillsNumber,
  setStorageNumber,
  setLinkToFacebook,
  setLinkToTwitter,
  setLinkToInstagram,
  setLinkToGmail,
  setLinkToGoogleDrive,
} from '../../redux/slices/homeSlice';
import showToast from '../../utils/showToast';

import axiosInstance from '../../api';

import { getFromSecureStore } from '../../utils/storage';

import {
  generateKeyPairFromPassword,
  decryptData,
  generateRSAKeyPairFromSeed,
  generateECCKeyPair,
} from '../../utils/pki';

// import { decryptData } from '../../utils/temp';

import * as SecureStore from 'expo-secure-store';

// 保存私钥到 SecureStore
export async function savePrivateKeyToSecureStore(key, value) {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    console.log('Private key saved successfully');
  } catch (error) {
    console.error('Error saving private key:', error);
  }
}

async function getPrivateKeyFromSecureStore(key) {
  try {
    const privateKey = await SecureStore.getItemAsync(key);
    if (privateKey) {
      console.log('Private key retrieved successfully');
      return privateKey;
    } else {
      console.log('No private key found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving private key:', error);
    return null;
  }
}

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
  const notificationToken = useSelector(selectNotificationToken);

  const handleLogin = async () => {
    try {
      setShowLoading(true);
      const notificationToken = await getFromSecureStore('notificationToken');
      const response = await axiosInstance.post('auth/login', {
        email,
        password,
        notificationToken: notificationToken,
      });
      const {
        account_number,
        heir_number,
        note_number,
        wills_number,
        storage_number,
        link_to_facebook,
        link_to_twitter,
        link_to_instagram,
        link_to_gmail,
        link_to_google_drive,
      } = response.data;

      // Sand an api call to update the notification token

      // const { publicKey, privateKey } = await generateKeyPairFromPassword(email, password);
      // const { publicKey, privateKey } = await generateECCKeyPair(email, password);

      // console.log('publicKey\n', publicKey);
      // console.log('privateKey\n', privateKey);

      // const dummyData = [
      //   {
      //     ciphertext: 'd043a49670b60444ff1626a5ab434678ca4a4e9123b06c76c9d5876856a7',
      //     iv: 'dfc841bacfcf8b6b83f0330bdc48ea36',
      //     serverPublicKey:
      //       '04958c538b56fbc6f0c9e8abc31a68d682453e494d103c80f6f9bebe93aba95d122ce4910dd9738fb9e2d157710d599e6e86a6a3ec524352e28b8ebd423983aaae',
      //   },
      //   {
      //     ciphertext:
      //       '03765fb8b2bb6dfb73861b01c80e54c80d7d9309794344d719f51006245b0998d8c9e2f154d36e3e27353798acbbe9cb6a3f8b6bcd42361c07fe72084ebbb400828c10b5dd767715542ec183fe0c4aba107f322530a73354b4ed2a1c62cec8ed568cab25049819bc75c0ca985098a0fa7e5865f05cf93522320df4',
      //     iv: 'ddd5061b6b2a6df6e7d5525e51a4b482',
      //     serverPublicKey:
      //       '04839edbee7d0cd6412a9f333c526d7a03b430394f60817d66b674f5cde54021e45b09010314b3cc99c7bbef3b9933ca3dbf80dabfefcf3212f32b4287226e2a76',
      //   },
      //   {
      //     ciphertext:
      //       '9f02d1e198869c5a7eac8b357da66ad0031aeb0a24a6ad89b957db4fb7ae42915f2b75c84d3acad4848f79866de13d96e5cced061338c3f6be7e66be77c21a3b',
      //     iv: '44a51f4583aa884f803f3076425d21ea',
      //     serverPublicKey:
      //       '04290e676d0c209ca0ce9263d4be8644b9bde8a4966db897d3c0c9a47e06e3415f79ef474d3ab8de0023f668f204a4df27ae73d3cb45e447cf54fa24b3a01e0eca',
      //   },
      // ];

      // for (let i = 0; i < dummyData.length; i++) {
      //   const check = await decryptData(dummyData[i], privateKey);
      //   console.log('check', check, '\n\n');
      // }
      // // 保存到 SecureStore
      // await savePrivateKeyToSecureStore('private_key', privateKey);

      console.log(response.data);
      dispatch(setAccountNumber(account_number));
      dispatch(setHeirNumber(heir_number));
      dispatch(setNoteNumber(note_number));
      dispatch(setWillsNumber(wills_number));
      dispatch(setStorageNumber(storage_number));
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
