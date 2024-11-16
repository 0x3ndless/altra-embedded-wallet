// @mui
import { Card, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonSettingsItem() {
  return (
    <Card>
      <Skeleton variant="rectangular" sx={{ paddingTop: '100%' }} />
    </Card>
  );
}
