import { useRoutes } from 'react-router-dom';
import Auth from '../pages/Auth';
import Wallet from '../pages/Wallet';
// ----------------------------------------------------------------------


export default function Router() {
  return useRoutes([
    { path: '/auth', element: <Auth /> },
    { path: '/wallet', element: <Wallet /> },
  ]);
}
