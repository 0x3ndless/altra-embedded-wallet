import React, { useState } from 'react';
import { Button, CardContent, CircularProgress, Typography } from "@mui/material";
import { createSigner, signTransaction } from './SignerUtils';

const UserSigner = ({signatureParams, walletInfo}) => {

    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState('');

    const handleSignTransaction = async () => {
        setLoading(true);
        try {
          const { domain, types, voucher, chainId } = signatureParams;

          //Creating the threshold shares
          const embeddedDetails = JSON.parse(localStorage.getItem('embedded_wallet'));
          const device_share = embeddedDetails?.device_share
          const shares = [walletInfo?.auth_share, device_share];
    
          // Creating a signer using the reconstructed private key
          const signer = await createSigner(shares, chainId);
    
          // Signing the transaction using the signer
          const signature = await signTransaction(signer, domain, types, voucher);
          window.parent.postMessage({ type: 'signed_data', data: signature }, '*');

          setSignature(signature);
        } catch (error) {
          console.error('Error signing transaction:', error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

  return (
    <div >
    <CardContent>
      <Typography sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
        {signature !== '' ? '' : 'Please authorize the transaction by signing it'}
      </Typography>
      <Button sx={{mt: 3}} onClick={handleSignTransaction} disabled={loading || signature !== ''} variant={signature !== '' ? "outlined":"contained"} fullWidth>
        {loading ? <CircularProgress size={24} /> : signature !== '' ? 'Signed successfully!' : 'Sign Transaction'}
      </Button>
    </CardContent>
  </div>
  );
};

export default UserSigner;
