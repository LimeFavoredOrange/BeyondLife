import axios from 'axios';

import { BACKEND_URL } from '@env';

// 创建 axios 实例
console.log(BACKEND_URL);
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
