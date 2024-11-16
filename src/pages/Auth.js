import { useLocation } from 'react-router-dom';
import { Base64 } from 'js-base64';

//components
import VerifyUser from './authentication/VerifyUser';
import Wallet from './Wallet';

export default function Auth() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const decodedEmail = Base64.decode(token);

  const isValidEmail = (decodedEmail) => {
    // Regular expression for basic token validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(decodedEmail);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('access_token');
    window.location.reload();
  }

  return (
    <>
      {localStorage.getItem('access_token') !== null ?
        <>
        <Wallet />
        </>
      :
        <>
        {token && isValidEmail(decodedEmail) && <VerifyUser email={decodedEmail} />}
        </>
      }
    </>
  );
}
