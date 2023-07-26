import { Outlet, Navigate } from 'react-router-dom';
import { useAuthTokenStore } from './store/auth';
import RootLayout from './pages/RootLayout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrivateRoute = () => {
  const isAuthenticated = useAuthTokenStore.getState().isAuthenticated;
  return isAuthenticated ? (
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
