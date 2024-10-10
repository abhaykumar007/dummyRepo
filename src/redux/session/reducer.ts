import BaseReducer from "@/utilities/baseReducer";
import SessionActions from "./actions";
import { LANGUAGE_KEYS } from "@/config/consts";

export const initialState = {
  token: null,
  accountApprovalStatus: null,
  currentLanguage: LANGUAGE_KEYS.en,
  details: {},
};

export default BaseReducer(
  initialState,
  {
    [SessionActions.SET_USER_TOKENS](state, action) {
      return { ...state, token: action.payload.token };
    },
    [SessionActions.ACCOUNT_APPROVAL_STATUS](state, action) {
      return { ...state, accountApprovalStatus: action.payload };
    },
    [SessionActions.GET_LANGUAGE_FROM_STORAGE_FINISHED](state, action) {
      return { ...state, currentLanguage: action.payload };
    },
    [SessionActions.SET_USER_DETAILS](state, action) {
      return { ...state, details: action.payload };
    },
  },
  false
);
