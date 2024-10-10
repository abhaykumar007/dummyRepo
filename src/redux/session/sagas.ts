import { LOCAL_STORAGE_KEYS, TOKEN_EXPIRE_TIME } from "@/config/consts";
import routePaths from "@/config/routePaths";
import URLParamsConstant from "@/config/URLParamsConstant";
import { router } from "@/routes";
import { getTranslation } from "@/translation/i18n";
import { SagaAction } from "@/types/redux";
import { runEffect } from "@/utilities/actionUtility";
import {
  getIsAuthenticated,
  getPreferenceValueFromStorage,
  setAuthStatusInLocalStorage,
  setPreferenceValueInStorage,
} from "@/utilities/localStorage";
import { resultHasError } from "@/utilities/onError";
import { errorToast, successToast } from "@/utilities/toast";
import { CognitoUser } from "amazon-cognito-identity-js";
import { changeLanguage } from "i18next";
import { all, call, cancel, put, takeEvery } from "redux-saga/effects";
import AppActions from "../actions";
import OrganizationActions from "../organization/actions";
import { store } from "../store";
import SessionActions from "./actions";
import SessionEffects from "./effects";
import CognitoSessionModel from "./models/login/CognitoSessionModel";
import UserPool from "./UserPool";
import RequestingActions from "../requesting/actions";
import ErrorModel from "@/models/error/errorModel";

export function getCognitoUserObject(phoneNumber: string) {
  return new CognitoUser({
    Username: phoneNumber,
    Pool: UserPool(),
  });
}

const getCurrentUser = () => {
  return UserPool().getCurrentUser();
};

const getSession = async () => {
  return await new Promise((resolve, reject) => {
    const user = getCurrentUser();

    if (user) {
      user.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(session);
        }
      });
    } else {
      reject();
      store.dispatch(SessionActions.logout(false));
    }
  });
};

const refreshTokens = async () => {
  const user = getCurrentUser();
  const session: any = await getSession();

  return await new Promise((resolve, reject) => {
    if (user && session) {
      user.refreshSession(session.refreshToken, (err, updatedUserSession) => {
        if (!err && updatedUserSession) {
          resolve(updatedUserSession);
        } else {
          reject();
        }
      });
    } else {
      reject();
      store.dispatch(SessionActions.logout(false));
    }
  });
};

function* USER_VERFITY(action: SagaAction): Generator {
  const cognitoUserObject: CognitoUser = getCognitoUserObject(
    `+${action.payload.phoneNumber}`
  );

  const result: boolean | ErrorModel | unknown = yield call(
    runEffect,
    action,
    SessionEffects.confirmUserRegistration,
    cognitoUserObject,
    action.payload.confirmationCode
  );

  if (resultHasError(result as ErrorModel)) yield cancel();

  successToast(getTranslation("login.userVerified"));
  router.navigate(routePaths.login);
}

function* REFRESH_TOKEN_SILENTLY(isShowLoading?: boolean): Generator {
  try {
    if (typeof isShowLoading === "boolean" && isShowLoading) {
      yield put(
        RequestingActions.setRequesting(
          SessionActions.REQUEST_REFRESH_TOKEN_SILENTLY,
          true
        )
      );
    }

    const result: CognitoSessionModel = yield call(refreshTokens);

    const cognitoSession = new CognitoSessionModel({
      refreshToken: result?.refreshToken?.token,
      idToken: result?.idToken?.jwtToken,
      accessToken: result?.accessToken?.jwtToken,
    });

    yield put(SessionActions.setUserTokens(cognitoSession));
    yield put(SessionActions.setUserDetails(result?.idToken?.payload));
    yield call(SCHEDULE_REFRESH);
  } catch (error) {
    yield put(SessionActions.logout(false));
  } finally {
    yield put(
      RequestingActions.setRequesting(
        SessionActions.REQUEST_REFRESH_TOKEN_SILENTLY,
        false
      )
    );
  }
}

function* SCHEDULE_REFRESH() {
  const onTimeout = () => {
    store.dispatch(SessionActions.refreshTokenSilently());
  };
  const worker = new Worker("/timeoutWorker.ts");
  worker.onmessage = onTimeout;
  worker.postMessage({ time: Math.ceil(TOKEN_EXPIRE_TIME * 0.95) * 1000 });
  yield;
}

