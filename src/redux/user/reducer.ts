import BaseReducer from "@/utilities/baseReducer";
import UserActions from "./actions";
import userNormalizeSchema, { addNormalizeUser } from "./schema";

const initialState = {
  users: {},
  passwordResetOTPSent: null,
  selectedUser: null,
  updatedUser: {},
  filter:{
    search: "",
  }
};

export default BaseReducer(initialState, {
  [UserActions.FETCH_USERS_FINISHED](state, action) {
    return {
      ...state,
      users: userNormalizeSchema(action.payload),
    };
  },
  [UserActions.CREATE_USER_FINISHED](state, action) {
    return {
      ...state,
      users: addNormalizeUser(state.users, action.payload),
    };
  },
  [UserActions.SELECT_USER](state, action) {
    return {
      ...state,
      selectedUser: action.payload,
    };
  },
  [UserActions.UNSELECT_USER](state) {
    return {
      ...state,
      selectedUser: null,
    };
  },
  [UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED](state, action) {
    return { ...state, passwordResetOTPSent: action.payload };
  },
  [UserActions.UPDATE_USERS_LOCALLY](state, action) {
    return {
      ...state,
      selectedUser: action.payload?.selectedUser,
      users: action.payload?.users,
    };
  },
  [UserActions.SET_USER_FILTER](state, action) {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...action.payload,
      },
    };
  }
});
