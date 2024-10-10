import { getTranslation } from "@/translation/i18n";

export const REGEX = {
    ratioValidationRegex: /^\d+:\d+$/,
    number: /^(?:[1-9]\d{0,4}|50000)(?:\.\d+)?$/,
  };
export const isNumber = (value: string) => REGEX.number.test(value);
export const numberValidator = (_: object, value: string) => {
    if (value && !isNumber(value))
      return Promise.reject(new Error(getTranslation("farm.numberValidator")));
    return Promise.resolve();
  };

export const nameValidator = (_: object, value: string) => {
    if (value && !/^[a-zA-Z]+$/.test(value))
      return Promise.reject(new Error(getTranslation("global.nameValidationError")));
    return Promise.resolve();
  }