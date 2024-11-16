import React from 'react'  
// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import HomeBanner from './home/HomeBanner';


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

        </ContentStyle>
     
    </Page>
  );
}
