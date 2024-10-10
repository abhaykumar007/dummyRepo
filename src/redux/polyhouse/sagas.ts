import { all, call, cancel, put, select, takeEvery } from "redux-saga/effects";
import PolyhouseActions from "./action";
import { createAction, runEffect } from "@/utilities/actionUtility";
import PolyhouseEffects from "./effects";
import { SagaAction } from "@/types/redux";
import {
  Graph,
  Lifecycle,
  Polyhouse,
  Schedule,
  Sensor,
} from "@/pages/polyhouse/types";
import FarmSelectors from "../farm/farmSelectors";
import PolyhouseSelectors from "./polyhouseSelectors";
import { Farm, Nursery, Zone } from "@/pages/farm/types";
import { errorDetail, errorModel } from "@/types/error";
import moment from "moment";
import { normalizeData } from "@/types/normalize";
import { resultHasError } from "@/utilities/onError";
import { successToast } from "@/utilities/toast";
import { router } from "@/routes";
import ErrorModel from "@/models/error/errorModel";
import routePaths from "@/config/routePaths";
import dayjs from "dayjs";
import { getTranslation } from "@/translation/i18n";
import { calculateDuration } from "@/pages/polyhouse/utils";

function* REQUEST_POLYHOUSES(action: SagaAction) {
  yield call(runEffect, action, PolyhouseEffects.getPolyhouses);
}

function* REQUEST_POLYHOUSE(action: SagaAction) {
  yield call(runEffect, action, PolyhouseEffects.getPolyhouse, action.payload);
}

function* REQUEST_ZONE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getZone,
    action.payload.polyhouseId,
    action.payload.zoneId
  );
}

function* REQUEST_NURSERY(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getNursery,
    action.payload.polyhouseId,
    action.payload.nurseryId
  );
}

function* REQUEST_COMPONENT_DATA_FOR_POLYHOUSE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getComponentsForPolyhouse,
    action.payload
  );
}

function* REQUEST_SENSOR_DATA_FOR_POLYHOUSE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getSensorsForPolyhouse,
    action.payload
  );
}

function* REQUEST_SENSOR_DATA_FOR_NURSERY(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getSensorForNursery,
    action.payload
  );
}

function* REQUEST_COMPONENT_DATA_FOR_NURSERY(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getComponentForNursery,
    action.payload
  );
}

function* REQUEST_SENSOR_DATA_FOR_ZONE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getSensorForZone,
    action.payload
  );
}

function* REQUEST_COMPONENT_DATA_FOR_ZONE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getComponentForZone,
    action.payload
  );
}

function* REQUEST_LIFE_CYCLE_FOR_POLYHOUSE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.getLifeCycleForPolyhouse,
    action.payload
  );
}

function* REQUEST_BATCH_COUNT(action: SagaAction) {
  yield call(runEffect, action, PolyhouseEffects.getBatchCount, action.payload);
}

function* REQUEST_GRAPH_DATA(action: SagaAction) {
  const { sensors, duration } = action.payload;
  for (const sensor of sensors) {
    if (sensor.parameters[0].isGraph) {
      const result: Graph = yield call(
        runEffect,
        action,
        PolyhouseEffects.getSensorGraphData,
        sensor.sensorId,
        duration
      );

      if (result as Graph) {
        const updatedLabels = result.labels.map((label) =>
          dayjs(label).format("DD-MM-YYYY HH:mm:ss")
        );
        yield put(
          PolyhouseActions.setGraphDataLocally({
            ...result,
            labels: updatedLabels,
          })
        );
      }
    }
  }
}

function* UPDATE_POLYHOUSES(action: SagaAction) {
  const farmId: string = yield select(FarmSelectors.SelectSelectedFarmId);
  const result: Polyhouse = yield call(
    runEffect,
    action,
    PolyhouseEffects.updatePolyhouse,
    farmId,
    action.payload.polyhouseId,
    action.payload.polyhouse
  );

  const polyhouses: normalizeData = yield select(
    PolyhouseSelectors.SelectPolyhouseList
  );

  let updatedPolyhouses = null;

  if (polyhouses) {
    updatedPolyhouses = {
      entities: {
        polyhouses: {
          ...polyhouses.entities.polyhouses,
          [action.payload.polyhouseId]: result,
        },
      },
      result: polyhouses.result,
    };
  }

  yield put(
    PolyhouseActions.updatePolyhouseLocally(
      result,
      updatedPolyhouses ? { ...updatedPolyhouses } : null
    )
  );
}

