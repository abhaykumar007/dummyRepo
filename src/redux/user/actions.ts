import { createAction } from "@/utilities/actionUtility";
import { CreateUser, User } from "../../pages/userManagement/types";
import { forgotPasswordType, sendOTPType } from "@/types/auth";
import { normalizeData } from "@/types/normalize";

const UserActions = {
  FETCH_USERS: "users/FETCH_USERS",
  FETCH_USERS_FINISHED: "users/FETCH_USERS_FINISHED",
  CREATE_USER: "users/CREATE_USER",
  CREATE_USER_FINISHED: "users/CREATE_USER_FINISHED",
  SELECT_USER: "users/SELECT_USER",
  SELECT_USER_FINISHED: "users/SELECT_USER_FINISHED",
  UNSELECT_USER: "users/UNSELECT_USER",
  UNSELECT_USER_FINISHED: "users/UNSELECT_USER_FINISHED",
  REQUEST_RESET_PASSWORD_OTP: "users/REQUEST_RESET_PASSWORD_OTP",
  REQUEST_RESET_PASSWORD_OTP_FINISHED:
    "users/REQUEST_RESET_PASSWORD_OTP_FINISHED",
  RESET_PASSWORD: "users/RESET_PASSWORD",
  RESET_PASSWORD_FINISHED: "users/RESET_PASSWORD_FINISHED",
  PATCH_USER: "users/PATCH_USER",
  PATCH_USER_FINISHED: "users/PATCH_USER_FINISHED",
  UPDATE_USER_FIRST_NAME: "users/UPDATE_USER_FIRST_NAME",
  UPDATE_USER_FIRST_NAME_FINISHED: "users/UPDATE_USER_FIRST_NAME_FINISHED",
  UPDATE_USER_LAST_NAME: "users/UPDATE_USER_LAST_NAME",
  UPDATE_USER_LAST_NAME_FINISHED: "users/UPDATE_USER_LAST_NAME_FINISHED",
  UPDATE_USER_ROLES: "users/UPDATE_USER_ROLES",
  UPDATE_USER_ROLES_FINISHED: "users/UPDATE_USER_ROLES_FINISHED",
  DELETE_USER: "users/DELETE_USER",
  DELETE_USER_FINISHED: "users/DELETE_USER_FINISHED",
  UPDATE_USERS_LOCALLY: "users/UPDATE_USERS_LOCALLY",
  SET_USER_FILTER: "users/SET_USER_FILTER",


  fetchUsers() {
    return createAction(this.FETCH_USERS);
  },

  createUser(payload: CreateUser) {
    return createAction(this.CREATE_USER, payload);
  },

  selectUser(payload: User) {
    return createAction(this.SELECT_USER, payload);
  },

  unSelectUser() {
    return createAction(this.UNSELECT_USER);
  },

  sendResetPasswordOTP(payload: sendOTPType) {
    return createAction(this.REQUEST_RESET_PASSWORD_OTP, payload);
  },

  resetPasswordWithOTP(payload: forgotPasswordType) {
    return createAction(this.RESET_PASSWORD, payload);
  },
  patchUser(payload: {id :string, data: CreateUser}, scope: string) {
    return createAction(this.PATCH_USER, payload,false, { scope });
  
  },

  updateUserFirstName(payload: CreateUser) {
    return createAction(this.UPDATE_USER_FIRST_NAME, payload);
  },

  updateUserLastName(payload: CreateUser) {
    return createAction(this.UPDATE_USER_LAST_NAME, payload);
  },

  updateUserRoles(payload: CreateUser) {
    return createAction(this.UPDATE_USER_ROLES, payload);
  },

  deleteUser(payload: string) {
    return createAction(this.DELETE_USER, payload);
  },
  updateUsersLocally(payload: { selectedUser: User | null; users: normalizeData }) {
    return createAction(this.UPDATE_USERS_LOCALLY, payload);
  },

  setUserFilter(payload: Record<string, string>) {
    return createAction(this.SET_USER_FILTER, payload);
  }
};

export default UserActions;
