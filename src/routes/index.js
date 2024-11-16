import { useRoutes } from 'react-router-dom';
import Auth from '../pages/Auth';
import Wallet from '../pages/Wallet';
import Signer from '../pages/Signer';
// ----------------------------------------------------------------------


export default function Router() {
  return useRoutes([
    { path: '/auth', element: <Auth /> },
    { path: '/auth/signer', element: <Signer /> },
    { path: '/wallet', element: <Wallet /> },
  ]);
}
