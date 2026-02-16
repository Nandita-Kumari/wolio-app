import { Platform } from 'react-native';

// Use your machine's IP when testing on a physical device (e.g. 'http://192.168.1.5:5000')
// Android emulator: use 'http://10.0.2.2:5000' instead of localhost
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
    return 'http://localhost:5000';
  }
  return 'https://your-production-api.com'; // Replace with your deployed backend URL
};

export const API_BASE_URL = getBaseUrl();
export const AUTH_BASE = `${API_BASE_URL}/api/auth`;
