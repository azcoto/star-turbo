import ax from './axios';
import { isAxiosError } from 'axios';
import { AppError } from '@/lib/AppError';

export type ChangePasswordBody = {
  uuid: string;
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

const postChangePassword = async (body: ChangePasswordBody) => {
  try {
    const response = await ax.post<ChangePasswordResponse>('/auth/change-password', body);
    const { success } = response.data;
    return success;
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) throw new AppError(400, 'ChangePasswordError', 'Username atau password salah');
      if (err.response?.status === 500) throw new AppError(500, 'Server Error', 'Server Error');
    }
    throw new AppError(500, 'Unknown Error', 'Unknown Error');
  }
};

export default postChangePassword;
