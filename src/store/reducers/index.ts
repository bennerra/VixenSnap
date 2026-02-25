import { combineReducers } from "redux";

import { errorReducer } from "@/store/reducers/errorReducer";
import { uploadFilesReducer } from "@/store/reducers/uploadFilesReducer";
import {
  getCardsReducer,
  getMyCardsReducer,
} from "@/store/reducers/getCardsReducer";
import { userReducer } from "@/store/reducers/getUserReducer";
import { getCardReducer } from "@/store/reducers/getCardReducer";
import { getSearchValueReducer } from "@/store/reducers/getSearchValueReducer";

export const rootReducer = combineReducers({
  error: errorReducer,
  files: uploadFilesReducer,
  cards: getCardsReducer,
  myCards: getMyCardsReducer,
  user: userReducer,
  card: getCardReducer,
  searchValue: getSearchValueReducer,
});
