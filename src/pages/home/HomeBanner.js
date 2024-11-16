import React, { useState } from 'react';
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import './home.css';
import { MotionViewport, varFade } from '../../components/animate';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
}));


export default function HomeBanner() {

 

  return (
    <RootStyle>

      <Container component={MotionViewport}>
        <Box sx={{ textAlign: 'center', mb: 7, mt: 4 }}>
          <m.div variants={varFade().inUp}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <m.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity }} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    mb: 0,
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' }, 
                    fontWeight: 'bold',
                  }}
                >
                  <span className="title_keyword2">ALTRA </span>📧
                </Typography>
              </m.div>
            </Box>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              sx={{
                mx: 'auto',
                maxWidth: 630,
                mt: 1.5,
              }}
            >
              Your Crypto Wallet, Just an Email Away. Start your crypto journey effortlessly no experience needed, just seconds to get started!
            </Typography>
          </m.div>

          <Stack sx={{ mt: 3.5 }}>
            <m.div variants={varFade().inUp} sx={{ mb: 1 }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Powered by  
              </Typography>
            </m.div>

            <Stack direction="row" justifyContent="center" spacing={3} sx={{mt: 2 }}>
              <m.img variants={varFade().inUp} src="/icons/nillion.svg" width={60} />    
              <m.img variants={varFade().inUp} src="/icons/blockscout.svg" width={60} />     
            </Stack>
          </Stack>
        </Box>
      </Container>
    </RootStyle>
  );
}