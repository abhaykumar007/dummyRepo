import { registerType } from "@/types/auth";
import { createAction } from "@/utilities/actionUtility";

const AccountActions = {
  REQUEST_REGISTER: "account/REQUEST_REGISTER",
  REQUEST_REGISTER_FINISHED: "account/REQUEST_REGISTER_FINISHED",
  SET_REGISTER_USER_INFO: "account/SET_REGISTER_USER_INFO",

  register: (values: registerType) =>
    createAction(AccountActions.REQUEST_REGISTER, values),

  setRegisterUserInfo: (payload: registerType) =>
    createAction(AccountActions.SET_REGISTER_USER_INFO, payload),
};
export default AccountActions;
