import { IGetCards } from "@/models/IGetCards";

export enum GetMyCardsActionTypes {
  SET_MY_CARDS_IS_LOADING = "SET_MY_CARDS_IS_LOADING",
  SET_MY_CARDS = "SET_MY_CARDS",
  SET_MY_CARDS_ERROR = "SET_MY_CARDS_ERROR",
  SET_MY_CARDS_TOTAL_COUNT = "SET_MY_CARDS_TOTAL_COUNT",
}

export interface SetIsLoadingAction {
  type: GetMyCardsActionTypes.SET_MY_CARDS_IS_LOADING;
  payload: boolean;
}

export interface SetCardsAction {
  type: GetMyCardsActionTypes.SET_MY_CARDS;
  payload: IGetCards[];
}

export interface SetErrorAction {
  type: GetMyCardsActionTypes.SET_MY_CARDS_ERROR;
  payload: string;
}
export interface SetTotalCountAction {
  type: GetMyCardsActionTypes.SET_MY_CARDS_TOTAL_COUNT;
  payload: number;
}

export interface GetMyCardsState {
  isLoading: boolean;
  cards: IGetCards[];
  error: string;
  page: number;
  totalCount: number;
}

export type GetMyCardsAction =
  | SetIsLoadingAction
  | SetCardsAction
  | SetErrorAction
  | SetTotalCountAction;
