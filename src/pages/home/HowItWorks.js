import React, { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { Box, Typography, Button, Collapse } from '@mui/material';
import { varFade } from '../../components/animate';

const HowItWorks = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <m.div variants={varFade().inUp}>
    <Box sx={{ p: 4.5, mb: 3.5, textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2"><span className="title_keyword2">How it works</span></Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ mb: 2 }}>
          A public/private key pair is generated, encrypted, and then split using the <strong>Shamir's Secret Sharing (SSS)</strong> cryptographic algorithm.{expanded && ' The resulting shares are stored in three different locations to eliminate any single point of failure. This ensures that no single entity can access the private key without meeting the required threshold of shares. The recovery share remains untouched unless a new device is used for login. It is securely stored using the Nillion Secret Storage API on the Nillion network.'}
        </Typography>

        <Button 
          onClick={() => setExpanded(!expanded)}
          sx={{ mb: 5 }}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </Button>
      </m.div>

      <m.div variants={varFade().inUp}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <m.img 
                variants={varFade().inUp} 
                src="/assets/altra-diagram.png" 
                alt="How Altra Works"
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '50px' }}
              />
            </Box>
          </m.div>
    </Box>
  </m.div>
  )
}

export default HowItWorks