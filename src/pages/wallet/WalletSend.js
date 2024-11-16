import React, { useState } from 'react';
import { useBalance } from 'wagmi';
import { ethers } from 'ethers';
//---------------MUI---------------------------------
import { Button, CardContent, Grid, InputAdornment, TextField, Stack, Typography, Link } from '@mui/material';
import Iconify from '../../components/Iconify';
//--------------Redux--------------------------------
import { useSelector } from 'react-redux';
import { createSigner } from '../authentication/SignerUtils';
//---------------Lottie-------------------------------
import Lottie from 'react-lottie';
import loadingAnimation from '../../animations/loading.json';
import failedAnimation from '../../animations/failed.json';
import successAnimation from '../../animations/success.json';

const WalletSend = () => {


  //--------------------------------------------------------------
    const loadingAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const failedAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: failedAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const successAnimationOptions = {
      loop: true,
      autoplay: true,
      animationData: successAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };


    const { walletData } = useSelector((state) => ({...state.app}));

    const balanceData = useBalance({
      address: walletData && walletData[0] && walletData[0]?.wallet,
      unit: 'ether',
      watch: true,
      enabled: Boolean(walletData && walletData[0]?.wallet)
    })

    const currentBalance = balanceData.data?.formatted || '0.000'

    const isValidEVMAddress = (address) => {
      if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
          return false; // Does not match Ethereum address pattern
      }
      return true;
    }

    //Getting the active chain ID
    const localDefaultConnector = localStorage.getItem('default_connector');
    const parsedDefaultConnector = JSON.parse(localDefaultConnector);
    const chainId = parsedDefaultConnector && parsedDefaultConnector?.chainID;

    //Email form
    const [formData, setFormData] = useState({send_to: '', amount: ''});
    const [isAddressValid, setIsAddressValid] = useState(true); // State to track address validity

    //Transaction states
    const [loading, setLoading] = useState(false);
    const [transactionVerified, setTransactionVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [transaction, setTransaction] = useState('');

    const handleAddressChange = (event) => {
      const address = event.target.value;
      setFormData({...formData, send_to: address});
      setIsAddressValid(isValidEVMAddress(address));
    }

    const handleSend = async (e) => {

      e.preventDefault();

      //Creating the threshold shares
      const embeddedDetails = JSON.parse(localStorage.getItem('embedded_wallet'));
      const device_share = embeddedDetails?.device_share
      const shares = [walletData && walletData[0] && walletData[0]?.auth_share, device_share];

      //Creating a signer using the reconstructed private key
      const signer = await createSigner(shares, chainId);

      //Transaction states
      const recipientAddress = formData.send_to;
      const amountInWei = ethers.utils.parseUnits(formData.amount, 'ether');

      try {

        setLoading(true);
        
        setMessage('Please wait, processing transaction...');
          
        // Sending funds to recipient
          const tx = await signer.sendTransaction({
              to: recipientAddress,
              value: amountInWei,
          });

          const receipt = await tx.wait();

          const transactionHash = receipt.transactionHash;
          setTransaction(transactionHash)
          setTransactionVerified(true);
          setMessage('Transaction successful!! 🎉');

      } catch (error) {
        console.error('Error sending Ether:', error);
        setTransaction('');
        setMessage('Transaction failed!! 😭');
        setLoading(false);
        setTransactionVerified(false);
      }
  }

  return (
    <div >
    {transactionVerified || loading ? 
    <>
      <Stack sx={{ p: 1 }}>
          <>
          {message === 'Transaction failed!! 😭' ? 
            <Lottie options={failedAnimationOptions} height={100} width={100} />
            : message === 'Transaction successful!! 🎉' ?
            <Lottie options={successAnimationOptions} height={100} width={100} />
            :
            <Lottie options={loadingAnimationOptions} height={100} width={100} />
          }

          <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center',mt: 1, color: 'text.secondary' }}>
            {message}
          </Typography>
            {message === 'Transaction successful!! 🎉' &&
            <>
            <Link sx={{textAlign: 'center'}} href={ chainId === 80002 ? `https://amoy.polygonscan.com/tx/${transaction}` : chainId === 84532 ? `https://base-sepolia.blockscout.com/tx/${transaction}` : `` } target="_blank" rel="noopener" style={{ textDecoration: 'none', fontWeight: 'bold' }} > View Txn<Iconify icon={'majesticons:open'} sx={{verticalAlign: 'middle', ml: 0.5}}/></Link>
            </>
            }
          </>    
      </Stack>
    </>
    :
      <form onSubmit={handleSend}> 
      <Grid container spacing={2.5} sx={{mt: 1}}>

      <Grid item xs={12}>
          <TextField sx={{ input: { cursor: 'not-allowed' } }} label="Token" variant="outlined" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon={chainId === 80002 ? "cryptocurrency-color:matic" : chainId === 84532 ? 'token:base' : 'healthicons:question-mark-outline'} sx={chainId === 84532 ? {color: 'primary.main'} : {}} /></InputAdornment>, readOnly: true }} value={`${chainId === 80002 ? 'MATIC' : chainId === 84532 ? 'ETH' : 'ETH'} (${parseFloat(Number(currentBalance)).toFixed(3)})`}/>
      </Grid>

      <Grid item xs={12}>
          <TextField required label="Send to" placeholder="0x0...7f89" id="send_to" variant="outlined" fullWidth autoComplete="off" onChange={handleAddressChange} value={formData.send_to} error={!isAddressValid} helperText={!isAddressValid ? "Invalid wallet address" : ""} />
      </Grid>

      <Grid item xs={12}>
          <TextField required InputProps={{ endAdornment: <InputAdornment position="end">{chainId === 80002 ? 'MATIC' : chainId === 84532 ? 'ETH' : 'ETH'}</InputAdornment> }} type='number' label="Amount" placeholder="0.05" id="amount" variant="outlined" fullWidth autoComplete="off" onChange={e => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
      </Grid>

      <Grid item xs={12}>
        <Button type='submit' disabled={!isAddressValid || formData.amount === '0'} variant='contained' size='large' fullWidth>Send</Button>
      </Grid>
      </Grid>
    </form>
    }
  </div>
  )
}

export default WalletSend