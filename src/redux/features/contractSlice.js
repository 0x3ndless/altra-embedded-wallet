import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


//localstorage get access token
const local_access_token = localStorage.getItem('access_token');
const access_token = JSON.parse(local_access_token);
//----------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------

//Get current wallet's data

export const getWalletData = createAsyncThunk("contract/getWalletData", async () => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/embedded/wallet`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${access_token.token}`,
        },
    }).then((res) => 
    res.json()
    );
})

//-------------------------------------------------------------------------------------------------------------------

//Send Auth code

export const getAuthCode = createAsyncThunk("contract/getAuthCode", async ({email}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/auth`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            email: email,
        })
    }).then((res) => 
    res.json()
    );
})


//Verify Auth code

export const verifyAuthCode = createAsyncThunk("contract/verifyAuthCode", async ({authData}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            otp: authData.otp,
            token: authData.token
        })
    }).then((res) => 
    res.json()
    );
})


//Send Auth code for secret

export const getAuthCodeSecret = createAsyncThunk("contract/getAuthCodeSecret", async ({email}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/auth/secret`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            email: email,
        })
    }).then((res) => 
    res.json()
    );
})


//Verify Auth code for secret

export const verifyAuthCodeSecret = createAsyncThunk("contract/verifyAuthCodeSecret", async ({authData}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/auth/verify/secret`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            otp: authData.otp,
            token: authData.token
        })
    }).then((res) => 
    res.json()
    );
})


//-------------------------------------------------------------------------------------------------------------------
//Create Embedded wallet

export const createEmbeddedWallet = createAsyncThunk("contract/createEmbeddedWallet", async ({embeddedData}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/embedded`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            wallet: embeddedData.wallet,
            email: embeddedData.email,
            auth_share: embeddedData.auth_share,
            recovery_share: embeddedData.recovery_share
        })
    }).then((res) => 
    res.json()
    );
})


export const getEmbeddedData = createAsyncThunk("contract/getEmbeddedData", async ({embeddedData}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/embedded/recover`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${embeddedData.token}`,
        },
    }).then((res) => 
    res.json()
    );
});


export const updateEmbeddedData = createAsyncThunk("contract/updateEmbeddedData", async ({updatedEmbeddedData}) => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/embedded/wallet`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${updatedEmbeddedData.token}`,
            "x-auth-id": updatedEmbeddedData.id,
        },
        body: JSON.stringify({
            auth_share: updatedEmbeddedData.auth_share,
            recovery_share: updatedEmbeddedData.recovery_share
        })
    }).then((res) => 
    res.json()
    );
})



//---------------------------General API Calls-----------------------------------------------------

//Get all general chains list
export const getAllGeneralChains = createAsyncThunk("contract/getAllGeneralChains", async () => {
    return fetch(`${process.env.REACT_APP_EMBEDDED_API_URL}/api/general/chains`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
    }).then((res) => 
    res.json()
    );
});

//-------------------------------------------------------------------------------------------------------------------


const contractSlice = createSlice({
    name: "contract",
    initialState: {
        //User states
        error: null,
        walletData: [], //user details 
        loadingWallet: false,

        //Auth states
        authDetails: [],
        authCodeDetails: [],
        loadingAuth: false,

        //Embedded states
        loadingEmbedded: false,
        loadingUpdateEmbedded: false,
        embeddedDetails: [],

        //---------------------General APIs states-----------------------
        loadingGeneral: false,
        generalChains: [],
    },


    extraReducers: {

        //get wallet's data
        [getWalletData.pending]: (state, action) => {
            state.loadingWallet = true;
        },
        [getWalletData.fulfilled]: (state, action) => {
            state.loadingWallet = false;
            state.walletData = [action.payload];
        },
        [getWalletData.rejected]: (state, action) => {
            state.loadingWallet = false;
            state.error = action.payload;
        },

        //Send auth code
        [getAuthCode.pending]: (state, action) => {
            state.loadingAuth = true;
        },
        [getAuthCode.fulfilled]: (state, action) => {
            state.loadingAuth = false;
            state.authCodeDetails = [action.payload];
        },
        [getAuthCode.rejected]: (state, action) => {
            state.loadingAuth = false;
            state.error = action.payload;
        },

        //Verify auth code
        [verifyAuthCode.pending]: (state, action) => {
            state.loadingAuth = true;
        },
        [verifyAuthCode.fulfilled]: (state, action) => {
            state.loadingAuth = false;
            state.authDetails = [action.payload];
        },
        [verifyAuthCode.rejected]: (state, action) => {
            state.loadingAuth = false;
            state.error = action.payload;
        },

        //Send auth code for secret
        [getAuthCodeSecret.pending]: (state, action) => {
            state.loadingAuth = true;
        },
        [getAuthCodeSecret.fulfilled]: (state, action) => {
            state.loadingAuth = false;
            state.authCodeDetails = [action.payload];
        },
        [getAuthCodeSecret.rejected]: (state, action) => {
            state.loadingAuth = false;
            state.error = action.payload;
        },

        //Verify auth code for secret
        [verifyAuthCodeSecret.pending]: (state, action) => {
            state.loadingAuth = true;
        },
        [verifyAuthCodeSecret.fulfilled]: (state, action) => {
            state.loadingAuth = false;
            state.authDetails = [action.payload];
        },
        [verifyAuthCodeSecret.rejected]: (state, action) => {
            state.loadingAuth = false;
            state.error = action.payload;
        },


        //Create Embedded wallet
        [createEmbeddedWallet.pending]: (state, action) => {
            state.loadingEmbedded = true;
        },
        [createEmbeddedWallet.fulfilled]: (state, action) => {
            state.loadingEmbedded = false;
            state.embeddedDetails = [action.payload];
        },
        [createEmbeddedWallet.rejected]: (state, action) => {
            state.loadingEmbedded = false;
            state.error = action.payload;
        },

        //get embedded data
        [getEmbeddedData.pending]: (state, action) => {
            state.loadingEmbedded = true;
        },
        [getEmbeddedData.fulfilled]: (state, action) => {
            state.loadingEmbedded = false;
            state.embeddedDetails = [action.payload];
        },
        [getEmbeddedData.rejected]: (state, action) => {
            state.loadingEmbedded = false;
            state.error = action.payload;
        },

        //Update embedded data
        [updateEmbeddedData.pending]: (state, action) => {
            state.loadingUpdateEmbedded = true;
        },
        [updateEmbeddedData.fulfilled]: (state, action) => {
            state.loadingUpdateEmbedded = false;
            state.embeddedDetails = [action.payload];
        },
        [updateEmbeddedData.rejected]: (state, action) => {
            state.loadingUpdateEmbedded = false;
            state.error = action.payload;
        },

        //get all general chains list 
        [getAllGeneralChains.pending]: (state, action) => {
            state.loadingGeneral = true;
        },
        [getAllGeneralChains.fulfilled]: (state, action) => {
            state.loadingGeneral = false;
            state.generalChains = [action.payload];
        },
        [getAllGeneralChains.rejected]: (state, action) => {
            state.loadingGeneral = false;
            state.error = action.payload;
        },

    }
})


export default contractSlice.reducer;