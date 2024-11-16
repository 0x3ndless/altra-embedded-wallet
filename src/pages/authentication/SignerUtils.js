import { ethers } from 'ethers';
import { reconstructPrivateKey } from './WalletUtils';


// Function to create a signer for signing the transactions
export const createSigner = async (shares, chainId) => {
  try {

    // Reconstructing the private key
    const privateKey = await reconstructPrivateKey(shares);

    // Creating a wallet using the private key
    const wallet = new ethers.Wallet(privateKey);

    // Creating a provider with the specified chain ID
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_MUMBAI_RPC_URL, { chainId });

    // Connecting the wallet to the provider
    const signer = wallet.connect(provider);

    return signer;
  } catch (error) {
    console.error('Error creating signer:', error);
    throw error;
  }
};

// Function to sign a transaction using the signer
export const signTransaction = async (signer, domain, types, voucher) => {
  try {

    // Signing the typed data using EIP-712
    const signature = await signer._signTypedData(domain, types, voucher);

    return signature;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
};
