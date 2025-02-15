import Toast from 'react-native-toast-message';

function showToast(message, type, duration = 2000) {
  Toast.show({
    type: type,
    // text1: type === 'error' ? 'Error❌' : 'Success ✅',
    text1: message,
    visibilityTime: duration,
    autoHide: true,
    swipeable: true,
  });
}
export default showToast;
