import { all } from "redux-saga/effects";
import sessionSaga from "./session/sagas";
import accountSaga from "./account/sagas";
import userSaga from "./user/sagas";
import farmSaga from "./farm/sagas";
import organizationSaga from "./organization/sagas";
import polyhouseSaga from "./polyhouse/sagas";
import inventorySaga from "./inventory/sagas";
import workflowSaga from "./workflow/sagas";
import reservoirSaga from "./reservoir/sagas";
import taskSaga from "./task/sagas";
import dashboardSaga from "./dashboard/sagas";

export default function* rootSaga() {
  yield all([
    sessionSaga(),
    accountSaga(),
    userSaga(),
    farmSaga(),
    organizationSaga(),
    workflowSaga(),
    polyhouseSaga(),
    organizationSaga(),
    inventorySaga(),
    taskSaga(),
    reservoirSaga(),
    dashboardSaga(),
  ]);
}
