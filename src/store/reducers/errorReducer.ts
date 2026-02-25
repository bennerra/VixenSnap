import { ErrorAction, ErrorActionTypes, ErrorState } from "@/store/types/auth";

const initialState: ErrorState = {
  registrationError: "",
  loginError: "",
};

export const errorReducer = (state = initialState, action: ErrorAction) => {
  switch (action.type) {
    case ErrorActionTypes.FETCH_REGISTRATION_ERROR:
      return { ...state, registrationError: action.payload };
    case ErrorActionTypes.FETCH_LOGIN_ERROR:
      return { ...state, loginError: action.payload };
    case ErrorActionTypes.FETCH_LOGOUT_ERROR:
      return { ...state, logoutError: action.payload };
    default:
      return state;
  }
};
