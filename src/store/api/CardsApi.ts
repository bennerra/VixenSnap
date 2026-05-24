import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";
import { CommentResponse } from "@/models/IComments";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cards", "SavedCards", "Comments"],
  endpoints: (builder) => ({
    getCards: builder.query<any, { page: number; searchValue: string }>({
      query: ({ page, searchValue }) => ({
        url: `posts?page=${page}&searchValue=${searchValue}`,
        method: "GET",
      }),
      providesTags: ["Cards"],
    }),
    getMyCards: builder.query<any, { page: number }>({
      query: ({ page }) => ({
        url: `my_posts?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Cards"],
    }),
    getUserCards: builder.query<any, { page: number; id: string }>({
      query: ({ page, id }) => ({
        url: `user_posts/?page=${page}&username=${id}`,
        method: "GET",
      }),
      providesTags: ["Cards"],
    }),
    getCard: builder.query<any, { id: string }>({
      query: (credentials) => ({
        url: `posts/${credentials.id}/`,
        method: "GET",
      }),
    }),
    setLikeToCard: builder.mutation<any, { id: string }>({
      query: (credentials) => ({
        url: `posts/like/${credentials.id}/`,
        method: "POST",
      }),
    }),
    creationCard: builder.mutation<any, FormData>({
      query: (credentials) => ({
        url: "posts/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Cards"],
    }),
    saveCard: builder.mutation<any, { id: string }>({
      query: (credentials) => ({
        url: `posts/save/${credentials.id}/`,
        method: "POST",
      }),
      invalidatesTags: ["SavedCards"],
    }),
    getUserSavedCards: builder.query<any, { page: number; id: string }>({
      query: ({ page, id }) => ({
        url: `saved_posts/?page=${page}&username=${id}`,
        method: "GET",
      }),
      providesTags: ["SavedCards"],
    }),
    addComment: builder.mutation<any, { post: string; text: string }>({
      query: (credentials) => ({
        url: `comments/`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Comments"],
    }),
    getComments: builder.query<CommentResponse, { id: string }>({
      query: ({ id }) => ({
        url: `comments/?post_id=${id}`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),
  }),
});

export const {
  useLazyGetCardsQuery,
  useLazyGetUserCardsQuery,
  useSetLikeToCardMutation,
  useGetCardQuery,
  useCreationCardMutation,
  useSaveCardMutation,
  useLazyGetUserSavedCardsQuery,
  useAddCommentMutation,
  useGetCommentsQuery,
} = cardsApi;
