import React from 'react';
import { Box, Skeleton, Stack, Chip, Avatar } from '@mui/material';

export default function SkeletonQuestItem() {
  return (
    <Box sx={{ mt: 6, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
        <Skeleton variant="circular" width={160} height={160} />
      </div>

      <Skeleton variant="text" width="50%" sx={{ marginBottom: '1rem' }} />

      <Skeleton variant="text" width="30%" sx={{ marginBottom: '1rem' }} />

      <Stack alignItems="center" sx={{ marginBottom: '1rem' }}>
        <Chip
          avatar={<Skeleton variant="circular" width={24} height={24} />}
          variant="outlined"
          
          label={<Skeleton variant="text" width={80} />}
        />
      </Stack>
    </Box>
  );
}
