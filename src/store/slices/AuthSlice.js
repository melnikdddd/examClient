import {createSlice} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";


const initialState = {
    token: null,
}

const AuthSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        setToken: (state, action) =>{
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        }
    },
})

export const  selectIsAuth = state => Boolean(state.auth.token);

export const {setToken, clearToken} = AuthSlice.actions;

export default AuthSlice.reducer;