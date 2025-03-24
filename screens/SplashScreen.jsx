import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish && onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* <Video
        source={AnimatedLogo}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        onEnd={() => {
          setIsVisible(false);
          onFinish && onFinish();
        }}
        muted={true}
        repeat={false}
        controls={false}
      /> */}
    </View>
  );
};

export default SplashScreen;
