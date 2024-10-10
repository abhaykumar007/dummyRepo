import ErrorModel from "@/models/error/errorModel";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  ICognitoUserAttributeData,
} from "amazon-cognito-identity-js";
import ErrorDetail from "../../models/error/errorDetail";
import CognitoSessionModel from "./models/login/CognitoSessionModel";
import { getTranslation } from "@/translation/i18n";

const exceptionMapper = (err: { code: string; message: string }): string => {
  switch (err?.code) {
    case "UserNotConfirmedException":
      return getTranslation("login.userNotVerified");
    case "NotAuthorizedException":
      return (
        err.message || getTranslation("login.incorrectPhonenumberAndPassword")
      );
    case "ExpiredCodeException":
      return getTranslation("global.otpExpired");
    case "CodeMismatchException":
      return getTranslation("global.invalidOtp");
    case "LimitExceededException":
      return getTranslation("global.otpLimitExceeded");
    case "PasswordResetRequiredException":
      return getTranslation("global.passwordResetRequired");
    default:
      return getTranslation("global.somethingWentWrong");
  }
};

export function getErrorInstanceFromCognitoError(err: any): ErrorModel {
  const error = new ErrorModel();
  const errorDetails: any = new ErrorDetail();
  error.exception = err?.code;
  errorDetails.error = err?.error;
  errorDetails.message = exceptionMapper(err);
  error.errors = [errorDetails];
  return error;
}

interface Callbacks {
  onSuccess: (data: any) => void;
  onFailure: (err: any) => void;
}

export function getCallbacks(resolve: (value: any) => void): Callbacks {
  return {
    onSuccess: (data) => {
      const cognitoSession = new CognitoSessionModel({
        refreshToken: data?.refreshToken?.token,
        idToken: data?.idToken?.jwtToken,
        accessToken: data?.accessToken?.jwtToken,
      });
      resolve({ tokens: cognitoSession, userDetails: data?.idToken?.payload });
    },
    onFailure: (err) => {
      const error = getErrorInstanceFromCognitoError(err);
      resolve(error);
    },
  };
}

export default class SessionEffects {
  static requestLogin(
    user: CognitoUser,
    phoneNumber: string,
    password: string
  ): Promise<any> {
    return new Promise((resolve) => {
      const authDetails = new AuthenticationDetails({
        Username: phoneNumber,
        Password: password,
      });

      user.authenticateUser(authDetails, getCallbacks(resolve));
    });
  }

  static confirmUserRegistration = (
    cognitoUserObject: CognitoUser,
    confirmationCode: string
  ) => {
    return new Promise((resolve, reject) => {
      if (cognitoUserObject) {
        cognitoUserObject.confirmRegistration(
          confirmationCode,
          true,
          (err, result) => {
            if (err) {
              // reject(err);
              resolve(getErrorInstanceFromCognitoError(err));
            } else {
              resolve(result);
            }
          }
        );
      } else {
        reject();
      }
    });
  };

  static updateUserDetails(
    user: CognitoUser,
    details: (CognitoUserAttribute | ICognitoUserAttributeData)[]
  ): Promise<any> {
    return new Promise((resolve) => {
      return user.getSession(function (err: any) {
        if (err) {
          const error = getErrorInstanceFromCognitoError(err);
          resolve(error);
        }
        return user.updateAttributes(details, (err, result) => {
          if (err) {
            const error = getErrorInstanceFromCognitoError(err);
            resolve(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  }
}
