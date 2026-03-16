import { LocalStorageNames } from "@/constants/localeStorage";
import { AppRoutes, NotAuthPaths } from "@/constants/paths";
import { cookies, CookiesNames } from "@/constants/cookies";
import { Mutex } from "async-mutex";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BASE_URL}api/v1`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(LocalStorageNames.AUTH);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const currentPage = window.location.pathname;
    const isPublicPath = NotAuthPaths.includes(currentPage as AppRoutes);

    if (isPublicPath) {
      return result;
    }

    const accessToken = localStorage.getItem(LocalStorageNames.AUTH);
    const refreshToken = cookies.get(CookiesNames.AUTH);

    if (!accessToken || !refreshToken) {
      window.location.href = AppRoutes.AUTH;
      return result;
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: "token/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { access, refresh } = refreshResult.data as {
            access: string;
            refresh: string;
          };

          localStorage.setItem(LocalStorageNames.AUTH, access);
          cookies.set(CookiesNames.AUTH, refresh, {
            expires: new Date(Date.now() + 86400000),
          });

          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.removeItem(LocalStorageNames.AUTH);
          cookies.remove(CookiesNames.AUTH);
          window.location.href = AppRoutes.AUTH;
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
