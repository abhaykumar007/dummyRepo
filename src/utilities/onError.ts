// import { store } from "../redux/store";
import ErrorModel from "@/models/error/errorModel";
import { createNotification, createErrorNotification } from "./notifications";
import { errorModel } from "@/types/error";
// import SessionActions from "../redux/session/actions";

export default function onError(error: any) {
  if (
    error?.response?.data?.code === 401 &&
    error?.response?.data?.errors[0]?.error === "ERR_INVALID_SESSION"
  ) {
    // const { dispatch } = store;
    // dispatch(SessionActions.softLogout());
  }
  if (error?.response?.data?.code === 500) {
    createErrorNotification(error);
  } else if (!error.response && error.request) {
    createNotification(
      "error",
      "Network Error",
      "Please check your internet connectivity.\n"
    );
  }
}
export function resultHasError(result: ErrorModel | errorModel) {
  return result instanceof ErrorModel;
}
