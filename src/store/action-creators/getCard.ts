import { GetCardActionTypes, IsLoadingCartAction } from "@/store/types/getCard";
import { ThunkAction } from "redux-thunk";
import { AppDispatch, RootState } from "@/store";
import { SetUserCardAction } from "@/store/types/user";
import instance from "@/api/instance";

export const getCard = (
  id: string | undefined
): ThunkAction<void, RootState, unknown, SetUserCardAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await instance(`api/v1/posts/${id}`, {
        method: "get",
      });
      dispatch({
        type: GetCardActionTypes.GET_CARD,
        payload: response.data,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  };
};

export const setIsLoading = (isLoading: boolean): IsLoadingCartAction => {
  return { type: GetCardActionTypes.IS_LOADING_CARD, payload: isLoading };
};
