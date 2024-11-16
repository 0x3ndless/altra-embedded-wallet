import { useState } from 'react';

//components
import VerifyUser from './authentication/VerifyUser';
import Wallet from './Wallet';
import { Button, FormHelperText, Grid, Stack, TextField, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import Iconify from '../components/Iconify';

export default function Auth() {

  //Email form
  const [formData, setFormData] = useState({email: ''});
  const [errorEmail, setErrorEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const handleEmail = (e) => {
    e.preventDefault();
    const isInvalidEmail = !formData.email.trim() || !validateEmail(formData.email);
  
    setErrorEmail(isInvalidEmail);
  
    if (!isInvalidEmail) {
      setSubmitted(true);
    }
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrorEmail(false);
    setFormData({email: ''});
    setSubmitted(false);
  };

  const isLoggedIn = localStorage.getItem('access_token') !== null;

  return (
    <>
      <Tooltip title={isLoggedIn ? "View your crypto wallet" : "Sign in with your email to create a crypto account"} arrow>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenDialog}
          startIcon={<Iconify icon={isLoggedIn ? "material-symbols:wallet" : "material-symbols:login"} />}
          sx={{ mt: 5 }}
        >
          {isLoggedIn ? 'View Wallet' : 'Sign In'}
        </Button>
      </Tooltip>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {isLoggedIn ? null : 'Sign In'}
            {!isLoggedIn && (
              <Button onClick={handleCloseDialog} sx={{ minWidth: 0 }}>
                <Iconify icon="ic:sharp-close" sx={{ color: 'text.disabled' }} height={22} width={22} />
              </Button> 
            )}
        </DialogTitle>

        <DialogContent>
          {isLoggedIn ? (
            <Stack  sx={{ p: 1, minWidth: 300 }}>
            <Wallet />
            </Stack>
          ) : !submitted ? (
            <Stack component="form" onSubmit={handleEmail} sx={{ p: 1, minWidth: 300 }}>
              <Grid item xs={12} >
                <TextField 
                  error={errorEmail}
                  placeholder="Enter your email address" 
                  id="email"
                  variant="outlined"
                  fullWidth
                  autoComplete="on"
                  onChange={e => {
                    setFormData({...formData, email: e.target.value});
                    setErrorEmail(false);
                  }}
                  value={formData.email}
                />
                {errorEmail && (
                  <FormHelperText sx={{ textAlign: 'left', color: 'error.main' }}>
                    Invalid email address
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sx={{ mb: 1.5, mt: 2 }}>
              <Button variant="contained" fullWidth size="large" onClick={handleEmail}>
                Continue
              </Button>
            </Grid>
            </Stack>
          ) : (
            <VerifyUser email={formData.email} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
