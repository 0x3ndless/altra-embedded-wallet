import { Base64 } from 'js-base64';
//----------------------------------------------------------
const ethers = require('ethers');
const CryptoJS = require('crypto-js');
const { split, combine } = require('shamir-secret-sharing');


//-----------------------Encoding and Decoding a Uint8Array to Base64 string ---------------------------------

const encodeUint8ArrayToBase64 = (uint8Array) => {
    return Base64.fromUint8Array(uint8Array);
};
  
const decodeBase64ToUint8Array = (base64String) => {
    return Base64.toUint8Array(base64String);
};
//------------------------------------------------------------------------------------------------------------


//-----------------------Generating wallet -------------------------------------------------------------------

export const generateWallet = async () => {
  try {

    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;

    // Encrypting the private key
    const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, process.env.REACT_APP_ENCRYPTION_KEY).toString();

    // Splitting the encrypted private key into shares using SSS
    const encryptedPrivateKeyUint8Array = new TextEncoder().encode(encryptedPrivateKey);
    const shares = await split(encryptedPrivateKeyUint8Array, 3, 2);

    //Encoding the Uint8Array to Base64
    const encodedShares = shares.reduce((acc, share, index) => {
        const name = (index === 0) ? 'auth_share' : (index === 1) ? 'device_share' : 'recovery_share';
        return { ...acc, [name]: encodeUint8ArrayToBase64(share) };
    }, {});
    

    return {
      publicKey: wallet.address,
      shares: encodedShares
    };

  } catch (error) {
    console.error('Error generating wallet:', error);
    throw error;
  }
};


//------------------------ Reconstructing Encrypted private key ----------------------------------------------

export const reconstructPrivateKey = async (shares) => {
  try {

    //Decoding the Base64 to Uint8Array
    const decodedShares = shares.map(encodedShare => decodeBase64ToUint8Array(encodedShare));

    // Combining the shares to reconstruct the encrypted private key
    const reconstructedPrivateKeyUint8Array = await combine(decodedShares);

    // Converting the Uint8Array back to the key
    const reconstructedPrivateKey = new TextDecoder().decode(reconstructedPrivateKeyUint8Array);

    //Decrypting the reconstructed private key
    const bytes = CryptoJS.AES.decrypt(reconstructedPrivateKey, process.env.REACT_APP_ENCRYPTION_KEY);
    const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPrivateKey;

  } catch (error) {
    console.error('Error reconstructing private key:', error);
    throw error;
  }
};

//---------------------------------------Reconstruct Device share---------------------------------------------

export const reconstructDeviceShare = async (embedded_results) => {

  // Getting Nillion API URL and App ID from environment variables
  const Nillion_API_URL = process.env.REACT_APP_NILLION_API_URL;
  const ALTRA_APP_ID = process.env.REACT_APP_ALTRA_APP_ID;
  
  try {
    if (!embedded_results) {
      throw new Error('Embedded results are undefined');
    }


     // Get user seed using Nillion API for existing user
     const response = await fetch(`${Nillion_API_URL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': ALTRA_APP_ID
      },
      body: JSON.stringify({
        nillion_seed: embedded_results.wallet,
      }),
    });
    const user = await response.json();

    // Retrieve the recovery share using the store ID to reconstruct the device share
    const recoveryShareResponse = await fetch(
      `${process.env.REACT_APP_NILLION_API_URL}/api/secret/retrieve/${embedded_results.recovery_share}?retrieve_as_nillion_user_seed=${user.nillion_user_id}&secret_name=recovery_share`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const recoveryShare = await recoveryShareResponse.json();

    const shares = [embedded_results.auth_share, recoveryShare?.secret];

    //Decoding the Base64 to Uint8Array
    const decodedShares = shares.map(encodedShare => decodeBase64ToUint8Array(encodedShare));

    // Combining the shares to reconstruct the encrypted private key
    const reconstructedPrivateKeyUint8Array = await combine(decodedShares);

    // Splitting the encrypted private key into new shares using SSS
    const newShares = await split(reconstructedPrivateKeyUint8Array, 3, 2);

    //Encoding the Uint8Array to Base64
    const encodedShares = newShares.reduce((acc, share, index) => {
      const name = (index === 0) ? 'auth_share' : (index === 1) ? 'device_share' : 'recovery_share';
      return { ...acc, [name]: encodeUint8ArrayToBase64(share) };
    }, {});

    return {
      shares: encodedShares
    };
  } catch (error) {
    console.error('Error reconstructing device share:', error);
    throw error;
  }
};