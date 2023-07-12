import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
export interface AuthTokenState {
  accessToken: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthTokenStore = create<AuthTokenState>()(
  devtools(set => ({
    accessToken: localStorage.getItem('accessToken') || '',
    isAuthenticated: localStorage.getItem('accessToken') ? true : false,
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
    },
  }))
);
