import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {sub} from 'date-fns';
import axios from 'axios';

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
    try {
        const response = await axios.get(POSTS_URL);
        return response.data;
    } catch(err) {
        return err.message;
    }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async(initialPost) => {
    try {
        const response = await axios.post(POSTS_URL, initialPost);
        return response.data;
    } catch(err) {
        return err.message;
    }
})

export const updatePost = createAsyncThunk('posts/updatePost', async(initialPost) => {
    const {id} = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
        return response.data;
    } catch(err) {
        // return err.message;
        return initialPost;
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async(initialPost) => {
    const {id} = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        if(response?.status === 200) return initialPost;
        return `${response?.status} : ${response?.statusText}`
    } catch(err) {
        return err.message;
    }
})

const PostSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state,action) {
            const {postId, reaction} =  action.payload;
            console.log(action.payload);
            const existingPost = state.entities[postId];
            if(existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
        increaseCount(state, action) {
            state.count+= 1;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), {minutes: min++}).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled,(state,action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                // const sortedPosts = state.posts.sort((a, b) => {
                //     if (a.id > b.id) return 1
                //     if (a.id < b.id) return -1
                //     return 0
                // })
                action.payload.id = state.ids[state.ids.length - 1] + 1;
                // End fix for fake API post IDs 
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload);
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state,action) => {
                if(!action.payload?.id) {
                    console.log('Update did not complete');
                    console.log(action.payload);
                    return
                };
                action.payload.date = new Date().toISOString();
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log('Delete did not complete');
                    console.log(action.payload);
                    return
                };

                const {id} = action.payload;
                postsAdapter.removeOne(state, id);
            })
    }
    
})

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const getPostStatus = (state) => state.posts.status;
export const postError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;


export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)

export const {increaseCount, reactionAdded} = PostSlice.actions;

export default PostSlice.reducer