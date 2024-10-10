import { loginType } from "@/types/auth";
import { createAction } from "@/utilities/actionUtility";
import CognitoSessionModel from "./models/login/CognitoSessionModel";
import {
  CognitoUserAttribute,
  ICognitoUserAttributeData,
} from "amazon-cognito-identity-js";

const SessionActions = {
  REQUEST_LOGIN: "session/REQUEST_LOGIN",
  REQUEST_LOGIN_FINISHED: "session/REQUEST_LOGIN_FINISHED",
  SET_USER_TOKENS: "session/SET_USER_TOKENS",
  SET_USER_DETAILS: "session/SET_USER_DETAILS",
  UPDATE_USER_DETAILS: "session/UPDATE_USER_DETAILS",
  UPDATE_USER_DETAILS_FINISHED: "session/UPDATE_USER_DETAILS_FINISHED",
  ACCOUNT_APPROVAL_STATUS: "session/ACCOUNT_APPROVAL_STATUS",
  REQUEST_REFRESH_TOKEN_SILENTLY: "session/REQUEST_REFRESH_TOKEN_SILENTLY",
  GET_LANGUAGE_FROM_STORAGE: "session/GET_LANGUAGE_FROM_STORAGE",
  GET_LANGUAGE_FROM_STORAGE_FINISHED:
    "session/GET_LANGUAGE_FROM_STORAGE_FINISHED",
  LOGOUT: "session/LOGOUT",
  REQUEST_USER_VERIFICATION: "session/REQUEST_USER_VERIFICATION",
  REQUEST_USER_VERIFICATION_FINISHED:
    "session/REQUEST_USER_VERIFICATION_FINISHED",

  login: (values: loginType) =>
    createAction(SessionActions.REQUEST_LOGIN, values),

  requestUserVerfication: (phoneNumber: string, confirmationCode: string) =>
    createAction(SessionActions.REQUEST_USER_VERIFICATION, {
      phoneNumber,
      confirmationCode,
    }),

  setUserTokens: (token: CognitoSessionModel) =>
    createAction(SessionActions.SET_USER_TOKENS, { token }),

  setUserDetails: (details: CognitoUserAttribute) =>
    createAction(SessionActions.SET_USER_DETAILS, details),

  updateUserDetails: (
    details: (CognitoUserAttribute | ICognitoUserAttributeData)[]
  ) => createAction(SessionActions.UPDATE_USER_DETAILS, details),

  setAccountApprovalStatus: (status: string) =>
    createAction(SessionActions.ACCOUNT_APPROVAL_STATUS, status),

  refreshTokenSilently: () =>
    createAction(SessionActions.REQUEST_REFRESH_TOKEN_SILENTLY),

  getLanguageFromStorage() {
    return createAction(this.GET_LANGUAGE_FROM_STORAGE);
  },

  changeLanguage(language: string) {
    return createAction(this.GET_LANGUAGE_FROM_STORAGE_FINISHED, language);
  },

  logout(authorized: boolean | undefined = true) {
    return createAction(this.LOGOUT, authorized);
  },
};
export default SessionActions;
