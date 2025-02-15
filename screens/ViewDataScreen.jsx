import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AccessDataNothing from '../assets/access_data_notiong.png'; // 确保路径正确

const ViewDataScreen = ({ route }) => {
  const { data } = route.params;

  console.log('Decrypted data:', data);

  const isEmpty = !data || data.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* 标题区域 */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Decrypted Content</Text>
        <Text className="text-sm text-gray-500">
          {isEmpty ? 'No decrypted items available.' : 'Here are the decrypted items. Scroll through to view them all.'}
        </Text>
      </View>

      {isEmpty ? (
        // 没有数据时显示占位图与提示文字
        <View className="flex-1 justify-center items-center px-4">
          <Animatable.View animation="fadeIn" duration={800} style={{ alignItems: 'center' }}>
            <Image
              source={AccessDataNothing}
              style={{ width: 200, height: 200, marginBottom: 20, resizeMode: 'contain' }}
            />
            <Text className="text-base text-gray-600 text-center">
              It looks like there's nothing to show here. Once you have decrypted data, it will appear in this list.
            </Text>
          </Animatable.View>
        </View>
      ) : (
        <ScrollView className="px-4 pb-4">
          {data.map((item, index) => {
            console.log('item', item);
            let element = item;

            try {
              element = JSON.parse(item);

              const content = element.text;
              const images = element.images;
              const timestamp = element.timestamp;
              console.log('content', content);
              console.log('images', images);
              console.log('timestamp', timestamp);
              return (
                <Animatable.View key={index} animation="fadeInUp" duration={500} delay={index * 100} className="mb-4">
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <Card.Content className="flex-row items-start">
                      <Icon name="twitter" size={30} color="#036635" style={{ marginRight: 10 }} />
                      <View className="flex-1">
                        <Text className="text-base text-gray-800 font-medium mb-1">{`Tweet ${index + 1}`}</Text>
                        <Text className="text-sm text-gray-700">{content}</Text>
                        <Text className="text-xs text-gray-400">{timestamp}</Text>
                        {images && (
                          <View className="flex-row mt-2">
                            {images.map((image, i) => {
                              if (image !== '') {
                                return (
                                  <Image
                                    key={i}
                                    source={{ uri: image }}
                                    style={{ width: '80%', height: 150, marginRight: 5, borderRadius: 5 }}
                                  />
                                );
                              }
                            })}
                          </View>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </Animatable.View>
              );
            } catch (error) {
              console.log('Error parsing JSON:', error);
            }
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ViewDataScreen;
