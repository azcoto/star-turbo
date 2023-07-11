import { create } from 'zustand';

export interface AuthTokenState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  saveLocalStorage: () => void;
  clearLocalStorage: () => void;
}

export const useAuthTokenStore = create<AuthTokenState>()(set => ({
  accessToken: '',
  setAccessToken: token => set({ accessToken: token }),
  saveLocalStorage: () => {
    localStorage.setItem('accessToken', useAuthTokenStore.getState().accessToken);
  },
  clearLocalStorage: () => {
    localStorage.removeItem('accessToken');
  },
}));