function* updateScheduleLocally(
  sensorId: string,
  parameterId: string,
  payload: { [k: string]: Schedule }
) {
  const { sensor, source }: { sensor: Sensor; source: string } = yield select(
    PolyhouseSelectors.SelectSensorById(sensorId)
  );

  let uiLabel = null;
  const updatedParameter = sensor.parameters.map((parameter) => {
    if (parameter.parameterId !== parameterId) return parameter;
    const schedule = Array.isArray(parameter.schedule)
      ? parameter.schedule
      : [];

    const scheduleIndex = schedule.findIndex(
      (sce: Schedule) => sce.id == payload.schedule.id
    );

    const updatedSchedule =
      scheduleIndex > -1
        ? schedule.map((sce: Schedule, index: number) =>
            index === scheduleIndex ? payload.schedule : sce
          )
        : [...schedule, payload.schedule];

    uiLabel = parameter.uiLabel;

    return {
      ...parameter,
      schedule: calculateDuration(updatedSchedule),
    };
  });

  if (uiLabel)
    yield put(
      PolyhouseActions.updateScheduleLocally(
        source,
        {
          ...sensor,
          parameters: updatedParameter,
        },
        uiLabel
      )
    );
}

function* DELETE_SCHEDULE(action: SagaAction) {
  const { sensorId, parameterId, scheduleId } = action.payload;
  const { sensor, source }: { sensor: Sensor; source: string } = yield select(
    PolyhouseSelectors.SelectSensorById(sensorId)
  );

  yield call(
    runEffect,
    action,
    PolyhouseEffects.deleteSchedule,
    sensorId,
    parameterId,
    typeof scheduleId === "number" ? String(scheduleId) : scheduleId
  );

  let uiLabel = null;
  const updatedParameters = sensor.parameters.map((parameter) => {
    if (parameter.parameterId !== parameterId) return parameter;

    const schedule: Schedule[] | null = Array.isArray(parameter.schedule)
      ? parameter.schedule
      : [];

    const updatedSchedule = schedule.filter((sce) => sce.id != scheduleId);
    uiLabel = parameter.uiLabel;
    return {
      ...parameter,
      schedule: updatedSchedule,
    };
  });

  if (uiLabel)
    yield put(
      PolyhouseActions.updateScheduleLocally(
        source,
        {
          ...sensor,
          parameters: updatedParameters,
        },
        uiLabel
      )
    );
}

function* ADD_SCHEDULE(action: SagaAction) {
  const { sensorId, parameterId, payload } = action.payload;

  yield call(
    runEffect,
    action,
    PolyhouseEffects.addSchedule,
    sensorId,
    parameterId,
    payload
  );

  yield updateScheduleLocally(sensorId, parameterId, payload);
}

function* UPADTE_SCHEDULE(action: SagaAction) {
  const { sensorId, parameterId, payload } = action.payload;

  yield call(
    runEffect,
    action,
    PolyhouseEffects.updateSchedule,
    sensorId,
    parameterId,
    payload
  );

  yield updateScheduleLocally(sensorId, parameterId, payload);
}

function* UPDATE_NURSERY(action: SagaAction) {
  const farmId: string = yield select(FarmSelectors.SelectSelectedFarmId);
  const result: Nursery | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.updateNursery,
    farmId,
    action.payload.polyhouseId,
    action.payload.nurseryId,
    action.payload.nursery
  );

  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const filteredNursery: Nursery[] = selectedPolyhouse.nurseries.filter(
    (nursery) => nursery.nurseryId !== action.payload.nurseryId
  );

  const updatedPolyhouse: Polyhouse = {
    ...selectedPolyhouse,
    nurseries: (result as Nursery).nurseryId
      ? [...filteredNursery, result as Nursery]
      : selectedPolyhouse.nurseries,
  };

  const polyhouses: normalizeData = yield select(
    PolyhouseSelectors.SelectPolyhouseList
  );

  let updatedPolyhouses = null;

  if (polyhouses) {
    updatedPolyhouses = {
      entities: {
        polyhouses: {
          ...polyhouses.entities.polyhouses,
          [action.payload.polyhouseId]: updatedPolyhouse,
        },
      },
      result: polyhouses.result,
    };
  }

  yield put(
    PolyhouseActions.updatePolyhouseLocally(
      updatedPolyhouse,
      updatedPolyhouses ? { ...updatedPolyhouses } : null
    )
  );
}

