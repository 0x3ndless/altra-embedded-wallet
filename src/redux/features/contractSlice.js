import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


//localstorage get access token
const local_access_token = localStorage.getItem('access_token');
const access_token = JSON.parse(local_access_token);
//----------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------


const contractSlice = createSlice({
    name: "contract",
    initialState: {
       
    },


    extraReducers: {

        
    }
})


export default contractSlice.reducer;