import routePaths from "@/config/routePaths";
import ErrorModel from "@/models/error/errorModel";
import { router } from "@/routes";
import { SagaAction } from "@/types/redux";
import { runEffect } from "@/utilities/actionUtility";
import { resultHasError } from "@/utilities/onError";
import { successToast } from "@/utilities/toast";
import { all, call, cancel, put, select, takeEvery } from "redux-saga/effects";
import WorkflowActions from "./actions";
import WorkflowEffects from "./effects";
import { getTranslation } from "@/translation/i18n";
import WorkflowSelectors from "./selectors";

function* REQUEST_WORKFLOW(action: SagaAction): Generator {
  yield call(runEffect, action, WorkflowEffects.requestWorkflow);
}

function* CREATE_WORKFLOW(action: SagaAction): Generator {
  const { payload } = action.payload;
  const result = yield call(
    runEffect,
    action,
    WorkflowEffects.createWorkflow,
    payload
  );

  if (resultHasError(result as ErrorModel)) yield cancel();

  successToast(getTranslation("template.createdSuccessfully"));
  yield put(WorkflowActions.requestWorkflow());
  router.navigate(routePaths.template);
}

function* UPDATE_WORKFLOW(action: SagaAction): Generator {
  const { payload, workflowId, isRedirect } = action.payload;
  const response = yield call(
    runEffect,
    action,
    WorkflowEffects.updateWorkflow,
    payload,
    workflowId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  const workflowNormalizeData: any = yield select(
    WorkflowSelectors.SelectWorkflowList
  );

  const updatedWorkflow = {
    result: workflowNormalizeData.result,
    entities: {
      workflows: {
        ...workflowNormalizeData.entities.workflows,
        [workflowId]: response,
      },
    },
  };

  yield put(WorkflowActions.updateWorkflowLocally(updatedWorkflow));

  if (isRedirect) {
    successToast(getTranslation("template.updatedSuccessfully"));
    router.navigate(routePaths.template);
  }
}

export default function* rootSaga(): Generator {
  yield all([
    takeEvery(WorkflowActions.REQUEST_WORKFLOW, REQUEST_WORKFLOW),
    takeEvery(WorkflowActions.CREATE_WORKFLOW, CREATE_WORKFLOW),
    takeEvery(WorkflowActions.UPDATE_WORKFLOW, UPDATE_WORKFLOW),
  ]);
}
