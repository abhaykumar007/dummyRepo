import {
  delToModel,
  getToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import UserModel from "./models/getModels/userModel";
import api from "@/utilities/api";
import { getErrorInstanceFromCognitoError } from "../session/effects";
import { CognitoUser } from "amazon-cognito-identity-js";

class UserEffects {
  static getUsers() {
    return getToModel(UserModel, api.USERS);
  }

  static createUser(data: UserModel) {
    return postToModel(UserModel, api.USERS, data);
  }

  static sendResetPasswordOTP = (user: CognitoUser) => {
    return new Promise((resolve) => {
      user.forgotPassword({
        onSuccess: () => {
          resolve(true);
        },
        onFailure: (err) => {
          resolve(getErrorInstanceFromCognitoError(err));
        },
        inputVerificationCode: () => {
          resolve(true);
        },
      });
    });
  };

  static resetPasswordByOtp(user: CognitoUser, otp: string, password: string) {
    return new Promise((resolve) => {
      user.confirmPassword(otp, password, {
        onSuccess: () => {
          resolve(true);
        },
        onFailure: (err) => {
          resolve(getErrorInstanceFromCognitoError(err));
        },
      });
    });
  }

  static updateUser({ id, data }: { id: string; data: UserModel }) {
    return putToModel(UserModel, api.USER.replace(":userId", id), data);
  }

  static deleteUser(id: string) {
    return delToModel(UserModel,  api.USER.replace(":userId", id));
  }
}

export default UserEffects;
