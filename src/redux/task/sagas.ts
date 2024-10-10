import { all, call, cancel, put, select, takeEvery } from "redux-saga/effects";
import TaskActions from "./actions";
import { createAction, runEffect } from "@/utilities/actionUtility";
import { SagaAction } from "@/types/redux";
import { TaskEffects } from "./effects";
import { resultHasError } from "@/utilities/onError";
import TaskSelectors from "./selectors";
import {
  taskStatusKeyToValue,
  taskStatusValueTokey,
} from "@/pages/tasks/utils";
import { Task, TaskHistory, TaskResponseModelType } from "@/pages/tasks/types";
import ErrorModel from "@/models/error/errorModel";

function* FETCH_TASKS(action: SagaAction) {
  if (!action.payload["status"]) action.payload["status"] = "all";
  let result: TaskResponseModelType | ErrorModel;
  if (action["meta"]?.loadMore) {
    const tasks: Task[] = yield select((state) =>
      TaskSelectors.selectTasksByStatus(
        state,
        taskStatusValueTokey[action.payload.status]
      )
    );
    action.payload["skip"] = tasks?.length;
    action.payload["take"] = 5;

    const totalTasks: Number = yield select((state) =>
      TaskSelectors.selectTasksTotalByStatus(
        state,
        taskStatusValueTokey[action.payload.status]
      )
    );
    if (tasks.length && tasks.length === totalTasks) yield cancel();
    result = yield call(runEffect, action, TaskEffects.getTasks, {
      ...action.payload,
    });
    if (resultHasError(result as ErrorModel)) yield cancel();
    const taskResult = result as TaskResponseModelType;
    yield put(
      createAction(TaskActions.UPDATE_TASKS_BY_STATUS, {
        status: action.payload.status,
        tasks: [...tasks, ...taskResult.tasks],
        total: taskResult.total,
      })
    );
  } else {
    result = yield call(runEffect, action, TaskEffects.getTasks, {
      ...action.payload,
    });
    if (resultHasError(result as ErrorModel)) yield cancel();
    const taskResult = result as TaskResponseModelType;
    yield put(
      createAction(TaskActions.UPDATE_TASKS_BY_STATUS, {
        status: action.payload.status,
        tasks: taskResult.tasks,
        total: taskResult.total,
      })
    );
  }
}

function* CREATE_TASK(action: SagaAction) {
  const result: Task | ErrorModel = yield call(
    runEffect,
    action,
    TaskEffects.createTask,
    action.payload
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
}

function* UPDATE_TASK_STATUS(action: SagaAction) {
  yield put(
    createAction(TaskActions.UPDATE_TASK_STATUS_LOCALLY, action.payload)
  );
  const soucreKey = action.payload.source.droppableId;
  const totalSouceTasks: number = yield select((state) =>
    TaskSelectors.selectTasksTotalByStatus(state, soucreKey)
  );
  const tasks: Task[] = yield select((state) =>
    TaskSelectors.selectTasksByStatus(state, soucreKey)
  );
  if (totalSouceTasks > 5 && tasks.length <= 5) {
    yield put(
      createAction(
        TaskActions.FETCH_TASKS,
        {
          status: taskStatusKeyToValue[soucreKey],
        },
        soucreKey,
        true
      )
    );
  }
  if (
    action.payload.source.droppableId === action.payload.destination.droppableId
  )
    yield cancel();

  const result: Task | ErrorModel = yield call(
    runEffect,
    action,
    TaskEffects.updateTaskStatus,
    {
      taskId: action.payload.taskId,
      status: taskStatusKeyToValue[action.payload.destination.droppableId],
    }
  );
  if (resultHasError(result as ErrorModel)) {
    yield put(
      createAction(TaskActions.UPDATE_TASK_STATUS_LOCALLY, {
        taskId: action.payload.taskId,
        destination: action.payload.source,
        source: action.payload.destination,
      })
    );
    yield cancel();
  }
}

function* ADD_COMMENT(action: SagaAction) {
  const result: TaskHistory | ErrorModel = yield call(
    runEffect,
    action,
    TaskEffects.patchTask,
    action.payload.taskId,
    { comment: action.payload.comment }
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
}

function* PATCH_TASK(action: SagaAction) {
  const result: Task | ErrorModel = yield call(
    runEffect,
    action,
    TaskEffects.patchTask,
    action.payload.id,
    action.payload.data
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
}

export default function* taskSaga() {
  yield all([
    takeEvery(TaskActions.FETCH_TASKS, FETCH_TASKS),
    takeEvery(TaskActions.CREATE_TASK, CREATE_TASK),
    takeEvery(TaskActions.UPDATE_TASK_STATUS, UPDATE_TASK_STATUS),
    takeEvery(TaskActions.ADD_COMMENT, ADD_COMMENT),
    takeEvery(TaskActions.PATCH_TASK, PATCH_TASK),
  ]);
}