function* REQUEST_LOGIN(action: SagaAction): Generator {
  yield put(SessionActions.setAccountApprovalStatus(""));

  const cognitoUserObject: CognitoUser = getCognitoUserObject(
    `+${action.payload.phoneNumber}`
  );

  const result: any = yield call(
    runEffect,
    action,
    SessionEffects.requestLogin,
    cognitoUserObject,
    `+${action.payload.phoneNumber}`,
    action.payload.password
  );

  if (resultHasError(result)) yield cancel();

  if (result.userDetails) {
    const isVerifiedByAdmin = result.userDetails?.["custom:isVerifiedByAdmin"];

    if (isVerifiedByAdmin === "0") {
      yield put(SessionActions.setUserTokens(result.tokens));
      yield put(SessionActions.setUserDetails(result.userDetails));

      yield call(SCHEDULE_REFRESH);
      yield call(GET_LANGUAGE_FROM_STORAGE);
      setAuthStatusInLocalStorage(true);
      router.navigate(routePaths.organization);
    } else if (isVerifiedByAdmin === "1") {
      yield put(
        SessionActions.setAccountApprovalStatus(
          getTranslation("login.adminApprovalPending")
        )
      );
    } else if (isVerifiedByAdmin === "2") {
      yield put(
        SessionActions.setAccountApprovalStatus(
          getTranslation("login.adminApprovalRejected")
        )
      );
    }
  }
}

function* GET_LANGUAGE_FROM_STORAGE(): Generator {
  const searchParams = new URLSearchParams(window.location.search);
  const language = searchParams.get(URLParamsConstant.LANGUAGE);

  if (language) {
    yield put(SessionActions.changeLanguage(language));
    yield cancel();
  }

  const languagePreference: any = yield getPreferenceValueFromStorage(
    LOCAL_STORAGE_KEYS.language
  );

  yield put(
    SessionActions.changeLanguage(
      languagePreference ? languagePreference : "en"
    )
  );
}

function* GET_LANGUAGE_FROM_STORAGE_FINISHED(action: SagaAction) {
  // const urlParameter = {
  //   [URLParamsConstant.FARM_ID]: action.payload,
  // }
  // setURLParameters(urlParameter)

  changeLanguage(action.payload);

  yield call(
    setPreferenceValueInStorage,
    LOCAL_STORAGE_KEYS.language,
    action.payload
  );
}

function* LOGOUT(action: SagaAction) {
  const user = getCurrentUser();

  user?.signOut();
  yield put(AppActions.resetStore());
  yield call(setAuthStatusInLocalStorage, false);
  localStorage.clear();
  router.navigate(routePaths.login);

  if (!action.payload) {
    errorToast(getTranslation("global.unauthorizedErr"));
  }
}

function* UPDATE_USER_DETAILS(action: SagaAction): Generator {
  const user = getCurrentUser();

  if (!user) {
    yield put(SessionActions.logout(false));
  }

  const result: any = yield call(
    runEffect,
    action,
    SessionEffects.updateUserDetails,
    user,
    action.payload
  );

  if (resultHasError(result)) yield cancel();

  successToast(getTranslation("profile.updateMsg"));
  yield call(REFRESH_TOKEN_SILENTLY);
}

function* INIT() {
  if (getIsAuthenticated()) {
    yield call(REFRESH_TOKEN_SILENTLY, true);
    yield call(GET_LANGUAGE_FROM_STORAGE);
    yield put(OrganizationActions.getOrganizationFromStorage());
  }
}

function* LOGINFLOW() {
  yield takeEvery(SessionActions.REQUEST_LOGIN, REQUEST_LOGIN);
  yield takeEvery(
    SessionActions.REQUEST_REFRESH_TOKEN_SILENTLY,
    REFRESH_TOKEN_SILENTLY
  );

  yield takeEvery(SessionActions.REQUEST_USER_VERIFICATION, USER_VERFITY);

  yield takeEvery(
    SessionActions.GET_LANGUAGE_FROM_STORAGE,
    GET_LANGUAGE_FROM_STORAGE
  );
  yield takeEvery(
    SessionActions.GET_LANGUAGE_FROM_STORAGE_FINISHED,
    GET_LANGUAGE_FROM_STORAGE_FINISHED
  );
  yield takeEvery(SessionActions.LOGOUT, LOGOUT);
  yield takeEvery(SessionActions.UPDATE_USER_DETAILS, UPDATE_USER_DETAILS);
}

export default function* rootSaga() {
  yield all([LOGINFLOW(), INIT()]);
}
