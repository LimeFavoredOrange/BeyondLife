import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing screens
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';

// Account screen
import TwitterScreen from './screens/Account/TwitterScreen';

// Redux
import { store } from './redux/store';
import { Provider } from 'react-redux';

// Setting up navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Twitter" component={TwitterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
