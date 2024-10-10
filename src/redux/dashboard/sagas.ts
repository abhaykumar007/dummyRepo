import { all, call, takeEvery } from "redux-saga/effects";
import { runEffect } from "@/utilities/actionUtility";
import { SagaAction } from "@/types/redux";
import DashboardActions from "./action";
import DashboardEffects from "./effects";

function* REQUEST_HARVESTED_BREAKUP(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getHarvestedBreakup,
    action.payload
  );
}

function* REQUEST_BATCH_HARVEST(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getBatchHarvest,
    action.payload
  );
}

function* REQUEST_FARM_METRICS(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getFarmMetrics,
    action.payload
  );
}

function* REQUEST_FARM_UTILIZATION_ON_CROPS(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getFarmUtilizationBasedOnCrops,
    action.payload
  );
}

function* REQUEST_FARM_UTILIZATION_ON_STAGES(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getFarmUtilizationBasedOnStages,
    action.payload
  );
}

function* REQUEST_MORTALITY_RATE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getMortalityRate,
    action.payload
  );
}

function* REQUEST_DASHBOARD_TASKS(action: SagaAction) {
  yield call(
    runEffect,
    action,
    DashboardEffects.getDashboardTasks,
    action.payload
  );
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      DashboardActions.REQUEST_HARVESTED_BREAKUP,
      REQUEST_HARVESTED_BREAKUP
    ),
    takeEvery(DashboardActions.REQUEST_BATCH_HARVEST, REQUEST_BATCH_HARVEST),
    takeEvery(DashboardActions.REQUEST_FARM_METRICS, REQUEST_FARM_METRICS),
    takeEvery(
      DashboardActions.REQUEST_FARM_UTILIZATION_ON_CROPS,
      REQUEST_FARM_UTILIZATION_ON_CROPS
    ),
    takeEvery(
      DashboardActions.REQUEST_FARM_UTILIZATION_ON_STAGES,
      REQUEST_FARM_UTILIZATION_ON_STAGES
    ),
    takeEvery(DashboardActions.REQUEST_MORTALITY_RATE, REQUEST_MORTALITY_RATE),
    takeEvery(
      DashboardActions.REQUEST_DASHBOARD_TASKS,
      REQUEST_DASHBOARD_TASKS
    ),
  ]);
}
