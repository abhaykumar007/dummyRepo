import set from "lodash/set";
import { getKeyForAction } from "@/utilities/actionUtility";
import XMLToJSON from "@/utilities/XMLToJSON";
import ErrorModel from "@/models/error/errorModel";
import ErrorDetail from "@/models/error/errorDetail";
import { createSelector } from "@reduxjs/toolkit";
import { exceptions } from "@/config/consts";
import { RootState } from "../store";

/**
 * Returns a new object with the keys being the finished action type
 * (e.g. "SomeAction.REQUEST_*_FINISHED") and the value being a
 * ErrorModel.
 */

/**
 * Returns true or false if there are errors found matching the array of actionTypes.
 */
function hasErrorsFn(
  errorState: { [key: string]: ErrorModel },
  actionTypes: string[],
  scope: string
) {
  return (
    actionTypes
      .map(
        (actionType: string) => errorState[getKeyForAction(actionType, scope)]
      )
      .filter(Boolean).length > 0
  );
}

export const getErrorModelFromState = (
  state: RootState,
  actionType: string,
  scope: string
) => state.error[getKeyForAction(actionType, scope)];

export const getErrorState = (state: RootState) => state.error;

export const makeSelectErrorModel = () =>
  createSelector(
    [
      getErrorState,
      (_, actionType, scope = "") => getKeyForAction(actionType, scope),
    ],
    (errorState, key) => errorState[key]
  );

export const SelectHasErrors = createSelector(
  (state) => state.error,
  (_, actionTypes) => actionTypes,
  (_, __, scope) => scope,
  hasErrorsFn
);
export const getFieldErrors = (errorModel: ErrorModel | undefined) => {
  const fieldErrors: { [key: string]: string } = {};
  if (
    errorModel &&
    errorModel.exception === exceptions.FieldValidationException &&
    errorModel.errors
  )
    errorModel.errors.forEach((err: any) => {
      if (err.location && err.message) fieldErrors[err.location] = err.message;
    });
  return fieldErrors;
};
export const getFieldErrorsInNestedForm = (errorModel: ErrorModel) => {
  const fieldErrors = {};
  if (errorModel && errorModel.errors)
    errorModel.errors.forEach((err: any) => {
      if (err.location && err.message)
        set(fieldErrors, err.location, err.message);
    });
  return fieldErrors;
};

export const makeSelectFieldErrors = () =>
  createSelector(makeSelectErrorModel(), getFieldErrors);

export const makeSelectRowWiseError = () =>
  createSelector(makeSelectErrorModel(), (error: any) => {
    if (!error?.errors) return [];

    let colonIndex = -1;
    return error?.errors.reduce((result: any, err: any) => {
      if (!err?.location.startsWith("row:")) return result;
      colonIndex = err?.location.indexOf(";");
      return [
        ...result,
        {
          lineNo:
            colonIndex === -1
              ? Number(err?.location.substring(5))
              : Number(err?.location.substring(5, colonIndex)),
          message: err?.message,
          solution: err?.solution,
          ...(colonIndex !== -1
            ? { columnNo: Number(err?.location.substring(colonIndex + 6)) }
            : {}),
        },
      ];
    }, []);
  });

export const getFieldCounts = (error: any) => {
  const errorCount: { [key: string]: number } = {};
  if (
    error?.exception !== exceptions.FieldValidationException ||
    !error?.errors
  ) {
    return errorCount;
  }
  error.errors.forEach((err: any) => {
    if (err?.location && !err?.location.startsWith("Line:")) {
      const index = err.location.indexOf(".");
      const fieldName = err.location.substring(
        0,
        index !== -1 ? index : undefined
      );
      errorCount[fieldName] = (errorCount[fieldName] || 0) + 1;
    }
  });
  return errorCount;
};

export const makeSelectFieldErrorCount = () =>
  createSelector(makeSelectErrorModel(), getFieldCounts);

const getLeavesCountRecursively = (val: any): number => {
  return typeof val === "object"
    ? Object.entries(val).reduce(
        (total, [child]) => total + getLeavesCountRecursively(child),
        0
      )
    : 1;
};
export const getFieldCountsFromNestedErrors = (
  errorObj: { [key: string]: any } | undefined
) =>
  Object.entries(errorObj || {}).reduce(
    (result, [fieldName, field]) => ({
      ...result,
      [fieldName]: getLeavesCountRecursively(field),
    }),
    {}
  );

export const getCountOfFields = (
  fieldCount: { [key: string]: number },
  ...fields: string[]
) => {
  if (fields.length === 0)
    return Object.values(fieldCount).reduce((sum, count) => sum + count, 0);
  return fields.reduce((prevCount, field) => {
    return prevCount + (fieldCount[field] || 0);
  }, 0);
};

export const makeSelectFieldErrorsInNestedForm = () =>
  createSelector(makeSelectErrorModel(), getFieldErrorsInNestedForm);

export const getErrorsFromModel = (errorModel: ErrorModel | undefined) => {
  if (errorModel && errorModel.errors) {
    const errors: { [key: string]: Error } = {};
    errorModel.errors.forEach((err: any) => {
      errors[err.error] = new Error(err.message);
    });
    return errors;
  }
  return null;
};

const selectError = makeSelectErrorModel();
export const makeSelectErrorFields = () =>
  createSelector(selectError, (error: any) => {
    const errorFieldsSet = new Set<string>();
    if (error?.exception !== exceptions.FieldValidationException)
      return errorFieldsSet;
    error.errors.map((err: ErrorDetail) => {
      if (err.location) errorFieldsSet.add(err.location);
      return null;
    });
    return errorFieldsSet;
  });

export const makeSelectErrorsArray = () =>
  // @ts-ignore
  createSelector(getErrorModelFromState, getErrorsFromModel);

export function makeSelectAwsXmlError() {
  return createSelector(makeSelectErrorModel(), (error: any) => {
    if (!error || !error.XMLResponse) return null;
    const parser = new DOMParser();
    const dom = parser.parseFromString(error.XMLResponse, "application/xml");
    const errJSON = XMLToJSON(dom);
    switch (errJSON.Error.Code) {
      case "AccessDenied":
        return "Access Denied";
      case "ExpiredToken":
        return "URL Expired try again.";
      case "InternalError":
        return "Internal server error";
      case "EntityTooLarge":
        return "File Size Too Large";
      case "SignatureDoesNotMatch":
        return "Could not verify upload signature.";
      default:
        return "Upload Failed";
    }
  });
}

export function makeSelectUploadXmlError() {
  return createSelector(makeSelectErrorModel(), (error: any) => {
    if (!error || !error.XMLResponse) return null;
    const parser = new DOMParser();
    const dom = parser.parseFromString(error.XMLResponse, "application/xml");
    const errJSON = XMLToJSON(dom);
    switch (errJSON.Error.Code) {
      case "AccessDenied":
        return "Upload Failed: Access Denied";
      case "ExpiredToken":
        return "Upload Failed: URL Expired try again.";
      case "InternalError":
        return "Upload Failed: Internal server error";
      case "EntityTooLarge":
        return "Upload Failed: File Size Too Large";
      case "SignatureDoesNotMatch":
        return "Upload Failed: Could not verify upload signature.";
      default:
        return "Upload Failed";
    }
  });
}
