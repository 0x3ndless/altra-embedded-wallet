import React from 'react';
//---------------MUI---------------------------------
import { Grid, Stack, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';

const WalletReceive = ({ address }) => {
  return (
    <div>
      <Grid container spacing={2.5} sx={{mt: 1}}>
        <Grid item xs={12}>
          <Stack spacing={2} alignItems="center">
            <QRCode 
              value={address || ''}
              size={200}
              level="H"
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {address}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Scan this QR code to get the wallet address
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </div>
  )
}

export default WalletReceive