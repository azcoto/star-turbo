import { useAuthTokenStore } from '@/store/auth';
import axios from 'axios';

const ax = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add token interceptor
ax.interceptors.request.use(config => {
  const token = useAuthTokenStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default ax;
