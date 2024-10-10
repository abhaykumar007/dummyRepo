import { createSelector } from "@reduxjs/toolkit";
import {
  makeSelectErrorModel,
  makeSelectFieldErrors,
} from "../error/errorSelector";
import { RootState } from "../store";

class AccountSelectors {
  static SelectCreateUserFieldErrors = createSelector(
    makeSelectErrorModel(),
    makeSelectFieldErrors(),
    (_, fieldErrors) => fieldErrors
  );

  public static SelectRegisterUserInfo(state: RootState) {
    return state?.account?.userInfo;
  }
}

export default AccountSelectors;
