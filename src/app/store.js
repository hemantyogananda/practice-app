import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import postReducer from '../features/posts/PostSlice';
import userReducer from '../features/users/UserSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        posts: postReducer,
        users: userReducer
    }
})