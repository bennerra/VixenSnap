import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cards"],
  endpoints: (builder) => ({
    getCards: builder.query<any, { page: number }>({
      query: ({ page }) => ({
        url: `posts?page=${page}`,
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
  }),
});

export const {
  useLazyGetCardsQuery,
  useLazyGetMyCardsQuery,
  useLazyGetUserCardsQuery,
  useSetLikeToCardMutation,
  useGetCardQuery,
  useCreationCardMutation,
} = cardsApi;
