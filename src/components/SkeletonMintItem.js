import React from 'react';
import { Card, Grid, Container, Skeleton } from '@mui/material';

export default function SkeletonMintItem() {
  return (
    <Card sx={{ mt: 6 }}>
      <Grid container>
        <Grid item xs={12} md={6} lg={6}>
          <Skeleton variant="rectangular" sx={{ paddingTop: '100%' }} />
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Container maxWidth="md">
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" sx={{ width: '50%', height: 40, mb: 2 }} />
          </Container>
        </Grid>
      </Grid>
    </Card>
  );
}
