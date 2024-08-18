import { View, Text, SafeAreaView, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import React from 'react';
import AccountHeader from '../../components/Account/AutomaticWillHeader';
import axios from 'axios';

import Loading from '../../components/Loading';
import { userData } from '../../Data/Twitter/twitterData';
import { useRoute } from '@react-navigation/native';

const HeirSettingScreen = () => {
  const [showLoading, setShowLoading] = React.useState(false);

  const [numberOfHeirs, setNumberOfHeirs] = React.useState(0);

  const [heirs, setHeirs] = React.useState({});

  const route = useRoute();
  const { accessPolicy } = route.params;

  const serverEncryption = async () => {
    try {
      setShowLoading(true);

      // Send the file itself
      const fileData = userData.tweets.data;
      console.log(fileData);

      console.log(accessPolicy);
      const heirAttributes = parseHeirs();
      console.log(heirAttributes);

      const formData = new FormData();
      formData.append('file', JSON.stringify(fileData));
      formData.append('access_policy', JSON.stringify(accessPolicy));
      formData.append('heir_attributes', JSON.stringify(heirAttributes));

      const requestData = {
        file: JSON.stringify(fileData),
        access_policy: JSON.stringify(accessPolicy),
        heir_attributes: JSON.stringify(heirAttributes),
      };

      const response = await axios.post(
        'https://b7f4-2403-4800-2211-c101-a93-d250-c963-ee11.ngrok-free.app/upload',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

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
    } catch (error) {
      console.error(JSON.stringify(error));
    } finally {
      setShowLoading(false);
    }
  };

  const parseHeirs = () => {
    const newHeirs = {};
    for (let i = 0; i < numberOfHeirs; i++) {
      newHeirs[heirs[i].name] = heirs[i].attributes.split(',');
    }
    return newHeirs;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading showLoading={showLoading} />
      <AccountHeader
        setShowLoading={setShowLoading}
        title={'Setup Heirs'}
        icon={[{ name: 'arrow-right-circle', type: 'feather' }]}
        iconFunction={[
          () => {
            // Navigate to the twitter setting screen
            serverEncryption();
          },
        ]}
      />

      <View className=" m-3 rounded-lg p-3" style={{ backgroundColor: '#1b7549' }}>
        {/* Have a input ask how many heirs, and below that, render that number of info */}
        <Text className=" font-semibold text-white">How many heirs do you want to add?</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of heirs"
          keyboardType="numeric"
          onChangeText={(num) => {
            setNumberOfHeirs(num);
            const newHeirs = {};
            for (let i = 0; i < num; i++) {
              newHeirs[i] = { name: '', attributes: '' };
            }
            setHeirs(newHeirs);
          }}
        />
      </View>

      {/* Render the number of heirs, based on numberOfHeirs */}

      {/* 根据数量生成对应数量的盒子 */}
      {Array.from({ length: numberOfHeirs }).map((_, index) => {
        return (
          <View key={index} className=" m-3 rounded-lg p-3" style={{ backgroundColor: '#1b7549' }}>
            <Text className=" font-semibold text-white">Heir {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Heir name"
              keyboardType="text"
              onChangeText={(name) => {
                const newHeirs = { ...heirs };
                newHeirs[index].name = name;
                setHeirs(newHeirs);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Attributes of the heir(comma separated)"
              keyboardType="text"
              onChangeText={(attributes) => {
                const newHeirs = { ...heirs };
                newHeirs[index].attributes = attributes;
                setHeirs(newHeirs);
              }}
            />
          </View>
        );
      })}

      {/* {heirs.map((heir, index) => {
        return (
          <View className=" m-3 rounded-lg p-3" style={{ backgroundColor: '#1b7549' }}>
            <Text className=" font-semibold text-white">Heir {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Heir name"
              keyboardType="text"
              onChange={(e) => {
                const newHeirs = [...heirs];
                newHeirs[index].name = e.target.value;
                setHeirs(newHeirs);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Heir email"
              keyboardType="email"
              onChange={(e) => {
                const newHeirs = [...heirs];
                newHeirs[index].email = e.target.value;
                setHeirs(newHeirs);
              }}
            />
          </View>
        );
      })} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 25,
    marginTop: 6,
    borderWidth: 0.5,
    padding: 5,
    backgroundColor: 'white',
  },
});

export default HeirSettingScreen;
