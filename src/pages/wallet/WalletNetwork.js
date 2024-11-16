import React, { useState } from 'react'
import { Button, Stack } from '@mui/material'
import Iconify from '../../components/Iconify'
import Label from '../../components/Label'

const WalletNetwork = ({ chains }) => {
    
    const localDefaultConnector = localStorage.getItem('default_connector');
    const parsedDefaultConnector = JSON.parse(localDefaultConnector);
    const [activeChainID, setActiveChainID] = useState(parsedDefaultConnector?.chainID || null);

    const handleChangeNetwork = (id) => {
        const defaultItem = {
            chainID: id
        };
        localStorage.setItem('default_connector', JSON.stringify(defaultItem));
        setActiveChainID(id); 
    }

    return (
        <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            {chains && chains.map((item) => (
                <Button
                    key={item.id}
                    onClick={() => handleChangeNetwork(item.id)}
                    startIcon={<Iconify icon={item.icon} />}
                    size='large'
                    fullWidth
                    sx={{ mb: 1, justifyContent: 'flex-start' }}
                >
                    {item.name} {activeChainID === item.id && <Label sx={{ ml: 0.8 }} color='success'>Active</Label>}
                </Button>
            ))}
        </Stack>
    );
};

export default WalletNetwork;
