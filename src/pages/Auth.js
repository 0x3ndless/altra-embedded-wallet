import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';

//components
import VerifyUser from './authentication/VerifyUser';
import { Button, Typography, Dialog, DialogTitle, DialogContent, FormHelperText, Grid, Stack, TextField } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Iconify from '../components/Iconify';

export default function Auth() {

  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'md');
  //Email form
  const [formData, setFormData] = useState({email: ''});
  const [errorEmail, setErrorEmail] = useState(false); // State for email error

  const [open, setOpen] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const decodedEmail = Base64.decode(token && token !== null ? token : '');

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const handleEmail = () => {
    const isInvalidEmail = !formData.email.trim() || !validateEmail(formData.email);
  
    setErrorEmail(isInvalidEmail);
  
    if (!isInvalidEmail) {
      const encodedEmail = Base64.encode(formData.email);
      navigate(`/auth?token=${encodedEmail}`);
    }
    setOpen(false);
  }  

  const handleClose = () => {
    setOpen(false);
    setFormData({email: ''});
    setErrorEmail(false);
  };

  return (
    <>


<Dialog open={open} onClose={handleClose} sx={{zIndex: 80, minWidth: isDesktop ? '340px' : null}}>


  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Sign In
  </DialogTitle>

  <DialogContent sx={{ minWidth: isDesktop ? '340px' : '300px'}}>

      <Stack sx={{ p: 1 }}>
      <Grid item xs={12} sx={{ mb: 2.5, mt: 1.5}}>
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
  </DialogContent>

</Dialog>


      {localStorage.getItem('access_token') === null && formData.email === '' ?
      <>
      <Button 
        variant="contained"
        size="large"
        startIcon={<Iconify icon="mdi:login" />} 
        onClick={() => setOpen(true)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
          Sign In
      </Button>
      </>
      :
        <>
        {token && validateEmail(decodedEmail) && <VerifyUser email={decodedEmail} />}
        </>
      }
    </>
  );
}
