import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cards", "SavedCards"],
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
        url: `user_posts/${id}?page=${page}`,
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
    getMySavedCards: builder.query<any, { page: number }>({
      query: ({ page }) => ({
        url: `saved_posts?page=${page}`,
        method: "GET",
      }),
      providesTags: ["SavedCards"],
    }),
    getUserSavedCards: builder.query<any, { page: number; id: string }>({
      query: ({ page, id }) => ({
        url: `saved_posts/${id}?page=${page}`,
        method: "GET",
      }),
      providesTags: ["SavedCards"],
    }),
  }),
});

export const {
  useLazyGetCardsQuery,
  useLazyGetMyCardsQuery,
  useLazyGetUserCardsQuery,
  useSetLikeToCardMutation,
  useGetCardQuery,
  useCreationCardMutation,
  useSaveCardMutation,
  useLazyGetMySavedCardsQuery,
  useLazyGetUserSavedCardsQuery,
} = cardsApi;
