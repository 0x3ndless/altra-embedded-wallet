import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Avatar, Tooltip } from '@mui/material';
// components
import { IconButtonAnimate } from '../../components/animate';
import Iconify from '../../components/Iconify';
// ----------------------------------------------------------------------

export default function Rewards() {

  return (
    <>
    <Tooltip title="Rewards">
      <IconButtonAnimate sx={{p: 0,}} component={RouterLink} to="/rewards">
       <Avatar sx={{ border: '1px dotted', borderColor: 'text.secondary', background: 'transparent', borderRadius: '50%' }}><Iconify icon="fxemoji:gem" /></Avatar>
      </IconButtonAnimate>
    </Tooltip>
    </>
  );
}
