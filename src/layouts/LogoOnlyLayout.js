import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi'
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Avatar, Link } from '@mui/material';
// components
import Logo from '../components/Logo';
// ----------------------------------------------------------------------
import Iconify from '../components/Iconify';
//----------------------------------------------------------------
import AccountPopover from '../layouts/header/AccountPopover';
import Rewards from '../layouts/header/Rewards';



const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  },
  display: 'flex',
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: '10px',
}));




// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {

  const { isConnected } = useAccount();


  return (
    <>
      <HeaderStyle>
        <Logo /> 
        

        <>
        {isConnected ? 
        <>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Rewards />
          <AccountPopover />
        </Stack>
        </> 
        : 
        <>
        <Stack direction="row" spacing={1}>
          <Avatar component={Link}href="https://twitter.com/omnibalapp"target="_blank"rel="noopener" sx={{ border: '0.01em solid',  color: '#ff3c4b', background: 'transparent', borderRadius: '50%', width: 34, height: 34 }}><Iconify icon={'tabler:brand-x'} width={20} height={20} /></Avatar>
          <Avatar component={Link}href="https://discord.gg/7gBMZgUnmm"target="_blank"rel="noopener" sx={{ border: '0.01em solid',  color: '#ff3c4b', background: 'transparent', borderRadius: '50%', width: 34, height: 34 }}><Iconify icon={'ic:baseline-discord'} width={20} height={20} /></Avatar>  
        </Stack>
        </>
        }
    </>
  

      </HeaderStyle>
      <Outlet />
    </>
  );
}
