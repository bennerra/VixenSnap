import {
  CardAction,
  CardState,
  GetCardActionTypes,
} from "@/store/types/getCard";

const initialState: CardState = {
  card: {
    id: "",
    name: "",
    owner_id: "",
    short_url: "",
    description: "",
    likes: 0,
    is_liked: false,
    author_name: "",
    author_id: "",
  },
  isLoading: false,
  error: "",
};

export const getCardReducer = (state = initialState, action: CardAction) => {
  switch (action.type) {
    case GetCardActionTypes.GET_CARD:
      return { ...state, card: action.payload, isLoading: false };
    case GetCardActionTypes.IS_LOADING_CARD:
      return { ...state, isLoading: true };
    case GetCardActionTypes.GET_ERROR:
      return { ...state, error: action.payload };
    default:
      return { ...state };
  }
};
