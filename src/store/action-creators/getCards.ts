import { GetCardsActionTypes } from "@/store/types/getCards";
import { ThunkAction } from "redux-thunk";
import { AppDispatch, RootState } from "@/store";
import { SetUserCardAction } from "@/store/types/user";
import instance from "@/api/instance";
import { GetMyCardsActionTypes } from "@/store/types/getMyCards";

export const setCards = (
  page: number
): ThunkAction<void, RootState, unknown, SetUserCardAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: GetCardsActionTypes.SET_IS_LOADING, payload: true });
      const response = await instance("/api/v1/posts/", {
        method: "get",
        params: { page, count: 25 },
      });
      dispatch({
        type: GetCardsActionTypes.SET_CARDS,
        payload: response.data.results,
      });
      dispatch({
        type: GetCardsActionTypes.SET_TOTAL_COUNT,
        payload: response.data.total,
      });
    } catch (e: any) {
      dispatch({
        type: GetCardsActionTypes.SET_ERROR,
        payload: e.message,
      });
    } finally {
      dispatch({ type: GetCardsActionTypes.SET_IS_LOADING, payload: false });
    }
  };
};

export const getMyCards = (
  page: number
): ThunkAction<void, RootState, unknown, SetUserCardAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: GetMyCardsActionTypes.SET_MY_CARDS_IS_LOADING,
        payload: true,
      });
      const response = await instance("/api/v1/my_posts/", {
        method: "get",
        params: { page, count: 25 },
      });
      dispatch({
        type: GetMyCardsActionTypes.SET_MY_CARDS,
        payload: response.data.results,
      });
      dispatch({
        type: GetMyCardsActionTypes.SET_MY_CARDS_TOTAL_COUNT,
        payload: response.data.total,
      });
    } catch (e: any) {
      dispatch({
        type: GetMyCardsActionTypes.SET_MY_CARDS_ERROR,
        payload: e.message,
      });
    } finally {
      dispatch({
        type: GetMyCardsActionTypes.SET_MY_CARDS_IS_LOADING,
        payload: false,
      });
    }
  };
};
