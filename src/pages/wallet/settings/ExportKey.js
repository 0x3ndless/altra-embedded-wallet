import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { CardContent, CircularProgress, FormHelperText, IconButton, InputAdornment, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
//--------------------Redux---------------------------------
import { useDispatch, useSelector } from 'react-redux';
import { getAuthCodeSecret, verifyAuthCodeSecret } from '../../../redux/features/contractSlice';
import { reconstructPrivateKey } from '../../authentication/WalletUtils';

const ExportKey = ({ email }) => {

  const dispatch = useDispatch();
  const { loadingAuth, authCodeDetails, walletData } = useSelector((state) => ({ ...state.app }));

  //------------------States------------------
  const [verificationCode, setVerificationCode] = useState('');
  const [otpValid, setOtpValid] = useState(true);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(true);

  //------------Secret states----------------------------------------

  const [showSecret, setShowSecret] = useState(false);
  const [pKey, setPKey] = useState('');

  const handleToggleSecretVisibility = () => {
    setShowSecret((prevShowSecret) => !prevShowSecret);
  };

  //------------------------------------------------------------------

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
  
      const result = await dispatch(verifyAuthCodeSecret({ authData }));
  
      if (result?.payload?.verified) {

        //Creating the threshold shares
        const embeddedDetails = JSON.parse(localStorage.getItem('embedded_wallet'));
        const device_share = embeddedDetails?.device_share
        const shares = [device_share, walletData && walletData[0] && walletData[0]?.auth_share];
        const privateKey = await reconstructPrivateKey(shares);
        setPKey(privateKey);
        setVerified(true);
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

  //Sending Verification code
  const sendVerificationCode = async () => {
    await dispatch(getAuthCodeSecret({ email }));
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
    <div>

        <Typography sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
          {loadingAuth ? 'Sending the verification code to' : verified ? '⚠️ Warning: Never disclose this key to anyone' : 'Enter the verification code sent to'}
        </Typography>
        {!verified && 
        <Typography sx={{ mt: 1, textAlign: 'center' }}>
          {email && email}
        </Typography>
        }
        {loadingAuth ? (
          <Stack direction="row" justifyContent="center" sx={{ mt: 3, mb: 3 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {verified ? (
              <>
            <TextField sx={{mt: 3}}
                type={showSecret ? 'text' : 'password'}
                value={pKey}
                onChange={(e) => setPKey(e.target.value)}
                fullWidth
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={handleToggleSecretVisibility} edge="end">
                        {showSecret ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                ),
                readOnly: true
                }}
            />
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
                          width: { xs: 30, sm: 46 },
                          height: { xs: 30, sm: 46 },
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
    </div>
  );
};

export default ExportKey;
