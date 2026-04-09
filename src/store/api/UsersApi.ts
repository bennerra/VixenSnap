import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
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
    }),
    updateUser: builder.mutation<any, { data: FormData }>({
      query: (credentials) => ({
        url: "users/update/",
        method: "PUT",
        body: credentials.data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserMeQuery, useGetUserQuery, useUpdateUserMutation } =
  usersApi;
