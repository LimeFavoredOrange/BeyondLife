import Toast from 'react-native-toast-message';

function showToast(message, type) {
  Toast.show({
    type: type,
    text1: message,
  });
}

export default showToast;
