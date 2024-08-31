import { Text, View, Image } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Button } from '@rneui/themed';
import Loading from '../components/Loading';

import Login from '../components/Welcome/Login';
import Register from '../components/Welcome/Register';

const WelcomeScreen = () => {
  const [animating, setAnimating] = React.useState('zoomIn');
  const [currentHeight, setCurrentHeight] = React.useState('66%');
  const [currentMode, setCurrentMode] = React.useState('Welcome');
  const [showLoading, setShowLoading] = React.useState(false);

  const loginHeight = '46%';
  const registerHeight = '36%';

  // Login animation
  const loginAnimation = {
    from: {
      height: currentHeight,
    },
    to: {
      height: loginHeight,
    },
  };

  // Register animation
  const registerAnimation = {
    from: {
      height: currentHeight,
    },
    to: {
      height: registerHeight,
    },
  };

  return (
    <View className="flex-1 items-center" style={{ backgroundColor: '#1c7549' }}>
      <Loading showLoading={showLoading} />
      <Animatable.View
        duration={500}
        animation={animating}
        style={{ height: '66%' }}
        className=" justify-center items-center"
      >
        <Image source={require('../assets/welcome.png')} style={{ width: 280, height: 280 }} resizeMode="contain" />
      </Animatable.View>

      <Animatable.View
        easing="linear"
        animation={'fadeInUpBig'}
        duration={600}
        delay={200}
        style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        className="w-screen bg-white "
      >
        {currentMode === 'Welcome' && <Text className="text-2xl mt-3 font-bold text-center">Digital Will App</Text>}
        <View className="flex-1 justify-center items-center">
          {currentMode === 'Welcome' && (
            <View className="gap-2 flex-1 justify-center">
              {/* Login button */}
              <View>
                <Button
                  color="#036635"
                  buttonStyle={{ width: 300, borderRadius: 15 }}
                  onPress={() => {
                    console.log('here');
                    setAnimating(loginAnimation);
                    setCurrentHeight(loginHeight);
                    setCurrentMode('Login');
                  }}
                >
                  <Text className="font-bold text-white text-xl">Login</Text>
                </Button>
              </View>

              {/* Register button */}
              <View>
                <Button
                  color="#4630EB"
                  buttonStyle={{ width: 300, borderRadius: 15 }}
                  onPress={() => {
                    setAnimating(registerAnimation);
                    setCurrentHeight(registerHeight);
                    setCurrentMode('Register');
                  }}
                >
                  <Text className="font-bold text-white text-xl">Register today</Text>
                </Button>
              </View>
            </View>
          )}

          {/* Login screen */}
          {currentMode === 'Login' && (
            <Login
              setShowLoading={setShowLoading}
              registerAnimation={registerAnimation}
              setCurrentHeight={setCurrentHeight}
              setCurrentMode={setCurrentMode}
              setAnimating={setAnimating}
              registerHeight={registerHeight}
            />
          )}

          {/* Register screen */}
          {currentMode === 'Register' && (
            <Register
              setShowLoading={setShowLoading}
              loginAnimation={loginAnimation}
              registerAnimation={registerAnimation}
              setCurrentHeight={setCurrentHeight}
              setCurrentMode={setCurrentMode}
              setAnimating={setAnimating}
              loginHeight={loginHeight}
            />
          )}
        </View>
      </Animatable.View>
    </View>
  );
};

export default WelcomeScreen;
