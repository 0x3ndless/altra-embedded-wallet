import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';

//components
import VerifyUser from './authentication/VerifyUser';
import { Button, Typography, FormHelperText, Grid, Stack, TextField } from '@mui/material';

export default function Auth() {

  const location = useLocation();
  const navigate = useNavigate();
  
  //Email form
  const [formData, setFormData] = useState({email: ''});
  const [errorEmail, setErrorEmail] = useState(false); // State for email error
  const [submitted, setSubmitted] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const decodedEmail = Base64.decode(token && token !== null ? token : '');

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const handleEmail = (e) => {
    e.preventDefault();
    const isInvalidEmail = !formData.email.trim() || !validateEmail(formData.email);
  
    setErrorEmail(isInvalidEmail);
  
    if (!isInvalidEmail) {
      const encodedEmail = Base64.encode(formData.email);
      setSubmitted(true);
      navigate(`/auth?token=${encodedEmail}`);
    }
  }  

  return (
    <>
      {(!token && !submitted) ? (
        <>
          <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            Sign In
          </Typography>

          <Stack component="form" onSubmit={handleEmail} sx={{ p: 1 }}>
            <Grid item xs={12} sx={{ mb: 2.5}}>
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

            <Grid item xs={12} sx={{ mb: 1.5 }}>
              <Button 
                type="submit"
                variant="contained" 
                fullWidth 
                size="large"
              >
                Sign In
              </Button>
            </Grid>
          </Stack>
        </>
      ) : (
        <>
          {token && validateEmail(decodedEmail) && <VerifyUser email={decodedEmail} />}
        </>
      )}
    </>
  );
}
