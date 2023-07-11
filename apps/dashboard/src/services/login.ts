import ax from './axios';

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
  accessToken: string;
};

const postLogin = async (body: LoginBody) => {
  const response = await ax.post<LoginResponse>('/auth/login', body);
  return response.data;
};

export default postLogin;
