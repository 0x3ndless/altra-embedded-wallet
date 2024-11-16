import React from 'react';
import { Card, Skeleton } from '@mui/material';
import useResponsive from '../hooks/useResponsive';

export default function SkeletonGateItem() {
  const isDesktop = useResponsive('up', 'lg');
  return (
    <Card sx={{ mt: isDesktop ? 6 : 'unset', }}>
      <Skeleton variant="rectangular" sx={{ paddingTop: '100%' }}/>
    </Card>
  );
}
