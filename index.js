// Polyfills for React Native
// import 'react-native-get-random-values'; // 确保随机数生成器正常工作
// import { Buffer } from 'buffer';
// import process from 'process';

// global.Buffer = Buffer; // 全局注入 Buffer
// global.process = process;

// // Polyfill for streams (optional, if required by your dependencies)
// import stream from 'stream';
// global.stream = stream;

// Optional: TextEncoder/TextDecoder (if needed by your app)
// import { TextEncoder, TextDecoder } from 'util';
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

import { registerRootComponent } from 'expo';
import App from './App';

// Register the root component
registerRootComponent(App);