function* UPDATE_ZONE(action: SagaAction) {
  const farmId: string = yield select(FarmSelectors.SelectSelectedFarmId);
  const result: Zone | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.updateZone,
    farmId,
    action.payload.polyhouseId,
    action.payload.zoneId,
    action.payload.zone
  );
  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const filteredZone: Zone[] = selectedPolyhouse.zones.filter(
    (zone) => zone.zoneId !== action.payload.zoneId
  );
  const updatedPolyhouse: Polyhouse = {
    ...selectedPolyhouse,
    zones: (result as Zone).zoneId
      ? [...filteredZone, result as Zone]
      : selectedPolyhouse.zones,
  };

  const polyhouses: normalizeData = yield select(
    PolyhouseSelectors.SelectPolyhouseList
  );

  let updatedPolyhouses = null;

  if (polyhouses) {
    updatedPolyhouses = {
      entities: {
        polyhouses: {
          ...polyhouses.entities.polyhouses,
          [action.payload.polyhouseId]: updatedPolyhouse,
        },
      },
      result: polyhouses.result,
    };
  }

  yield put(
    PolyhouseActions.updatePolyhouseLocally(
      updatedPolyhouse,
      updatedPolyhouses ? { ...updatedPolyhouses } : null
    )
  );
}

function* UPDATE_SENSOR_DATA(action: SagaAction) {
  const farmId: string = yield select(FarmSelectors.SelectSelectedFarmId);
  const selectedSensorData: { [k: string]: Sensor } = yield select(
    PolyhouseSelectors.SelectSensorData
  );
  const selectedComponentData: { [k: string]: Sensor } = yield select(
    PolyhouseSelectors.SelectComponentData
  );
  const graph: { [k: string]: Graph } | null = yield select(
    PolyhouseSelectors.SelectGraph
  );

  if (action.payload.farm.id === farmId) {
    const sensors = [
      ...Object.values(selectedSensorData ?? {}),
      ...Object.values(selectedComponentData ?? {}),
    ].flat();

    const updatedGraphs: Graph[] = [];
    const updatedSensors = sensors.map((currentSensor) => {
      const updatedParameters = currentSensor.parameters.map((parameter) => {
        const matchingEvent = action.payload.events[0].payload.find(
          (sensor: { [k: string]: string | number }) =>
            sensor.sensorId === currentSensor.sensorId &&
            sensor.parameter === parameter.parameterId
        );
        if (matchingEvent) {
          if (
            graph &&
            graph?.[currentSensor.sensorId]?.parameterId ===
              parameter.parameterId
          ) {
            const updatedGraph: Graph = {
              ...graph[currentSensor.sensorId],
              labels: [
                ...graph[currentSensor.sensorId].labels,
                moment
                  .unix(action.payload.timestamp)
                  .format("DD-MM-YYYY HH:mm:ss"),
              ],
              values: [
                ...graph[currentSensor.sensorId].values,
                matchingEvent.value,
              ],
            };

            updatedGraphs.push(updatedGraph);
          }
          return { ...parameter, currentValue: matchingEvent.value };
        }
        return parameter;
      });

      return { ...currentSensor, parameters: updatedParameters };
    });

    for (const updatedGraph of updatedGraphs) {
      yield put(PolyhouseActions.setGraphDataLocally(updatedGraph));
    }
    yield put(
      createAction(
        PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED,
        updatedSensors
      )
    );
  }
}

function* DELETE_POLYHOUSE(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.deletePolyhouse,
    action.payload
  );
}

