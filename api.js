import axios from 'axios';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: 'https://goshawk-robust-plainly.ngrok-free.app/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
