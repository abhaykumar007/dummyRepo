import ErrorModel from "@/models/error/errorModel";
import { notification } from "antd";
import { cancel } from "redux-saga/effects";

export function createNotification(
  type: "success" | "error",
  message: string,
  description: string
) {
  notification[type]({ message, description: description || "" });
}

export function createErrorNotification(error: any) {
  if (error.exception !== "Network Error")
    createNotification(
      "error",
      "Unable to process your request",
      "Please contact support for further assistance on your request"
    );
}
export function* showErrorNotificationIfError(
  result: any,
  cancelOnError: boolean = true
) {
  if (result instanceof ErrorModel) {
    if (result.code !== 500) createErrorNotification(result);
    if (cancelOnError) yield cancel();
  }
}

export function createSuccessNotification(
  message: string,
  description: string
) {
  createNotification("success", message, description);
}