function* ADD_ZONE(action: SagaAction) {
  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const result: Zone | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.addZone,
    selectedPolyhouse.polyhouseId,
    action.payload
  );

  if ((result as Zone).zoneId) {
    const updatedPolyhouse: Polyhouse = {
      ...selectedPolyhouse,
      zones: [...selectedPolyhouse.zones, result as Zone],
    };

    const polyhouses: normalizeData = yield select(
      PolyhouseSelectors.SelectPolyhouseList
    );

    let updatedPolyhouses = null;

    if (polyhouses) {
      updatedPolyhouses = {
        entities: {
          polyhouses: {
            ...polyhouses.entities.polyhouses,
            [selectedPolyhouse.polyhouseId]: updatedPolyhouse,
          },
        },
        result: polyhouses.result,
      };
    }

    yield put(
      PolyhouseActions.updatePolyhouseLocally(
        updatedPolyhouse,
        updatedPolyhouses ? { ...updatedPolyhouses } : null
      )
    );
  }
}

function* DELETE_ZONE(action: SagaAction) {
  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const result: Zone | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.deleteZone,
    selectedPolyhouse.polyhouseId,
    action.payload
  );

  if (!(result as Zone).zoneId) {
    const filteredZone: Zone[] = selectedPolyhouse.zones.filter(
      (zone) => zone.zoneId !== action.payload
    );
    const updatedPolyhouse: Polyhouse = {
      ...selectedPolyhouse,
      zones: [...filteredZone],
    };

    const polyhouses: normalizeData = yield select(
      PolyhouseSelectors.SelectPolyhouseList
    );

    let updatedPolyhouses = null;

    if (polyhouses) {
      updatedPolyhouses = {
        entities: {
          polyhouses: {
            ...polyhouses.entities.polyhouses,
            [selectedPolyhouse.polyhouseId]: updatedPolyhouse,
          },
        },
        result: polyhouses.result,
      };
    }

    yield put(
      PolyhouseActions.updatePolyhouseLocally(
        updatedPolyhouse,
        updatedPolyhouses ? { ...updatedPolyhouses } : null
      )
    );
  }
}

function* ADD_NURSERY(action: SagaAction) {
  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const result: Nursery | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.addNursery,
    selectedPolyhouse.polyhouseId,
    action.payload
  );

  if ((result as Nursery).nurseryId) {
    const updatedPolyhouse: Polyhouse = {
      ...selectedPolyhouse,
      nurseries: [...selectedPolyhouse.nurseries, result as Nursery],
    };

    const polyhouses: normalizeData = yield select(
      PolyhouseSelectors.SelectPolyhouseList
    );

    let updatedPolyhouses = null;

    if (polyhouses) {
      updatedPolyhouses = {
        entities: {
          polyhouses: {
            ...polyhouses.entities.polyhouses,
            [selectedPolyhouse.polyhouseId]: updatedPolyhouse,
          },
        },
        result: polyhouses.result,
      };
    }

    yield put(
      PolyhouseActions.updatePolyhouseLocally(
        updatedPolyhouse,
        updatedPolyhouses ? { ...updatedPolyhouses } : null
      )
    );
  }
}

