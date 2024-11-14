import { SafeAreaView, View, Text, TextInput, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AccountHeader from '../components/Account/AutomaticWillHeader';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

import axiosInstance from '../api';

const WillTriggerSettingScreen = () => {
  const token = useSelector(selectToken);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [threshold, setThreshold] = useState(0);

  const [freezingEnabled, setFreezingEnabled] = useState(false);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(10);
  const [numberOfHeirs, setNumberOfHeirs] = useState(0);

  const handleThresholdChange = (value) => {
    const num = Math.min(numberOfHeirs, Math.max(0, parseInt(value) || 0));
    setThreshold(num);
  };

  React.useEffect(() => {
    const getHeirs = async () => {
      setShowLoading(true);
      try {
        const heirs = await axiosInstance.get('heirs/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNumberOfHeirs(heirs.data.length);

        // Get the will trigger setting
        const willTriggerSetting = await axiosInstance.get('auth/willtrigger', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setThreshold(willTriggerSetting.data.threshold);

        const freezingPeriod = willTriggerSetting.data.freezingPeriod;
        if (freezingPeriod === 'None') {
          setFreezingEnabled(false);
        } else {
          setFreezingEnabled(true);
          const period = freezingPeriod.split('-');
          setWeeks(parseInt(period[0]));
          setDays(parseInt(period[1]));
          setHours(parseInt(period[2]));
        }

        setShowLoading(false);
      } catch (error) {
        setShowLoading(false);
        console.error('Error fetching heirs:', error);
      }
    };
    getHeirs();
  }, []);

  const updateWillTriggerSetting = async () => {
    try {
      console.log('here');
      setShowLoading(true);
      await axiosInstance.post(
        'auth/willtrigger',
        {
          threshold,
          freezingPeriod: freezingEnabled ? `${weeks}-${days}-${hours}` : 'None',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigation.goBack();
      setShowLoading(false);
    } catch (error) {
      console.error('Error updating will trigger setting:', error);
      setShowLoading(false);
    }
  };

  const handleWeeksChange = (value) => {
    console.log(value);
    const num = Math.min(4, Math.max(0, parseInt(value) || 0));
    setWeeks(num);
  };

  const handleDaysChange = (value) => {
    const num = Math.min(31, Math.max(0, parseInt(value) || 0));
    setDays(num);
  };

  const handleHoursChange = (value) => {
    const num = Math.min(23, Math.max(0, parseInt(value) || 0));
    setHours(num);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Loading showLoading={showLoading} />
      <AccountHeader setShowLoading={setShowLoading} title={'Trigger Condition Setting'} />

      <View style={{ padding: 20 }}>
        <Text style={styles.title}>Set the threshold for will activation:</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          onChangeText={handleThresholdChange}
          value={threshold.toString()}
        />

        <View className="flex-row justify-center items-center mb-6">
          {[...Array(numberOfHeirs)].map((_, index) => (
            <Animatable.View
              key={index}
              animation={threshold > index ? 'bounceIn' : undefined}
              duration={500}
              style={{
                marginHorizontal: 15,
                transform: threshold > index ? [{ translateY: -10 }] : [{ translateY: 0 }],
              }}
            >
              <Icon
                name="key-variant"
                onPress={(e) => {
                  e.preventDefault();
                  setThreshold(index + 1);
                }}
                size={60}
                color={threshold > index ? '#036632' : '#ccc'}
              />
            </Animatable.View>
          ))}
        </View>
        <Text style={styles.description}>
          Selected threshold:{' '}
          <Text style={{ color: '#036632' }} className="font-bold">
            {threshold}
          </Text>
        </Text>

        <Text className="text-center mb-5 text-gray-500">
          <Text className="text-indigo-600 font-bold">{threshold}</Text> out of {numberOfHeirs} heirs must vote 'Yes' to
          activate the will
        </Text>

        <View style={styles.switchContainer}>
          <Text style={styles.title}>Enable Freezing Period</Text>
          <Switch
            value={freezingEnabled}
            onValueChange={() => setFreezingEnabled(!freezingEnabled)}
            trackColor={{ false: '#ccc', true: '#ccc' }}
            thumbColor={freezingEnabled ? '#036635' : '#f4f3f4'}
          />
        </View>

        {freezingEnabled && (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text>Weeks</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={weeks.toString()}
                  onChangeText={handleWeeksChange}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text>Days</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={days.toString()}
                  onChangeText={handleDaysChange}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text>Hours</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={hours.toString()}
                  onChangeText={handleHoursChange}
                />
              </View>
            </View>

            <View style={styles.circleContainer}>
              <AnimatedCircularProgress
                size={120}
                width={12}
                fill={(weeks / 4) * 100}
                tintColor="#FF6B6B"
                backgroundColor="#F0F0F0"
                rotation={0}
                style={{ position: 'absolute' }}
                lineCap="round"
              />
              <AnimatedCircularProgress
                size={90}
                width={12}
                fill={(days / 31) * 100}
                tintColor="#4CAF50"
                backgroundColor="#F0F0F0"
                rotation={0}
                style={{ position: 'absolute' }}
                lineCap="round"
              />
              <AnimatedCircularProgress
                size={60}
                width={12}
                fill={(hours / 23) * 100}
                tintColor="#2196F3"
                backgroundColor="#F0F0F0"
                rotation={0}
                style={{ position: 'absolute' }}
                lineCap="round"
              />
            </View>
          </>
        )}
        {freezingEnabled && (
          <Text className="text-center text-gray-500 mt-20  ">
            Freezing period:{' '}
            <Text className="text-indigo-600 font-bold">
              {weeks} weeks, {days} days, {hours} hours
            </Text>
          </Text>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={() => {
          updateWillTriggerSetting();
        }}
      >
        <View
          style={{
            backgroundColor: '#036635',
            padding: 15,
            borderRadius: 8,
            margin: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  inputWrapper: {
    alignItems: 'center',
    width: '30%',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
});

export default WillTriggerSettingScreen;
