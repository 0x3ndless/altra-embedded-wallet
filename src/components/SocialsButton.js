import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Button, Tooltip, IconButton, Avatar } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

SocialsButton.propTypes = {
  initialColor: PropTypes.bool,
  links: PropTypes.objectOf(PropTypes.string),
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export default function SocialsButton({ initialColor = false, simple = true, links = {}, sx, ...other }) {
  const SOCIALS = [
    {
      name: 'Twitter',
      socialColor: '#000000',
      path: links.twitter,
    },
    {
      name: 'Discord',
      icon: 'ri:discord-fill',
      socialColor: '#5865F2',
      path: links.discord,
    },
    {
      name: 'Website',
      icon: 'ri:global-line',
      socialColor: '#637381',
      path: links.website,
    },
  ];

  const filteredSocials = SOCIALS.filter((social) => social.path);

  return (
    <>
      {filteredSocials.map((social) => {
        const { name, icon, path, socialColor } = social;
        return simple ? (
          <Link key={name} href={path} target="_blank" rel="noopener noreferrer">
            <Tooltip title={name} placement="bottom">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                {name === 'Twitter' ?
                <Avatar src="/icons/twitter_dark.svg" sx={{width: 20, height: 20}} />
                :
              <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              }
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                '&:hover': {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      })}
    </>
  );
}
