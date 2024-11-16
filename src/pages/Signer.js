import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getWalletData } from '../redux/features/contractSlice';
import UserSigner from "./authentication/UserSigner";
import { Base64 } from 'js-base64';
import { CircularProgress } from "@mui/material";

export default function Signer() {
  const dispatch = useDispatch();
  const { loadingWallet, walletData } = useSelector((state) => ({...state.app}));
  const [signatureParams, setSignatureParams] = useState(null);

  const fetchWallet = () => {
    dispatch(getWalletData());
  }

  useEffect(() => {
    fetchWallet();
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      try {
    
        const decodedData = JSON.parse(Base64.decode(token));

        if (decodedData && decodedData.domain && decodedData.types && decodedData.voucher && decodedData.chainId) {
          setSignatureParams(decodedData);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <>
      {loadingWallet ?

        <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 3, mb: 3 }} />
      
      : (
        <>
          {localStorage.getItem('access_token') !== null && signatureParams && (
            <UserSigner signatureParams={signatureParams} walletInfo={walletData && walletData[0]} />
          )}
        </>
      )}
    </>
  );
}
