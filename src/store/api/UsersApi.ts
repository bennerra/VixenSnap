import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserMe: builder.query<any, {}>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
    }),
    getUser: builder.query<any, { id: string }>({
      query: (credentials) => ({
        url: `users/${credentials.id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserMeQuery, useGetUserQuery } = usersApi;
