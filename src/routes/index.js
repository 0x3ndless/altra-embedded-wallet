import { useRoutes } from 'react-router-dom';
import Auth from '../pages/Auth';
import Wallet from '../pages/Wallet';
import Signer from '../pages/Signer';
import Home from '../pages/Home';
// ----------------------------------------------------------------------


export default function Router() {
  return useRoutes([
    { path: '/', element: <Home /> },
    { path: '/auth', element: <Auth /> },
    { path: '/auth/signer', element: <Signer /> },
    { path: '/wallet', element: <Wallet /> },
  ]);
}
