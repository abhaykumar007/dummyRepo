import { RootState } from "../store";

class SessionSelectors {
  static SelectToken = (state: RootState) => state.session.token;
  static SelectUserDetails = (state: RootState) => state.session.details;
  static SelectAccountApprovalStatus = (state: RootState) =>
    state.session.accountApprovalStatus;

  static SelectSelectedLanguage = (state: RootState) =>
    state.session?.currentLanguage;
}

export default SessionSelectors;
