import { createApi } from "@reduxjs/toolkit/query/react";

import { ILoginForm, ILogout, IRefresh } from "@/models/ILoginForm";
import { IRegistrationForm } from "@/models/IRegistrationForm";
import { IOAuthUser } from "@/models/IOAuthUser";
import { baseQueryWithReauth } from "@/store/baseQueryWithReauth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<any, ILoginForm>({
      query: (credentials) => ({
        url: "token/",
        method: "POST",
        body: credentials,
      }),
    }),
    registration: builder.mutation<any, IRegistrationForm>({
      query: (credentials) => ({
        url: "token/create/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<any, ILogout>({
      query: (credentials) => ({
        url: "logout/",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation<any, IRefresh>({
      query: (credentials) => ({
        url: "api/v1/token/refresh/",
        method: "POST",
        body: credentials,
      }),
    }),
    oAuthUser: builder.mutation<any, IOAuthUser>({
      query: (credentials) => ({
        url: "token/oauth/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useOAuthUserMutation,
} = authApi;
