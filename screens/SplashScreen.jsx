import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
// import Video from 'react-native-video';
// import AnimatedLogo from '../assets/BeyondLife.mp4'; // 替换为你的 MP4 文件路径

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish && onFinish();
    }, 3000); // 3 秒播放时间，与视频长度匹配

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* <Video
        source={AnimatedLogo}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain" // 根据需要调整为 "cover" 或 "stretch"
        onEnd={() => {
          setIsVisible(false);
          onFinish && onFinish();
        }} // 视频播放完毕后隐藏
        muted={true} // 静音
        repeat={false} // 不重复播放
        controls={false} // 不显示控制栏
      /> */}
    </View>
  );
};

export default SplashScreen;
