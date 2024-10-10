import { MoveCropsInLifeCyclePayload, Schedule } from "@/pages/polyhouse/types";
import api from "@/utilities/api";
import {
  delToModel,
  getToModel,
  patchToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import FarmSelectors from "../farm/farmSelectors";
import { store } from "../store";
import BatchModel from "./models/batchModel";
import GraphModel from "./models/graphModel";
import LifeCycleModel from "./models/lifeCycleModel";
import PolyhouseModel, {
  NurseryModel,
  ZoneModel,
} from "./models/polyhouseModel";
import SensorModel from "./models/sensorModel";

export default class PolyhouseEffects {
  static getPolyhouses() {
    return getToModel(
      PolyhouseModel,
      api.POLYHOUSES.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
    );
  }

  static getPolyhouse(polyhouseId: string) {
    return getToModel(
      PolyhouseModel,
      api.POLYHOUSE.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":polyhouseId", polyhouseId)
    );
  }

  static getZone(polyhouseId: string, zoneId: string) {
    return getToModel(
      ZoneModel,
      api.ZONE.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":zoneId", zoneId)
    );
  }

  static getNursery(polyhouseId: string, nurseryId: string) {
    return getToModel(
      NurseryModel,
      api.NURSERY.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":nurseryId", nurseryId)
    );
  }

  static getSensorsForPolyhouse(polyhouseId: string) {
    return getToModel(
      SensorModel,
      api.POLYHOUSE_SENSOR_DATA.replace(":polyhouseId", polyhouseId)
    );
  }

  static getComponentsForPolyhouse(polyhouseId: string) {
    return getToModel(
      SensorModel,
      api.POLYHOUSE_COMPONENT_DATA.replace(":polyhouseId", polyhouseId)
    );
  }

  static getSensorForNursery(nurseryId: string) {
    return getToModel(
      SensorModel,
      api.NURSERY_SENSOR_DATA.replace(":nurseryId", nurseryId)
    );
  }

  static getComponentForNursery(nurseryId: string) {
    return getToModel(
      SensorModel,
      api.NURSERY_COMPONENT_DATA.replace(":nurseryId", nurseryId)
    );
  }

  static getLifeCycleForPolyhouse(polyhouseId: string) {
    return getToModel(
      LifeCycleModel,
      api.LIFE_CYCLE.replace(":polyhouseId", polyhouseId)
    );
  }

  static getSensorForZone(zoneId: string) {
    return getToModel(
      SensorModel,
      api.ZONE_SENSOR_DATA.replace(":zoneId", zoneId)
    );
  }

  static getComponentForZone(zoneId: string) {
    return getToModel(
      SensorModel,
      api.ZONE_COMPONENT_DATA.replace(":zoneId", zoneId)
    );
  }

  static getBatchCount(polyhouseId: string) {
    return getToModel(
      BatchModel,
      api.BATCH.replace(":polyhouseId", polyhouseId)
    );
  }

  static getSensorGraphData(sensorId: string, duration: string) {
    return getToModel(
      GraphModel,
      api.SENSOR_GRAPH_DATA.replace(":sensorId", sensorId).replace(
        ":duration",
        duration
      )
    );
  }

  static updatePolyhouse(
    farmId: string,
    polyhouseId: string,
    payload: { [k: string]: string | number }
  ) {
    return putToModel(
      PolyhouseModel,
      api.POLYHOUSE.replace(":farmId", farmId).replace(
        ":polyhouseId",
        polyhouseId
      ),
      payload
    );
  }

  static updateNursery(
    farmId: string,
    polyhouseId: string,
    nurseryId: string,
    payload: { [k: string]: string | number }
  ) {
    return putToModel(
      NurseryModel,
      api.NURSERY.replace(":farmId", farmId)
        .replace(":polyhouseId", polyhouseId)
        .replace(":nurseryId", nurseryId),
      payload
    );
  }

  static updateZone(
    farmId: string,
    polyhouseId: string,
    zoneId: string,
    payload: { [k: string]: string | number }
  ) {
    return putToModel(
      ZoneModel,
      api.ZONE.replace(":farmId", farmId)
        .replace(":polyhouseId", polyhouseId)
        .replace(":zoneId", zoneId),
      payload
    );
  }

  static deletePolyhouse(polyhouseId: string) {
    return delToModel(
      PolyhouseModel,
      api.POLYHOUSE.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":polyhouseId", polyhouseId)
    );
  }

  static addZone(polyhouseId: string, zone: any) {
    return postToModel(
      ZoneModel,
      api.ZONES.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":polyhouseId", polyhouseId),
      zone
    );
  }

  static deleteZone(polyhouseId: string, zoneId: string) {
    return delToModel(
      ZoneModel,
      api.ZONE.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":zoneId", zoneId)
    );
  }

  static addNursery(polyhouseId: string, nursery: any) {
    return postToModel(
      NurseryModel,
      api.NURSERIES.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":polyhouseId", polyhouseId),
      nursery
    );
  }

  static deleteNursery(polyhouseId: string, nurseryId: string) {
    return delToModel(
      NurseryModel,
      api.NURSERY.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":nurseryId", nurseryId)
    );
  }

  static addSensorData(payload: any, deviceId: string, sensorId: string) {
    return postToModel(
      SensorModel,
      api.SENSOR_DATA.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
        .replace(":deviceId", deviceId)
        .replace(":sensorId", sensorId),
      payload
    );
  }

  static addLifeCycle(payload: any) {
    return postToModel(LifeCycleModel, api.WORKFLOW_INSTANCES, payload);
  }

  static updateLifeCycle(
    payload: any,
    workflowInstancesId: string,
    polyhouseId: string
  ) {
    return putToModel(
      LifeCycleModel,
      api.POLYHOUSE_WORKFLOW_INSTANCES.replace(
        ":workflowInstancesId",
        workflowInstancesId
      ).replace(":polyhouseId", polyhouseId),
      payload
    );
  }

  static startLifeCycle(
    payload: any,
    workflowInstancesId: string,
    polyhouseId: string
  ) {
    return putToModel(
      LifeCycleModel,
      api.START_LIFECYCLE.replace(
        ":workflowInstancesId",
        workflowInstancesId
      ).replace(":polyhouseId", polyhouseId),
      payload
    );
  }

  static lifeCycleCompleted(workflowInstancesId: string, polyhouseId: string) {
    return patchToModel(
      LifeCycleModel,
      api.LIFECYCLE_COMPLETED.replace(
        ":workflowInstancesId",
        workflowInstancesId
      ).replace(":polyhouseId", polyhouseId)
    );
  }

  static moveCropsStepInLifeCycle(
    payload: MoveCropsInLifeCyclePayload,
    workflowInstancesId: string,
    polyhouseId: string,
    stepId: string
  ) {
    return putToModel(
      LifeCycleModel,
      api.MOVE_CROPS_LIFECYCLE.replace(
        ":workflowInstancesId",
        workflowInstancesId
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":stepId", stepId),
      payload
    );
  }

  static harvestCropsStepInLifeCycle(
    payload: any,
    workflowInstancesId: string,
    polyhouseId: string,
    stepId: string
  ) {
    return postToModel(
      LifeCycleModel,
      api.HARVEST_CROPS_LIFECYCLE.replace(
        ":workflowInstancesId",
        workflowInstancesId
      )
        .replace(":polyhouseId", polyhouseId)
        .replace(":stepId", stepId),
      payload
    );
  }

  static deleteLifeCycle(workflowInstancesId: string) {
    return delToModel(
      LifeCycleModel,
      api.DELETE_LIFE_CYCLE.replace(":workflowInstancesId", workflowInstancesId)
    );
  }

  static updateSchedule(
    sensorId: string,
    parameterId: string,
    payload: Schedule
  ) {
    return patchToModel(
      LifeCycleModel,
      api.SENSOR_UPDATE.replace(":sensorId", sensorId).replace(
        ":parameterId",
        parameterId
      ),
      payload
    );
  }

  static addSensor(payload: any) {
    return postToModel(SensorModel, api.SENSORS, payload);
  }

  static addSchedule(sensorId: string, parameterId: string, payload: Schedule) {
    return patchToModel(
      LifeCycleModel,
      api.SENSOR_UPDATE.replace(":sensorId", sensorId).replace(
        ":parameterId",
        parameterId
      ),
      payload
    );
  }

  static deleteSchedule(
    sensorId: string,
    parameterId: string,
    scheduleId: string
  ) {
    return delToModel(
      LifeCycleModel,
      api.SENSOR_SCHEDULE.replace(":sensorId", sensorId)
        .replace(":parameterId", parameterId)
        .replace(":scheduleId", scheduleId)
    );
  }
  static deleteSensor(sensorId: string) {
    return delToModel(SensorModel, api.SENSOR.replace(":sensorId", sensorId));
  }
}
