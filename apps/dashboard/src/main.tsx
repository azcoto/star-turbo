import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query';
import './globals.css';
import router from './router';
import { useAuthTokenStore } from './store/auth';
import { isAxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
  queryCache: new QueryCache({
    onError: err => {
      if (!isAxiosError(err)) return;
      if (err.response?.status !== 401) return;
      useAuthTokenStore.getState().logout();
      router.navigate('/login', {
        state: {
          error: 'Your session has expired. Please log in again.',
        },
      });
    },
  }),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
