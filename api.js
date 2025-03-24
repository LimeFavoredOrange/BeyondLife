import axios from 'axios';

import { BACKEND_URL } from '@env';

// Create an axios instance
console.log(BACKEND_URL);
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
