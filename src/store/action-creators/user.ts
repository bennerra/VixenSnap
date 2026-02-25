import {
  SetUserCardAction,
  SetUserMeAction,
  UserActionTypes,
} from "@/store/types/user";
import instance from "@/api/instance";
import { AppDispatch, RootState } from "@/store";
import { ThunkAction } from "redux-thunk";

export const setUserMeInfo = (): ThunkAction<
  void,
  RootState,
  unknown,
  SetUserMeAction
> => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await instance("api/v1/users/me", {
        method: "get",
      });
      dispatch({
        type: UserActionTypes.SET_USER_ME_INFO,
        payload: response.data,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  };
};

export const setUserCardInfo = (
  id: string
): ThunkAction<void, RootState, unknown, SetUserCardAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await instance(`api/v1/users/${id}`, {
        method: "get",
      });
      dispatch({
        type: UserActionTypes.SET_USER_CARD_INFO,
        payload: response.data,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  };
};
