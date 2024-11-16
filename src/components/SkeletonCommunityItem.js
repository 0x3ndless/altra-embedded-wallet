// @mui
import { Card, CardHeader, CardContent, Avatar, Skeleton, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonCommunityItem() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
         
          <Skeleton variant="rectangular" sx={{ height: 300 }} animation="wave" />
          <CardContent>
            <Skeleton variant="text" width="80%" animation="wave" />
            <Skeleton variant="text" width="90%" animation="wave" />
            <Skeleton variant="text" width="70%" animation="wave" />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        {/* Placeholders for the tab-based content */}
        <Card>
          <Skeleton variant="rectangular" sx={{ height: 500 }} animation="wave" />
        </Card>
      </Grid>
    </Grid>
  );
}
