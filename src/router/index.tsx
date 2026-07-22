import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorPage from '../pages/ErrorPage';
import { appRoutes } from './routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: appRoutes,
  },
]);
