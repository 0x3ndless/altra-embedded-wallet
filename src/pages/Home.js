import React from 'react'  
// @mui
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
// components
import Page from '../components/Page';
// sections
import HomeBanner from './home/HomeBanner';
import HowItWorks from './home/HowItWorks';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100vh',
}));

// ----------------------------------------------------------------------

export default function Home() {

  return (
    <Page title="An email wallet">
     
        <ContentStyle>

          <HomeBanner />

          <Divider sx={{ my: 5 }} />

          <HowItWorks />

        </ContentStyle>
     
    </Page>
  );
}
