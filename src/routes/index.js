import { useRoutes } from 'react-router-dom';
import Auth from '../pages/Auth';
import Signer from '../pages/Signer';
import Wallet from '../pages/Wallet';
// ----------------------------------------------------------------------


export default function Router() {
  return useRoutes([
    { path: '/auth', element: <Auth /> },
    { path: '/auth/signer', element: <Signer /> },
    { path: '/wallet', element: <Wallet /> },
  ]);
}
