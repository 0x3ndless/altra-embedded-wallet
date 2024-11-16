import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { CardContent, CircularProgress, Divider, FormHelperText, Grid, OutlinedInput, Stack, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

//--------------------Redux---------------------------------
import { useDispatch, useSelector } from 'react-redux';
import { createEmbeddedWallet, getAuthCode, getEmbeddedData, updateEmbeddedData, verifyAuthCode } from '../../redux/features/contractSlice';
import { generateWallet, reconstructDeviceShare } from './WalletUtils';

const VerifyUser = ({ email }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingAuth, authCodeDetails } = useSelector((state) => ({ ...state.app }));

  //------------------States------------------
  const [verificationCode, setVerificationCode] = useState('');
  const [otpValid, setOtpValid] = useState(true);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(true);

  const handleCodeChange = (index, value) => {
    // Update the verification code
    const newCode = verificationCode.substring(0, index) + value + verificationCode.substring(index + 1);
    setVerificationCode(newCode);

    // If the value is entered and the index is not the last one,
    // move focus to the next outlined input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`field-code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // If backspace is pressed and the index is not the first one,
    // move focus to the previous outlined input
    if (value === '' && index > 0) {
      const prevInput = document.getElementById(`field-code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const authData = {
        otp: verificationCode,
        token: authCodeDetails?.[0]?.token // Using optional chaining to handle potential undefined
      };

      const Nillion_API_URL = process.env.REACT_APP_NILLION_API_URL;
      const ALTRA_APP_ID = process.env.REACT_APP_ALTRA_APP_ID;
  
      const result = await dispatch(verifyAuthCode({ authData }));
  
      if (result?.payload?.verified) {
        const isNewUser = result.payload.isNewUser;
  
        if (isNewUser) {
          const walletData = await generateWallet();
          const embeddedData = {
            wallet: walletData.publicKey,
            email: email,
            auth_share: walletData.shares.auth_share,
            recovery_share: walletData.shares.recovery_share
          };
          const embeddedResults = await dispatch(createEmbeddedWallet({ embeddedData }));
  
          // Updating local storage with embedded wallet details
          const embeddedItem = {
            device_share: walletData.shares.device_share,
            wallet: walletData.publicKey,
            device_share_verison: 0
          };
          localStorage.setItem('embedded_wallet', JSON.stringify(embeddedItem));
  
          // Updatig token in local storage
          updateTokenInLocalStorage(embeddedResults.payload?.token, embeddedResults.payload?.wallet);
        } else {
          const embeddedDetails = JSON.parse(localStorage.getItem('embedded_wallet'));
          if (embeddedDetails?.wallet === result.payload?.verifiedAddress && embeddedDetails?.device_share_verison === result.payload?.device_share_verison) {
            updateTokenInLocalStorage(result.payload.token, result.payload.wallet);
          } else {
            const embeddedData = {
              token: result.payload.token,
              wallet: result.payload.wallet
            };
            const embeddedResultsRaw = await dispatch(getEmbeddedData({ embeddedData }));
            const embeddedResults = embeddedResultsRaw && embeddedResultsRaw.payload;
            const newEncodedShares = await reconstructDeviceShare(embeddedResults);
  
            const updatedEmbeddedData = {
              wallet: embeddedResults.wallet,
              id: embeddedResults._id,
              token: result.payload.token,
              auth_share: newEncodedShares?.shares?.auth_share,
              recovery_share: newEncodedShares?.shares?.recovery_share
            };
            const updatedEmbeddedResults = await dispatch(updateEmbeddedData({ updatedEmbeddedData }));
  
            // Updating local storage with embedded wallet details
            const embeddedItem = {
              device_share: newEncodedShares?.shares?.device_share,
              wallet: updatedEmbeddedResults?.payload?.wallet,
              device_share_verison: updatedEmbeddedResults?.payload?.device_share_version
            };
            localStorage.setItem('embedded_wallet', JSON.stringify(embeddedItem));
  
            // Updating token in local storage
            updateTokenInLocalStorage(result.payload.token, result.payload.wallet);
          }
        }
  
        setVerified(true);
        navigate('/wallet');
        window.location.reload();
      } else {
        setLoading(false);
        setOtpValid(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setOtpValid(true);
      setVerified(false);
    }
  };
  
  // Helper function to update token in local storage
  const updateTokenInLocalStorage = (token, wallet) => {
    const now = new Date().getTime();
    const item = {
      token: token,
      wallet: wallet,
      wallet_type: 'embedded',
      expiry: now
    };

    const defaultItem = {
      chainID: 80002
    }
    
    localStorage.setItem('access_token', JSON.stringify(item));
    localStorage.setItem('default_connector', JSON.stringify(defaultItem));

    window.parent.postMessage({ type: 'access_token', data: item }, '*');
  };
  

  //Sending Verification code
  const sendVerificationCode = async () => {
    await dispatch(getAuthCode({ email }));
  }

  useEffect(() => {
    if(verificationStatus) {
      sendVerificationCode();
      setVerificationStatus(false);
    }
  }, []);

  useEffect(() => {
    const filledPins = verificationCode.replace(/[^0-9]/g, '');
    if (filledPins.length === 6) {
      handleVerifyCode();
    }
  }, [verificationCode]);

  return (
    <div >

      <CardContent>
        <Typography sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
          {loadingAuth ? 'Sending the verification code to' : verified ? 'Signing in to' : 'Enter the verification code sent to'}
        </Typography>
        <Typography sx={{ mt: 1, textAlign: 'center' }}>
          {email && email}
        </Typography>
        {loadingAuth ? (
          <Stack direction="row" justifyContent="center" sx={{ mt: 3, mb: 3 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {verified ? (
              <>
              <Stack direction="row" justifyContent="center" sx={{ mt: 3, mb: 3 }}>
                <CircularProgress />
              </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                  {[...Array(6)].map((_, index) => (
                    <OutlinedInput
                      key={index}
                      id={`field-code-${index}`}
                      placeholder="-"
                      autoComplete='off'
                      inputProps={{
                        maxLength: 1,
                        sx: {
                          p: 0,
                          textAlign: 'center',
                          width: { xs: 36, sm: 46 },
                          height: { xs: 36, sm: 46 },
                        },
                      }}
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      error={!otpValid && verificationCode.length === 6}
                    />
                  ))}
                </Stack>
                {!otpValid && verificationCode.length === 6 && (
                  <FormHelperText sx={{ textAlign: 'center', color: 'error.main' }}>
                    Invalid verification code
                  </FormHelperText>
                )}
                <Button onClick={handleVerifyCode} disabled={loading} fullWidth size="large" type="submit" variant="contained" sx={{ mt: 3, mb: 3 }}>
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </>
            )}
          </>
        )}
        {loadingAuth || verified ? null : 
        <>
          <Divider sx={{ m: 0.5 }} />
          <Grid container alignItems="center" sx={{ mt: 1.5 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ textAlign: 'left', color: 'text.secondary' }}>
                Don't have a code?
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2" style={{ textDecoration: 'none', color: '#2065D1', cursor: 'pointer' }} onClick={sendVerificationCode}>
                  Resend code
                </Typography>
            </Grid>
          </Grid>
        </>
        }
      </CardContent>
    </div>
  );
};

export default VerifyUser;
