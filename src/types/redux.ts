import { AnyAction } from "redux-saga";

export interface SagaAction extends AnyAction {
  type: string;
  payload?: any;
}
