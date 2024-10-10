import ErrorDetail from "./errorDetail";

export default class ErrorModel {
  errors = [ErrorDetail];

  exception = null;

  path = null;

  code = null;

  timestamp = 0;

  actionType = "";

  scope = null;
}
