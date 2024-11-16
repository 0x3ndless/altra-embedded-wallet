import React, { useState } from 'react'
import { Button, Stack } from '@mui/material'
import Iconify from '../../components/Iconify';
import ExportKey from './settings/ExportKey';

const WalletSettings = ({email}) => {

    //----------------------Settings Export key------------------------------------------

    const [showExportKey, setShowExportKey] = useState(false); 

    return (
    <>
        {showExportKey ?

        <>
            <ExportKey email={email && email}/>
        </>
        
        :
        
        <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setShowExportKey(true)} startIcon={<Iconify icon={'basil:key-outline'} />} size='large' fullWidth sx={{ mb: 1, justifyContent: 'flex-start', textTransform: 'none' }} >
              Export private key
            </Button>
        </Stack>
        }
    </>
    );
};

export default WalletSettings;
