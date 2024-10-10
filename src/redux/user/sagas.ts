import { takeEvery, all, call, put, cancel, select } from "redux-saga/effects";
import UserActions from "./actions";
import { createAction, runEffect } from "@/utilities/actionUtility";
import UserEffects from "./effects";
import { SagaAction } from "@/types/redux";
import UserModel from "./models/createModels/userModel";
import removeEmpty from "@/utilities/objectUtility";
import { CognitoUser } from "amazon-cognito-identity-js";
import { getCognitoUserObject } from "../session/sagas";
import { resultHasError } from "@/utilities/onError";
import { successToast } from "@/utilities/toast";
import { router } from "@/routes";
import UserSelectors from "./selectors";
import { getTranslation } from "@/translation/i18n";
import ErrorModel from "@/models/error/errorModel";
import { User } from "@/pages/userManagement/types";
import { normalizeData } from "@/types/normalize";

function* FETCH_USERS(action: SagaAction) {
  yield call(runEffect, action, UserEffects.getUsers);
}

function* CREATE_USER(action: SagaAction) {
  const user = new UserModel(action.payload);
  const result: User | ErrorModel = yield call(
    runEffect,
    action,
    UserEffects.createUser,
    removeEmpty(user.toJSON())
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
  successToast(
    `${user.firstName} ${user.lastName} ${getTranslation(
      "global.isCreatedSucessfully"
    )}`
  );
}

function* REQUEST_RESET_PASSWORD_OTP(action: SagaAction): Generator {
  const cognitoUserObject: CognitoUser = getCognitoUserObject(
    `+${action.payload.phone}`
  );

  const result: boolean | ErrorModel | unknown = yield call(
    runEffect,
    action,
    UserEffects.sendResetPasswordOTP,
    cognitoUserObject
  );

  if (resultHasError(result as ErrorModel)) yield cancel();

  successToast(getTranslation("forgotPassword.otpSentSuccessfully"));
}

function* RESET_PASSWORD(action: SagaAction): Generator {
  const cognitoUserObject: CognitoUser = getCognitoUserObject(
    `+${action.payload.phoneNumber}`
  );

  const result: boolean | ErrorModel | unknown = yield call(
    runEffect,
    action,
    UserEffects.resetPasswordByOtp,
    cognitoUserObject,
    action.payload.otp,
    action.payload.password
  );

  if (resultHasError(result as ErrorModel)) yield cancel();

  yield put(
    createAction(UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED, false)
  );

  successToast(getTranslation("forgotPassword.passwordUpdatedSuccess"));
  router.navigate("/login");
}

function* PATCH_USER(action: SagaAction) {
  const result: User | ErrorModel = yield call(
    runEffect,
    action,
    UserEffects.updateUser,
    {
      id: action.payload.id,
      data: action.payload.data,
    }
  );

  if (resultHasError(result as ErrorModel)) yield cancel();
  const users: normalizeData = yield select(
    UserSelectors.selectNormalizedUsers
  );

  const updatedUsers = {
    ...users.entities.users,
    [action.payload.id]: { ...result, ...action.payload.data },
  };

  yield put(
    UserActions.updateUsersLocally({
      selectedUser: { ...result, ...action.payload.data },
      users: {
        result: users.result,
        entities: { users: updatedUsers },
      },
    })
  );
}

function* DELETE_USER(action: SagaAction) {
  const result: User | ErrorModel = yield call(
    runEffect,
    action,
    UserEffects.deleteUser,
    action.payload
  );
  if (resultHasError(result as ErrorModel)) yield cancel();

  const users: normalizeData = yield select(
    UserSelectors.selectNormalizedUsers
  );
  const uesrIds: string[] = users.result as string[];
  const userIds = uesrIds.filter((userId: string) => userId !== action.payload);
  const { [action.payload]: _, ...newUsers } = users?.entities?.users;
  yield put(
    UserActions.updateUsersLocally({
      selectedUser: null,
      users: {
        result: userIds,
        entities: { users: newUsers },
      },
    })
  );
  yield put(UserActions.unSelectUser());
  const user = result as User;
  successToast(
    `${user.firstName} ${user.lastName} ${getTranslation(
      "global.isDeletedSuccessfully"
    )}`
  );
}

export default function* userSaga() {
  yield all([
    takeEvery(UserActions.FETCH_USERS, FETCH_USERS),
    takeEvery(UserActions.CREATE_USER, CREATE_USER),
    takeEvery(
      UserActions.REQUEST_RESET_PASSWORD_OTP,
      REQUEST_RESET_PASSWORD_OTP
    ),
    takeEvery(UserActions.RESET_PASSWORD, RESET_PASSWORD),
    takeEvery(UserActions.UPDATE_USER_FIRST_NAME, PATCH_USER),
    takeEvery(UserActions.UPDATE_USER_LAST_NAME, PATCH_USER),
    takeEvery(UserActions.UPDATE_USER_ROLES, PATCH_USER),
    takeEvery(UserActions.DELETE_USER, DELETE_USER),
    takeEvery(UserActions.PATCH_USER, PATCH_USER),
  ]);
}