function* DELETE_NURSERY(action: SagaAction) {
  const selectedPolyhouse: Polyhouse = yield select(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const result: Nursery | errorDetail = yield call(
    runEffect,
    action,
    PolyhouseEffects.deleteNursery,
    selectedPolyhouse.polyhouseId,
    action.payload
  );

  if (!(result as Nursery).nurseryId) {
    const filteredNursery: Nursery[] = selectedPolyhouse.nurseries.filter(
      (nursery) => nursery.nurseryId !== action.payload
    );
    const updatedPolyhouse: Polyhouse = {
      ...selectedPolyhouse,
      nurseries: [...filteredNursery],
    };

    const polyhouses: normalizeData = yield select(
      PolyhouseSelectors.SelectPolyhouseList
    );

    let updatedPolyhouses = null;

    if (polyhouses) {
      updatedPolyhouses = {
        entities: {
          polyhouses: {
            ...polyhouses.entities.polyhouses,
            [selectedPolyhouse.polyhouseId]: updatedPolyhouse,
          },
        },
        result: polyhouses.result,
      };
    }

    yield put(
      PolyhouseActions.updatePolyhouseLocally(
        updatedPolyhouse,
        updatedPolyhouses ? { ...updatedPolyhouses } : null
      )
    );
  }
}

function* ADD_SENSOR_DATA(action: SagaAction) {
  yield call(
    runEffect,
    action,
    PolyhouseEffects.addSensorData,
    action.payload.data,
    action.payload.deviceId,
    action.payload.sensorId
  );
}

function* ADD_LIFECYCLE(action: SagaAction) {
  const result: Lifecycle | errorModel = yield call(
    runEffect,
    action,
    PolyhouseEffects.addLifeCycle,
    action.payload
  );

  if (resultHasError(result as errorModel)) yield cancel();

  yield put(
    PolyhouseActions.requestLifeCycleForPolyhouse(action.payload.polyhouseId)
  );

  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.createdSuccessfully")
  );
  router.navigate(-1);
}

function* UPDATE_LIFECYCLE_LOCALLY(
  workflowInstancesId: string,
  lifeCycle: Lifecycle
): Generator {
  const SelectLifeCycles: any = yield select(
    PolyhouseSelectors.SelectLifeCycles
  );

  const updatedLifeCycleList = [...SelectLifeCycles];

  const updateLifeCycleIndex = updatedLifeCycleList.findIndex(
    (lifeCycle: Lifecycle) =>
      lifeCycle.workflowInstanceId === workflowInstancesId
  );

  updatedLifeCycleList[updateLifeCycleIndex] = lifeCycle;

  yield put(PolyhouseActions.updateLifeCycleLocally(updatedLifeCycleList));
}

function* UPDATE_LIFECYCLE(action: SagaAction): Generator {
  const { payload, workflowInstancesId, isRedirect, polyhouseId } =
    action.payload;
  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.updateLifeCycle,
    payload,
    workflowInstancesId,
    polyhouseId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  yield call(UPDATE_LIFECYCLE_LOCALLY, workflowInstancesId, response);

  if (isRedirect) {
    successToast(
      getTranslation("polyhouse.polyhouseDetails.lifecycle.updatedSuccessfully")
    );
    router.navigate(-1);
  }
}

function* START_LIFECYCLE(action: SagaAction): Generator {
  const { payload, workflowInstancesId, polyhouseId } = action.payload;

  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.startLifeCycle,
    payload,
    workflowInstancesId,
    polyhouseId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  yield call(UPDATE_LIFECYCLE_LOCALLY, workflowInstancesId, response);

  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.startedSuccessfully")
  );

  router.navigate(
    routePaths.startLifeCycle
      .replace(":polyhouseId", polyhouseId)
      .replace(":lifeCycleId", workflowInstancesId),
    { replace: true }
  );
}

function* LIFECYCLE_COMPLETED(action: SagaAction): Generator {
  const { workflowInstancesId, polyhouseId, handleModalClose } = action.payload;

  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.lifeCycleCompleted,
    workflowInstancesId,
    polyhouseId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  yield call(UPDATE_LIFECYCLE_LOCALLY, workflowInstancesId, response);

  handleModalClose();
  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.completedSuccessfully")
  );
}

function* MOVE_CROPS_IN_LIFECYCLE(action: SagaAction): Generator {
  const {
    workflowInstancesId,
    polyhouseId,
    handleModalClose,
    stepId,
    payload,
  } = action.payload;

  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.moveCropsStepInLifeCycle,
    payload,
    workflowInstancesId,
    polyhouseId,
    stepId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  yield call(UPDATE_LIFECYCLE_LOCALLY, workflowInstancesId, response);

  handleModalClose();
  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.movedSuccessfully")
  );
}

function* HARVEST_CROPS_IN_LIFECYCLE(action: SagaAction): Generator {
  const {
    workflowInstancesId,
    polyhouseId,
    handleModalClose,
    stepId,
    payload,
  } = action.payload;

  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.harvestCropsStepInLifeCycle,
    payload,
    workflowInstancesId,
    polyhouseId,
    stepId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  yield call(UPDATE_LIFECYCLE_LOCALLY, workflowInstancesId, response);

  handleModalClose();
  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.harvestedSuccessfully")
  );
}

