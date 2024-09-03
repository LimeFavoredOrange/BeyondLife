import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Redux
import { store } from './redux/store';
import { Provider } from 'react-redux';

import Navigation from './components/Navigation';

// Setting up navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}
