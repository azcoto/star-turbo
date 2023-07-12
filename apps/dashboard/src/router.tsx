import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import LoginPage from './pages/Login';
import PrivateRoute from './PrivateRoute';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard/:serviceLine',
        index: false,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

export default router;
