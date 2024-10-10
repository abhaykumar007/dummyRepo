import { getTranslation } from "@/translation/i18n";

export const hasNumberRegex = /[0-9]/;
export const hasLowerCaseRegex = /[a-z]/;
export const hasUpperCaseRegex = /[A-Z]/;
export const hasSpecialCharRegex = /[\^$*.\[\]{}()?\-!@#%&\/,><:;|_~]/;

export const REGEX = {
  PASSWORD_VALIDATION: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  VALID_NUMBER_VALIDATION: /^(?:\d*)$/,
  VALID_EMAIL_VALIDATION:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const hasNumber = (value: string) => {
  return hasNumberRegex.test(value);
};
export const hasLowerCase = (value: string) => {
  return hasLowerCaseRegex.test(value);
};
export const hasUpperCase = (value: string) => {
  return hasUpperCaseRegex.test(value);
};
export const hasSpecialChar = (value: string) => {
  return (
    hasSpecialCharRegex.test(value) ||
    value.includes("'") ||
    value.includes("`") ||
    value.includes('"')
  );
};

export const emailValidator = (_: object, value: string) => {
  if (!value)
    return Promise.reject(new Error(getTranslation("global.emailErrMsg")));
  if (!REGEX.VALID_EMAIL_VALIDATION.test(value))
    return Promise.reject(new Error(getTranslation("global.invalidEmailErr")));
  return Promise.resolve();
};
