import { useAuthTokenStore } from '@/store/auth';
import ax from './axios';
import { isAxiosError } from 'axios';
import { AppError } from '@/lib/AppError';
export type LoginBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  message: string;
  data: LoginData;
};

export type LoginData = {
  username: string;
  uuid: string;
  fullname: string;
  email: string;
  address: string;
  phone: string;
  accessToken: string;
};

const postLogin = async (body: LoginBody) => {
  try {
    const response = await ax.post<LoginResponse>('/auth/login', body);
    const { accessToken, uuid, fullname } = response.data.data;
    useAuthTokenStore.getState().setAccessToken(accessToken);
    useAuthTokenStore.getState().setUserUUID(uuid);
    useAuthTokenStore.getState().setFullname(fullname);
    useAuthTokenStore.getState().setIsAuthenticated(true);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) throw new AppError(400, 'Login Error', 'Username atau password salah');
      if (err.response?.status === 500) throw new AppError(500, 'Server Error', 'Server Error');
    }
    throw new AppError(500, 'Unknown Error', 'Unknown Error');
  }
};

export default postLogin;
