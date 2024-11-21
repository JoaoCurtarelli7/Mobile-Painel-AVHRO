import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: Platform.select({
    android: 'http://10.0.2.2:3333', 
    ios: 'http://localhost:3333', 
  }),
  timeout: 10000,
});

export default api;
