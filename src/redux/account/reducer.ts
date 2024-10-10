import BaseReducer from "@/utilities/baseReducer";
import AccountActions from "./actions";

export const initialState = {
  userInfo: null,
};

export default BaseReducer(
  initialState,
  {
    [AccountActions.SET_REGISTER_USER_INFO](state, action) {
      return { ...state, userInfo: action.payload };
    },
  },
  false
);
