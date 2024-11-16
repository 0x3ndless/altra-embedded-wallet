//react
import { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';
import { useNavigate, Navigate } from 'react-router-dom';

//components
import { Button, Box, Dialog, Stack, Grid, TextField, FormHelperText } from '@mui/material';
import VerifyUser from './authentication/VerifyUser';
import useResponsive from '../hooks/useResponsive';

export default function Auth() {
  
  const isDesktop = useResponsive('up', 'md');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: ''});
  const [errorEmail, setErrorEmail] = useState(false);
  const [open, setOpen] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({email: ''});
  };

  const validateEmail = (email) => {
    // Regular expression for basic token validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmail = () => {
    const isInvalidEmail = !formData.email.trim() || !validateEmail(formData.email);
  
    setErrorEmail(isInvalidEmail);
  
    if (!isInvalidEmail) {
      const encodedEmail = Base64.encode(formData.email);
      navigate(`/auth?token=${encodedEmail}`);
      window.location.reload();
    }
  }  

  const checkTokenValidity = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        const decodedEmail = Base64.decode(token);
        const isValidEmail = validateEmail(decodedEmail);
        
        if (isValidEmail) {
          setFormData({...formData, email: decodedEmail});
          return true;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return false;
  }

  useEffect(() => {
    if (window.location.search.includes('?token=')) {
      const isValid = checkTokenValidity();
      if (isValid) {
        setIsTokenValid(true);
      }
    }
  }, [window.location.search]);

  return (
    <>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{zIndex: 80, minWidth: isDesktop ? '340px' : null}}
      >
        <Box sx={{ p: 3 }}>

        <Stack sx={{ p: 1 }}>
            <Grid item xs={12} sx={{ mb: 1.5}}>
              <TextField error={errorEmail} placeholder="Enter your email address" id="email" variant="outlined" fullWidth autoComplete="on" onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
              {errorEmail && (
                <FormHelperText sx={{ textAlign: 'left', color: 'error.main' }}>
                  Invalid email address
                </FormHelperText>
              )}
            </Grid>
      
            <Grid item xs={12} sx={{ mb: 1.5 }}>
              <Button variant="contained" fullWidth size="large" onClick={handleEmail}>
                Continue
              </Button>
            </Grid>
          </Stack>
        </Box>
      </Dialog>


      {localStorage.getItem('access_token') !== null ?
        <>
        <Navigate to="/wallet" />
        </>
      :
        <>
        {!isTokenValid && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Button variant='contained' size="large" onClick={handleOpen}>Sign In</Button>
        </Box>
        )}
        {window.location.search.includes('?token=') && <VerifyUser email={formData?.email} />}
        </>
      }
    </>
  );
}
