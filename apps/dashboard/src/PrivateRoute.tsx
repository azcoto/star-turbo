import { Outlet, Navigate } from 'react-router-dom';
import { useAuthTokenStore } from './store/auth';
import RootLayout from './pages/RootLayout';

const PrivateRoute = () => {
  const isAuthenticated = useAuthTokenStore.getState().isAuthenticated;
  console.log(isAuthenticated);
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
