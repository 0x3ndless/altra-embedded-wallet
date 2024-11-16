import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};



const Page = forwardRef(({ children, title = '', subtitle='', meta, ...other }, ref) => {
  
  const capitalizedTitle = capitalizeFirstLetter(title);
  const capitalizedSubTitle = capitalizeFirstLetter(subtitle);

  return (
    <>
      <Helmet>
        <title>{`${capitalizedTitle} | ${capitalizedSubTitle !== '' ? capitalizedSubTitle : 'Omnibal'}`}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