function* DELETE_LIFECYCLE(action: SagaAction): Generator {
  const { workflowInstancesId } = action.payload;

  const response = yield call(
    runEffect,
    action,
    PolyhouseEffects.deleteLifeCycle,
    workflowInstancesId
  );

  if (resultHasError(response as ErrorModel)) yield cancel();

  successToast(
    getTranslation("polyhouse.polyhouseDetails.lifecycle.deletedSuccessfully")
  );
  router.navigate(-1);
}

function* ADD_SENSOR(action: SagaAction) {
  const currentFarmId: string = yield select(
    FarmSelectors.SelectSelectedFarmId
  );
  const cuurentFarm: Farm = yield select(
    FarmSelectors.SelectFarmByFarmId,
    currentFarmId
  );
  action.payload.deviceId = cuurentFarm.device?.deviceId;
  action.payload.version = "1.0.0";
  action.payload.iotDeviceVersion = "1.0.0";
  action.payload.provider = "growloc";
  const response: Sensor | ErrorModel = yield call(
    runEffect,
    action,
    PolyhouseEffects.addSensor,
    action.payload
  );

  if (resultHasError(response as ErrorModel)) yield cancel();
  let sensors: Sensor[];
  const parameters = action.payload.parameters;
  const isGraph = parameters[0].isGraph;
  if (isGraph) {
    sensors = yield select(PolyhouseSelectors.SelectSensors);
  } else {
    sensors = yield select(PolyhouseSelectors.SelectComponents);
  }
  const updatedSensors = [...sensors, response as Sensor];
  if(isGraph){
    yield put(PolyhouseActions.setSensors(updatedSensors));
  }
  else{
    yield put(PolyhouseActions.setComponents(updatedSensors));
  }
  
  
  const sensorArea = action.meta.sensorArea;
  switch (sensorArea) {
    case "polyhouse":
      if (isGraph) {
        yield put(
          createAction(
            PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED,
            updatedSensors
          )
        );
      }else{
        yield put(
          createAction(
            PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED,
            updatedSensors
          )
        );
      }
      break;
    case "nursery":
      if (isGraph) {
        yield put(
          createAction(
            PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED,
            updatedSensors
          )
        );
      }else{
        yield put(
          createAction(
            PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED,
            updatedSensors
          )
        );
      }
      break;
    case "zone":
      if (isGraph) {
        yield put(
          createAction(
            PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED,
            updatedSensors
          )
        );
      }else{
        yield put(
          createAction(
            PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED,
            updatedSensors
          )
        );
      }
      break;
  }
  successToast("Sensor added successfully!");
}

function* DELETE_SENSOR(action: SagaAction) {
  const response: ErrorModel = yield call(
    runEffect,
    action,
    PolyhouseEffects.deleteSensor,
    action.payload
  );

  const sensors: Sensor[] = yield select(PolyhouseSelectors.SelectSensors);
  const components: Sensor[] = yield select(PolyhouseSelectors.SelectComponents);
  const updatedSensors = sensors.filter(
    (sensor) => sensor.sensorId !== action.payload
  );
  const updatedComponents = components.filter(
    (component) => component.sensorId !== action.payload
  );
  yield put(PolyhouseActions.setSensors(updatedSensors));
  yield put(PolyhouseActions.setComponents(updatedComponents));
  const sensorArea = action.meta.sensorArea;
  switch (sensorArea) {
    case "polyhouse":
      yield put(
        createAction(
          PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED,
          updatedSensors
        )
      );
      yield put(
        createAction(
          PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED,
          updatedComponents
        )
      );
      break;
    case "nursery":
      yield put(
        createAction(
          PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED,
          updatedSensors
        )
      );
      yield put(
        createAction(
          PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED,
          updatedComponents
        )
      );
      break;
    case "zone":
      yield put(
        createAction(
          PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED,
          updatedSensors
        )
      );
      yield put(
        createAction(
          PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED,
          updatedComponents
        )
      );
      break;
  }

  if (resultHasError(response as ErrorModel)) yield cancel();

  successToast("Sensor deleted successfully!");
}

