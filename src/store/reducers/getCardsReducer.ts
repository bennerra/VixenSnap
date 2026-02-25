import {
  GetCardsAction,
  GetCardsActionTypes,
  GetCardsState,
} from "@/store/types/getCards";
import {
  GetMyCardsAction,
  GetMyCardsActionTypes,
} from "@/store/types/getMyCards";

const initialState: GetCardsState = {
  isLoading: false,
  cards: [],
  error: "",
  page: 1,
  totalCount: 0,
};

export const getCardsReducer = (
  state = initialState,
  action: GetCardsAction
) => {
  switch (action.type) {
    case GetCardsActionTypes.SET_IS_LOADING:
      return { ...state, isLoading: true };
    case GetCardsActionTypes.SET_CARDS:
      return {
        ...state,
        isLoading: false,
        cards: [...state.cards, ...action.payload],
        page: state.page + 1,
      };
    case GetCardsActionTypes.SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case GetCardsActionTypes.SET_TOTAL_COUNT:
      return { ...state, totalCount: action.payload };
    case GetCardsActionTypes.FILTER_CARDS:
      return {
        ...state,
        cards: action.payload.cards,
        totalCount: action.payload.totalCount,
      };
    case GetCardsActionTypes.RESET_CARDS:
      return { ...state, cards: [], page: 0 };
    default:
      return state;
  }
};

export const getMyCardsReducer = (
  state = initialState,
  action: GetMyCardsAction
) => {
  switch (action.type) {
    case GetMyCardsActionTypes.SET_MY_CARDS_IS_LOADING:
      return { ...state, isLoading: true };
    case GetMyCardsActionTypes.SET_MY_CARDS:
      return {
        ...state,
        isLoading: false,
        cards: [...state.cards, ...action.payload],
        page: state.page + 1,
      };
    case GetMyCardsActionTypes.SET_MY_CARDS_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case GetMyCardsActionTypes.SET_MY_CARDS_TOTAL_COUNT:
      return { ...state, totalCount: action.payload };
    default:
      return state;
  }
};
