import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
export interface AuthTokenState {
  accessToken: string;
  userUUID: string;
  fullname: string;
  isAuthenticated: boolean;
  setUserUUID: (userUUID: string) => void;
  setFullname: (fullname: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthTokenStore = create<AuthTokenState>()(
  devtools(set => ({
    accessToken: localStorage.getItem('accessToken') || '',
    userUUID: localStorage.getItem('userUUID') || '',
    fullname: localStorage.getItem('fullname') || '',
    isAuthenticated: localStorage.getItem('accessToken') ? true : false,
    setUserUUID: userUUID => {
      localStorage.setItem('userUUID', userUUID);
      return set({ userUUID });
    },
    setFullname: fullname => {
      localStorage.setItem('fullname', fullname);
      return set({ fullname });
    },
    setIsAuthenticated: isAuthenticated => {
      return set({ isAuthenticated });
    },
    getAccessToken: () => {
      const token = localStorage.getItem('accessToken');
      token ? set({ accessToken: token }) : set({ accessToken: '' });
      return useAuthTokenStore.getState().accessToken;
    },
    setAccessToken: token => {
      localStorage.setItem('accessToken', token);
      useAuthTokenStore.getState().setIsAuthenticated(true);
      return set({ accessToken: token });
    },
    logout: () => {
      useAuthTokenStore.getState().setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userUUID');
    },
  }))
);
