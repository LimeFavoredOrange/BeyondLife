import { View, Text, SafeAreaView, FlatList, Image, TextInput, StyleSheet, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import * as Animatable from 'react-native-animatable';

import * as DocumentPicker from 'expo-document-picker';

import base64 from 'base64-js';

import { Icon } from '@rneui/themed';

import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import axios from 'axios';
import { Button, SearchBar, Badge, Input } from '@rneui/themed';

import Loading from '../../components/Loading';
import { userData } from '../../Data/Twitter/twitterData';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const TwitterDecryptionScreen = () => {
  const [showLoading, setShowLoading] = React.useState(false);

  const [decryptSuccess, setDecryptSuccess] = React.useState(false);

  const [cipherText, setCipherText] = React.useState('');
  const [key, setKey] = React.useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Twitter Decryption'}
        icon={[{ name: 'arrow-right-circle', type: 'feather' }]}
        iconFunction={[
          async () => {
            try {
              const requestData = {
                cipher_text: cipherText,
                key: key,
              };

              // Navigate to the twitter setting screen
              const response = await axios.post(
                'https://b7f4-2403-4800-2211-c101-a93-d250-c963-ee11.ngrok-free.app/decrypt',
                requestData,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              console.log(JSON.stringify(response));
              setDecryptSuccess(true);
            } catch (error) {
              console.error(JSON.stringify(error));
            }
          },
        ]}
      />

      <View className="m-3 rounded-lg p-3" style={{ backgroundColor: '#1b7549' }}>
        {/* Have a input ask how many heirs, and below that, render that number of info */}
        <Text className="font-semibold text-white">Please upload the encrypted file</Text>
        <Pressable
          style={{
            backgroundColor: '#ADD8E6',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
          onPress={async () => {
            const file = await DocumentPicker.getDocumentAsync();
            if (file.type === 'success') {
              const fileData = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              setCipherText(fileData);
            } else {
              console.log('User cancelled document picker');
            }
          }}
        >
          <Icon className="inline-block" name="upload" type="antdesign" size={'sm'} />
          <Text className="text-black text-center font-bold">Upload</Text>
          {/* Add a icon from antdesign clouduploadoutlined */}
        </Pressable>
      </View>

      {/* Upload the key */}
      <View className=" m-3 rounded-lg p-3" style={{ backgroundColor: '#1b7549' }}>
        <Text className=" font-semibold text-white">Please upload the key</Text>
        <Pressable
          style={{
            backgroundColor: '#ADD8E6',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
          onPress={async () => {
            const file = await DocumentPicker.getDocumentAsync();
            if (file.type === 'success') {
              const fileData = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              setKey(fileData);
            } else {
              console.log('User cancelled document picker');
            }
          }}
        >
          <Icon className=" inline-block " name="upload" type="antdesign" size={'sm'} />
          <Text className="text-black text-center font-bold">Upload</Text>
        </Pressable>
      </View>

      {decryptSuccess && (
        <Animatable.View animation={'fadeInUp'} className=" m-3 rounded-lg p-3" style={{ backgroundColor: '#1a73e8' }}>
          <Text className=" font-semibold text-white">Decryption success 🎉</Text>
          <Text className=" font-semibold text-white">You can view and download the content</Text>
          <Pressable
            style={{
              backgroundColor: '#ADD8E6',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={async () => {
              // Decrypt the file
              const response = await axios.get('https://api.digitalwill.app/twitter/decrypt', {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const fr = new FileReader();
              fr.onload = async () => {
                try {
                  const fileUri = FileSystem.documentDirectory + 'digitalWills.zip';

                  await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], {
                    encoding: FileSystem.EncodingType.Base64,
                  });

                  const downloadedFile = await FileSystem.getInfoAsync(fileUri);
                  await Sharing.shareAsync(downloadedFile.uri);
                } catch (error) {
                  console.error(JSON.stringify(error));
                }
              };
              fr.readAsDataURL(response.data);
            }}
          >
            <Icon className="inline-block" name="download" type="antdesign" size={'sm'} />
            <Text className="text-black text-center font-bold">Download</Text>
          </Pressable>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default TwitterDecryptionScreen;
