import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Typography} from '@mui/material';
//css from home
import './logo.css';
// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {


  const logo = (
    <Box sx={{ flexGrow: 1, width: 35, height: 35, display: 'flex', ...sx  }}>
          <img src="/favicon/logo.png" />
          <Typography variant="h6" gutterBottom sx={{ ml: 0, pt: 0.7,}}><span className="title_keyword2">Omnibal</span></Typography>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }
  return <RouterLink to="/" style={{ textDecoration: 'none'}}>{logo}</RouterLink>;
}
