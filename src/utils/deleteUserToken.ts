import Cookies from "universal-cookie";

import { AppDispatch } from "@/store";
import { logoutUser } from "@/store/action-creators/auth";
import { CookiesNames } from "@/constants/cookies";
import { LocalStorageNames } from "@/constants/localeStorage";
import { AppRoutes } from "@/constants/paths";

const cookies = new Cookies();

export const deleteUserToken = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const refreshToken = cookies.get(CookiesNames.AUTH);
    const response = await dispatch(
      logoutUser({ refresh_token: refreshToken }) as any
    );
    if (response.status !== 200) return;

    localStorage.removeItem(LocalStorageNames.AUTH);
    cookies.remove(CookiesNames.AUTH);
    window.location.href = AppRoutes.AUTH;
  } catch (e) {
    console.log(e);
  }
};
