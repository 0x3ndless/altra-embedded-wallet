import React from 'react';
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Link, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import './home.css';
import { MotionViewport, varFade } from '../../components/animate';
import Auth from '../Auth';

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


const emojis = [
  '📧','📨','💲','⛓️‍💥','📧','📨','💲','⛓️‍💥'
];

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export default function HomeBanner() {

  const shuffledEmojis = shuffleArray([...emojis]);

  return (
    <RootStyle>

      <ul className="emoji">
        {shuffledEmojis.map((emoji, index) => (
          <li key={index} style={{ animationDuration: `${10 + Math.random() * 10}s` }}>
            {emoji}
          </li>
        ))}
      </ul>

      <Container component={MotionViewport}>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
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
              <strong>Your Crypto Wallet, Just an Email Away.</strong> Start your crypto journey effortlessly no experience needed, just seconds to get started!
            </Typography>
          </m.div>

          <Stack sx={{ mt: 3.5 }}>
            <m.div variants={varFade().inUp} sx={{ mb: 1 }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Powered by  
              </Typography>
            </m.div>

            <Stack direction="row" justifyContent="center" spacing={3} sx={{mt: 2 }} >
              <Link href={`https://nillion.com/`} target="_blank" rel="noopener">
                <m.img variants={varFade().inUp} src="/icons/nillion.png" width={70} />    
              </Link>
              <Link href={`https://www.blockscout.com/`} target="_blank" rel="noopener">
                <m.img variants={varFade().inUp} src="/icons/blockscout.png" width={110} />      
              </Link> 
            </Stack>

            <m.div variants={varFade().inUp}>
              <Auth />
            </m.div>
            
          </Stack>
        </Box>

      </Container>
    </RootStyle>
  );
}