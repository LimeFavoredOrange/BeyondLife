import React from 'react';
import { View, Text } from 'react-native';
import { Modal, Portal, ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import axiosInstance from '../../api';
import { selectToken } from '../../redux/slices/auth';
import showToast from '../../utils/showToast';

const ProgressLoading = ({ showLoading, taskID, setShowLoading }) => {
  const [progress, setProgress] = React.useState(0);
  const [currentAction, setCurrentAction] = React.useState('Initializing...');
  const [previousAction, setPreviousAction] = React.useState('');
  const token = useSelector(selectToken);
  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchProgress = async () => {
      if (showLoading && taskID) {
        const response = await axiosInstance.get(`/tasks/progress/${taskID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProgress(response.data.progress / 100);

        // Update action with animation
        if (response.data.currentAction !== currentAction) {
          setPreviousAction(currentAction);
          setCurrentAction(response.data.currentAction);
        }

        if (response.data.progress === 100) {
          clearInterval(interval);
          showToast('✅ Your will has been successfully set and shared!', 'success');
          setShowLoading(false);
          navigation.navigate('Home');
        }
      }
    };

    const interval = setInterval(fetchProgress, 1000);
    return () => clearInterval(interval);
  }, [showLoading, taskID, currentAction]);

  return (
    <Portal>
      <Modal visible={showLoading} dismissable={false}>
        <View className="justify-center items-center h-full w-full bg-black/50">
          <Animatable.View
            animation="fadeInUp"
            duration={500}
            className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-xs"
          >
            <View className="justify-center items-center mb-4">
              <ActivityIndicator size="large" color="#036635" />
              <Text className="text-center text-lg font-semibold mt-2">Setting up your Digital Will</Text>
            </View>
            <View className="relative h-5 overflow-hidden mb-2">
              {previousAction && (
                <Animatable.Text
                  animation="fadeOutUp"
                  duration={1000}
                  style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#6B7280' }}
                >
                  {previousAction}
                </Animatable.Text>
              )}
              <Animatable.Text
                animation="fadeInUp"
                delay={1000}
                duration={1000}
                style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#6B7280' }}
              >
                {currentAction}
              </Animatable.Text>
            </View>
            <ProgressBar progress={progress} color="#036635" className="h-2 rounded-md" />
            <Text className="text-center text-xs text-gray-500 mt-2">{Math.round(progress * 100)}% Completed</Text>
          </Animatable.View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ProgressLoading;
