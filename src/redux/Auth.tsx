import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthTokenState } from '../interfaces/AuthTokenState';

export const TOKEN_TIME_OUT = 1800*1000;

export const tokenSlice = createSlice({
    name: 'authToken',
    initialState: {
        authenticated: false,
        accessToken: null,
        expirationTime: null
    },
    reducers: {
        SET_TOKEN: (state: AuthTokenState, action: PayloadAction<string>) => {
            state.authenticated = true;
            state.accessToken = action.payload;
            state.expirationTime = new Date().getTime() + TOKEN_TIME_OUT;
        },
        DELETE_TOKEN: (state: AuthTokenState) => {
            state.authenticated = false;
            state.accessToken = null;
            state.expirationTime = null
        },
    }
})

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;