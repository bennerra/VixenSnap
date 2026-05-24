import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Subscriptions"],
  endpoints: (builder) => ({
    getUserMe: builder.query<any, {}>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query<any, { id: string }>({
      query: (credentials) => ({
        url: `users/${credentials.id}/`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<any, { data: FormData }>({
      query: (credentials) => ({
        url: "users/update/",
        method: "PUT",
        body: credentials.data,
      }),
      invalidatesTags: ["User"],
    }),
    follow: builder.mutation<any, { user_identifier: string }>({
      query: (credentials) => ({
        url: "subscriptions/follow/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
    unfollow: builder.mutation<any, { user_identifier: string }>({
      query: (credentials) => ({
        url: "subscriptions/unfollow/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
    getPremium: builder.mutation<any, { duration_months: number }>({
      query: (credentials) => ({
        url: "premium/purchase/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserMeQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useFollowMutation,
  useUnfollowMutation,
  useGetPremiumMutation,
} = usersApi;
