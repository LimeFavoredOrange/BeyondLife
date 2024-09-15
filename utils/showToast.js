import Toast from 'react-native-toast-message';

function showToast(message, type, duration = 1000) {
  Toast.show({
    type: type,
    text1: message,
    visibilityTime: duration,
  });
}

export default showToast;
