import {
  ErrorActionTypes,
  FetchLoginErrorAction,
  FetchLogoutErrorAction,
} from "@/store/types/auth";
import { ThunkAction } from "redux-thunk";
import { AppDispatch, RootState } from "@/store";
import instance from "@/api/instance";
import { ILoginForm, ILogout } from "@/models/ILoginForm";
import { IRegistrationForm } from "@/models/IRegistrationForm";
import { LocalStorageNames } from "@/constants/localeStorage";
import { cookies, CookiesNames } from "@/constants/cookies";
import { AppRoutes } from "@/constants/paths";
import { AnyAction } from "redux";

export const registrationUser = (
  data: IRegistrationForm
): ThunkAction<Promise<any>, RootState, unknown, AnyAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await instance("api/v1/token/create/", {
        method: "post",
        data,
      });
      console.log("request response", response);
      return response;
    } catch (e: any) {
      dispatch({
        type: ErrorActionTypes.FETCH_REGISTRATION_ERROR,
        payload: e.response.data,
      });
      return e;
    }
  };
};

export const loginUser = (
  data: ILoginForm
): ThunkAction<void, RootState, unknown, FetchLoginErrorAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await instance("api/v1/token/", {
        method: "post",
        data,
      });
      localStorage.setItem(LocalStorageNames.AUTH, response.data.access);
      cookies.set(CookiesNames.AUTH, response.data.refresh, {
        expires: new Date(Date.now() + 86400000),
      });
      window.location.href = AppRoutes.MAIN;
    } catch (e: any) {
      dispatch({
        type: ErrorActionTypes.FETCH_LOGIN_ERROR,
        payload: e.message,
      });
    }
  };
};

export const logoutUser = (
  data: ILogout
): ThunkAction<void, RootState, unknown, FetchLogoutErrorAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      return await instance("api/v1/logout/", { method: "post", data });
    } catch (e: any) {
      dispatch({
        type: ErrorActionTypes.FETCH_LOGIN_ERROR,
        payload: e.message,
      });

      return e;
    }
  };
};