export default function* rootSaga() {
  yield all([
    takeEvery(PolyhouseActions.REQUEST_POLYHOUSES, REQUEST_POLYHOUSES),
    takeEvery(PolyhouseActions.REQUEST_POLYHOUSE, REQUEST_POLYHOUSE),
    takeEvery(PolyhouseActions.REQUEST_ZONE, REQUEST_ZONE),
    takeEvery(PolyhouseActions.REQUEST_NURSERY, REQUEST_NURSERY),
    takeEvery(
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE,
      REQUEST_SENSOR_DATA_FOR_POLYHOUSE
    ),
    takeEvery(
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE,
      REQUEST_COMPONENT_DATA_FOR_POLYHOUSE
    ),
    takeEvery(
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY,
      REQUEST_SENSOR_DATA_FOR_NURSERY
    ),
    takeEvery(
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_NURSERY,
      REQUEST_COMPONENT_DATA_FOR_NURSERY
    ),
    takeEvery(
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE,
      REQUEST_SENSOR_DATA_FOR_ZONE
    ),
    takeEvery(
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE,
      REQUEST_COMPONENT_DATA_FOR_ZONE
    ),
    takeEvery(PolyhouseActions.REQUEST_BATCH_COUNT, REQUEST_BATCH_COUNT),
    takeEvery(PolyhouseActions.REQUEST_GRAPH_DATA, REQUEST_GRAPH_DATA),
    takeEvery(
      PolyhouseActions.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE,
      REQUEST_LIFE_CYCLE_FOR_POLYHOUSE
    ),
    takeEvery(PolyhouseActions.UPDATE_POLYHOUSES, UPDATE_POLYHOUSES),
    takeEvery(PolyhouseActions.UPDATE_NURSERY, UPDATE_NURSERY),
    takeEvery(PolyhouseActions.UPDATE_ZONE, UPDATE_ZONE),
    takeEvery(PolyhouseActions.UPDATE_SENSOR_DATA, UPDATE_SENSOR_DATA),
    takeEvery(PolyhouseActions.DELETE_POLYHOUSE, DELETE_POLYHOUSE),
    takeEvery(PolyhouseActions.ADD_ZONE, ADD_ZONE),
    takeEvery(PolyhouseActions.DELETE_ZONE, DELETE_ZONE),
    takeEvery(PolyhouseActions.ADD_NURSERY, ADD_NURSERY),
    takeEvery(PolyhouseActions.DELETE_NURSERY, DELETE_NURSERY),
    takeEvery(PolyhouseActions.ADD_SENSOR, ADD_SENSOR),
    takeEvery(PolyhouseActions.DELETE_SENSOR, DELETE_SENSOR),
    takeEvery(PolyhouseActions.ADD_SENSOR_DATA, ADD_SENSOR_DATA),
    takeEvery(PolyhouseActions.ADD_LIFECYCLE, ADD_LIFECYCLE),
    takeEvery(PolyhouseActions.UPDATE_LIFECYCLE, UPDATE_LIFECYCLE),
    takeEvery(PolyhouseActions.START_LIFECYCLE, START_LIFECYCLE),
    takeEvery(PolyhouseActions.LIFECYCLE_COMPLETED, LIFECYCLE_COMPLETED),
    takeEvery(
      PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE,
      MOVE_CROPS_IN_LIFECYCLE
    ),
    takeEvery(
      PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE,
      HARVEST_CROPS_IN_LIFECYCLE
    ),
    takeEvery(PolyhouseActions.DELETE_LIFECYCLE, DELETE_LIFECYCLE),
    takeEvery(PolyhouseActions.UPADTE_SCHEDULE, UPADTE_SCHEDULE),
    takeEvery(PolyhouseActions.ADD_SCHEDULE, ADD_SCHEDULE),
    takeEvery(PolyhouseActions.DELETE_SCHEDULE, DELETE_SCHEDULE),
  ]);
}
