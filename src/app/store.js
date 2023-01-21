import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';


import userReducer from '../features/users/UserSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: userReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})