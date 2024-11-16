import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBalance } from 'wagmi'
//---------------Mui -----------------
import { Divider, Link, Box, Typography, CardContent, Avatar, Button, Tooltip, CircularProgress } from "@mui/material";

import Iconify from '../components/Iconify';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getAllGeneralChains, getWalletData } from '../redux/features/contractSlice';
import WalletNetwork from './wallet/WalletNetwork';
import Label from '../components/Label';
import WalletSettings from './wallet/WalletSettings';
import WalletSend from './wallet/WalletSend';
import WalletReceive from './wallet/WalletReceive';


const Wallet = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loadingWallet, walletData, generalChains } = useSelector((state) => ({...state.app}));

    const balanceData = useBalance({
        address: walletData && walletData[0] && walletData[0]?.wallet,
        unit: 'ether'
    })

    //--------------------Feature states----------------------
    const [showNetworkList, setShowNetworkList] = useState(false); 

    const handleNetworkListBack = () => {
        setShowNetworkList(false);
    };

    const findActiveChain = (chains) => {

        const localDefaultConnector = localStorage.getItem('default_connector');
        const parsedDefaultConnector = JSON.parse(localDefaultConnector);
        const chainID = parsedDefaultConnector?.chainID;
        
        if (chains) {
            for (const chain of chains) {
                if (chain.id === chainID) {
                    return chain;
                }
            }
        }
        
        return null; 
    };

    const activeChainID = findActiveChain(generalChains && generalChains[0]);


    //----------------------Settings------------------------------------------

    const [showSettingsList, setShowSettingsList] = useState(false); 

    const handleSettingsListBack = () => {
        setShowSettingsList(false);
    };
    
    //-----------------------Send---------------------------------------------

    const [showSendFunds, SetShowSendFunds] = useState(false); 

    const handleShowFundsBack = () => {
        SetShowSendFunds(false);
    };

    //-----------------------Receive---------------------------------------------

    const [showReceiveFunds, setShowReceiveFunds] = useState(false);

    const handleShowReceiveBack = () => {
        setShowReceiveFunds(false);
    };
    
    //--------------Copy token ID ---------------------
    const [copied, setCopied] = useState(false);

    const handleCopyTokenID = () => {
        const walletText = walletData && walletData[0] && walletData[0]?.wallet;
        if (walletText) {
            // Creating a temporary textarea element
            const textarea = document.createElement('textarea');
            textarea.value = walletText;
            // Making the textarea invisible
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };


    const handleLogOut = () => {
        localStorage.removeItem('access_token');
        navigate('/auth');
        window.location.reload();

      }
    
    

    const fetchWallet = () => {
        dispatch(getWalletData());
        dispatch(getAllGeneralChains());
    }
    
    useEffect(() => {
        fetchWallet();
    }, []);


    if (localStorage.getItem('access_token') === null) {
        return <Navigate to="/" />;
    }


  return (
    <>

    {loadingWallet ? 

        <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 3, mb: 3 }} />

        :

        <CardContent>
        <>
        {showNetworkList ?

        <>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={handleNetworkListBack} sx={{ minWidth: 0 }}>
                    <Iconify icon="material-symbols:arrow-back" sx={{ color: 'text.disabled' }} height={22} width={22} />
                </Button> 
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                    Select Network
                </Typography>
                <Button disabled />
            </div>

            <WalletNetwork chains={generalChains && generalChains[0]} />
        
        </>
            
        :  showSettingsList ?

        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={handleSettingsListBack} sx={{ minWidth: 0 }}>
                    <Iconify icon="material-symbols:arrow-back" sx={{ color: 'text.disabled' }} height={22} width={22} />
                </Button> 
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                    Settings
                </Typography>
                <Button disabled />
            </div>

            <WalletSettings email={walletData && walletData[0] && walletData[0]?.email}  />
        </>

        : showSendFunds ?

        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={handleShowFundsBack} sx={{ minWidth: 0 }}>
                    <Iconify icon="material-symbols:arrow-back" sx={{ color: 'text.disabled' }} height={22} width={22} />
                </Button> 
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                    Send Funds
                </Typography>
                <Button disabled />
            </div>

            <WalletSend />
        </>

        : showReceiveFunds ?

        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={handleShowReceiveBack} sx={{ minWidth: 0 }}>
                    <Iconify icon="material-symbols:arrow-back" sx={{ color: 'text.disabled' }} height={22} width={22} />
                </Button> 
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                    Receive Funds
                </Typography>
                <Button disabled />
            </div>

            <WalletReceive address={walletData && walletData[0] && walletData[0]?.wallet} />
        </>

        :

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

                <>

                <Avatar sx={{ border: '1px dotted', borderColor: 'text.secondary', background: 'transparent', borderRadius: '50%', mb: 1 }}><Iconify icon={'ic:sharp-alternate-email'} /></Avatar>

                <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, cursor: 'pointer' }}>
                    <Tooltip title="Copy" placement='right'>
                    <span onClick={handleCopyTokenID} style={{ display: 'inline-flex', alignItems: 'center', }}>
                        {copied ? "Copied" : `${walletData && walletData[0] && walletData[0]?.wallet.substr(0, 5)}...${walletData && walletData[0] && walletData[0]?.wallet.substr(-5)}`}
                        <Iconify icon={copied ? 'mdi:success-circle-outline' : 'mingcute:copy-2-line'} sx={{verticalAlign: 'middle', ml: 0.5}}/>
                    </span>
                    </Tooltip>
                </Typography>

                <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, color: 'text.secondary' }}>
                    {balanceData && balanceData.data ? 
                    <>
                    {balanceData.data?.formatted && parseFloat(Number(balanceData.data?.formatted)).toFixed(3)} {balanceData && balanceData.data?.symbol}
                    </>
                    :
                    <>0.000</>
                    } 
                </Typography>

                <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
                    {walletData && walletData[0] && walletData[0]?.email}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button onClick={() => SetShowSendFunds(true)} variant='outlined' startIcon={<Iconify icon="tabler:send" />}>Send</Button>
                    <Button onClick={() => setShowReceiveFunds(true)} variant='outlined' startIcon={<Iconify icon="mdi:qrcode-scan" />}>Receive</Button>
                </Box>
                 
                </>

                <Divider sx={{ m: 1, width: '100%' }} />
            {activeChainID &&
             <Button onClick={() => setShowNetworkList(true)}  startIcon={<Iconify icon={activeChainID.icon} />} size='large' fullWidth sx={{mb: 1, justifyContent: 'flex-start'}}>{activeChainID.name} <Label sx={{ml: 0.8}} color='success'>Active</Label></Button>}
             <Button component={Link} target="_blank"  rel="noopener noreferrer" href={activeChainID?.id === 80002 ? `https://amoy.polygonscan.com/address/${walletData && walletData[0] && walletData[0]?.wallet}` : activeChainID?.id === 84532 ? `https://base-sepolia.blockscout.com/address/${walletData && walletData[0] && walletData[0]?.wallet}` : `https://etherscan.io/address/${walletData && walletData[0] && walletData[0]?.wallet}`} startIcon={<Iconify icon="la:list" />} size='large' fullWidth sx={{mb: 1, justifyContent: 'flex-start'}}>Transactions</Button>
             <Button onClick={() => setShowSettingsList(true)} startIcon={<Iconify icon="material-symbols:settings-outline" />} size='large' fullWidth sx={{mb: 1, justifyContent: 'flex-start'}}>Settings</Button>
             <Button onClick={() => handleLogOut()} startIcon={<Iconify icon="mdi:logout" />} size='large' fullWidth sx={{mb: 1, justifyContent: 'flex-start'}}>Sign out</Button>
            </Box>
            }
            </>
        </CardContent>
    }

    </>
  );
};

export default Wallet;