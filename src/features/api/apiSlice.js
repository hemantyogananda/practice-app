import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500'}),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getToDos: builder.query({
            query: () => '/todos',
            transformResponse: res => res.sort((a,b) => b.id - a.id),
            providesTags: ['Todos']
        }),
        addToDo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        updateToDo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteToDo: builder.mutation({
            query: ({id}) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Todos']
        })
    })
})

export const {
    useGetToDosQuery,
    useAddToDoMutation,
    useUpdateToDoMutation,
    useDeleteToDoMutation
} = apiSlice