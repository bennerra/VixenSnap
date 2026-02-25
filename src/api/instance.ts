import { LocalStorageNames } from "@/constants/localeStorage";
import axios from "axios";
import { cookies, CookiesNames } from "@/constants/cookies";
import { refresh } from "@/api/refresh";
import { AppRoutes, NotAuthPaths } from "@/constants/paths";

const apiService = process.env.REACT_APP_BASE_URL;

const apiInstance = axios.create({
  baseURL: apiService,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LocalStorageNames.AUTH);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        const accessToken = localStorage.getItem(LocalStorageNames.AUTH);
        const refreshToken = cookies.get(CookiesNames.AUTH);
        const currentPage = window.location.pathname;
        const isPublicPath = NotAuthPaths.includes(currentPage as AppRoutes);

        if (isPublicPath) {
          return await Promise.reject(error);
        }

        if (!accessToken || !refreshToken) {
          window.location.href = AppRoutes.AUTH;
          return await Promise.reject(new Error("Необходима авторизация"));
        }

        const newTokens = await refresh({ refresh: refreshToken });

        localStorage.setItem(LocalStorageNames.AUTH, newTokens.access);
        cookies.set(CookiesNames.AUTH, newTokens.refresh, {
          expires: new Date(Date.now() + 86400000),
        });
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

        return await apiInstance(originalRequest);
      } catch (e) {
        return e;
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
