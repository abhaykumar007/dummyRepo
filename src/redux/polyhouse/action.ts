import { Nursery, Zone } from "@/pages/farm/types";
import {
  Graph,
  HarvestCropsInLifeCyclePayload,
  Lifecycle,
  MoveCropsInLifeCyclePayload,
  Polyhouse,
  Sensor,
  AddSensorData,
  SaveLifeCyclePayload,
  StartLifeCyclePayload,
  Schedule,
} from "@/pages/polyhouse/types";
import { normalizeData } from "@/types/normalize";
import { createAction } from "@/utilities/actionUtility";

const PolyhouseActions = {
  REQUEST_POLYHOUSES: "Polyhouses/REQUEST_POLYHOUSES",
  REQUEST_POLYHOUSES_FINISHED: "Polyhouses/REQUEST_POLYHOUSES_FINISHED",
  SET_SELECTED_POLYHOUSE: "Polyhouses/SET_SELECTED_POLYHOUSE",
  UPDATE_POLYHOUSES: "Polyhouses/UPDATE_POLYHOUSES",
  UPDATE_POLYHOUSES_FINISHED: "Polyhouses/UPDATE_POLYHOUSES_FINISHED",
  REQUEST_SENSOR_DATA_FOR_POLYHOUSE:
    "Polyhouses/REQUEST_SENSOR_DATA_FOR_POLYHOUSE",
  REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED:
    "Polyhouses/REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED",
  REQUEST_COMPONENT_DATA_FOR_POLYHOUSE:
    "Polyhouses/REQUEST_COMPONENT_DATA_FOR_POLYHOUSE",
  REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED:
    "Polyhouses/REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED",
  REQUEST_BATCH_COUNT: "Polyhouses/REQUEST_BATCH_COUNT",
  REQUEST_BATCH_COUNT_FINISHED: "Polyhouses/REQUEST_BATCH_COUNT_FINISHED",
  SET_SELECTED_SENSOR: "Polyhouses/SET_SELECTED_SENSOR",
  REQUEST_GRAPH_DATA: "Polyhouses/REQUEST_GRAPH_DATA",
  REQUEST_GRAPH_DATA_FINISHED: "Polyhouses/REQUEST_GRAPH_DATA_FINISHED",
  SET_GRAPH_DATA_LOCALLY: "Polyhouses/SET_GRAPH_DATA_LOCALLY",
  SET_SELECTED_NURSERY: "Polyhouses/SET_SELECTED_NURSERY",
  REQUEST_SENSOR_DATA_FOR_NURSERY: "Polyhouses/REQUEST_SENSOR_DATA_FOR_NURSERY",
  REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED:
    "Polyhouses/REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED",
  REQUEST_COMPONENT_DATA_FOR_NURSERY:
    "Polyhouses/REQUEST_COMPONENT_DATA_FOR_NURSERY",
  REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED:
    "Polyhouses/REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED",
  SET_SELECTED_ZONE: "Polyhouses/SET_SELECTED_ZONE",
  REQUEST_SENSOR_DATA_FOR_ZONE: "Polyhouses/REQUEST_SENSOR_DATA_FOR_ZONE",
  REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED:
    "Polyhouses/REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED",
  REQUEST_COMPONENT_DATA_FOR_ZONE: "Polyhouses/REQUEST_COMPONENT_DATA_FOR_ZONE",
  REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED:
    "Polyhouses/REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED",
  REQUEST_LIFE_CYCLE_FOR_POLYHOUSE:
    "Polyhouses/REQUEST_LIFE_CYCLE_FOR_POLYHOUSE",
  REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED:
    "Polyhouses/REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED",
  UPDATE_ZONE: "Polyhouses/UPDATE_ZONE",
  UPDATE_ZONE_FINISHED: "Polyhouses/UPDATE_ZONE_FINISHED",
  UPDATE_NURSERY: "Polyhouses/UPDATE_NURSERY",
  UPDATE_NURSERY_FINISHED: "Polyhouses/UPDATE_NURSERY_FINISHED",
  UPDATE_POLYHOUSE_LOCALLY: "Polyhouses/UPDATE_POLYHOUSE_LOCALLY",
  REQUEST_POLYHOUSE: "Polyhouses/REQUEST_POLYHOUSE",
  REQUEST_POLYHOUSE_FINISHED: "Polyhouses/REQUEST_POLYHOUSE_FINISHED",
  REQUEST_ZONE: "Polyhouses/REQUEST_ZONE",
  REQUEST_ZONE_FINISHED: "Polyhouses/REQUEST_ZONE_FINISHED",
  REQUEST_NURSERY: "Polyhouses/REQUEST_NURSERY",
  REQUEST_NURSERY_FINISHED: "Polyhouses/REQUEST_NURSERY_FINISHED",
  UPDATE_SENSOR_DATA: "Polyhouses/UPDATE_SENSOR_DATA",
  DELETE_POLYHOUSE: "Polyhouses/DELETE_POLYHOUSE",
  DELETE_POLYHOUSE_FINISHED: "Polyhouses/DELETE_POLYHOUSE_FINISHED",
  ADD_ZONE: "Polyhouses/ADD_ZONE",
  ADD_ZONE_FINISHED: "Polyhouses/ADD_ZONE_FINISHED",
  DELETE_ZONE: "Polyhouses/DELETE_ZONE",
  DELETE_ZONE_FINISHED: "Polyhouses/DELETE_ZONE_FINISHED",
  ADD_NURSERY: "Polyhouses/ADD_NURSERY",
  ADD_NURSERY_FINISHED: "Polyhouses/ADD_NURSERY_FINISHED",
  DELETE_NURSERY: "Polyhouses/DELETE_NURSERY",
  DELETE_NURSERY_FINISHED: "Polyhouses/DELETE_NURSERY_FINISHED",
  ADD_SENSOR_DATA: "Polyhouses/ADD_SENSOR_DATA",
  ADD_SENSOR_DATA_FINISHED: "Polyhouses/ADD_SENSOR_DATA_FINISHED",
  ADD_LIFECYCLE: "Polyhouses/ADD_LIFECYCLE",
  ADD_LIFECYCLE_FINISHED: "Polyhouses/ADD_LIFECYCLE_FINISHED",
  ADD_SENSOR: "Polyhouses/ADD_SENSOR",
  ADD_SENSOR_FINISHED: "Polyhouses/ADD_SENSOR_FINISHED",
  DELETE_SENSOR: "Polyhouses/DELETE_SENSOR",
  DELETE_SENSOR_FINISHED: "Polyhouses/DELETE_SENSOR_FINISHED",
  UPDATE_LIFECYCLE: "Polyhouses/UPDATE_LIFECYCLE",
  UPDATE_LIFECYCLE_FINISHED: "Polyhouses/UPDATE_LIFECYCLE_FINISHED",
  START_LIFECYCLE: "Polyhouses/START_LIFECYCLE",
  START_LIFECYCLE_FINISHED: "Polyhouses/START_LIFECYCLE_FINISHED",
  LIFECYCLE_COMPLETED: "Polyhouses/LIFECYCLE_COMPLETED",
  LIFECYCLE_COMPLETED_FINISHED: "Polyhouses/LIFECYCLE_COMPLETED_FINISHED",
  MOVE_CROPS_IN_LIFECYCLE: "Polyhouses/MOVE_CROPS_IN_LIFECYCLE",
  MOVE_CROPS_IN_LIFECYCLE_FINISHED:
    "Polyhouses/MOVE_CROPS_IN_LIFECYCLE_FINISHED",
  HARVEST_CROPS_IN_LIFECYCLE: "Polyhouses/HARVEST_CROPS_IN_LIFECYCLE",
  HARVEST_CROPS_IN_LIFECYCLE_FINISHED:
    "Polyhouses/HARVEST_CROPS_IN_LIFECYCLE_FINISHED",
  DELETE_LIFECYCLE: "Polyhouses/DELETE_LIFECYCLE",
  DELETE_LIFECYCLE_FINISHED: "Polyhouses/DELETE_LIFECYCLE_FINISHED",
  UPADTE_SCHEDULE: "Polyhouses/UPADTE_SCHEDULE",
  UPADTE_SCHEDULE_FINISHED: "Polyhouses/UPADTE_SCHEDULE_FINISHED",
  UPDATE_SCHEDULE_LOCALLY: "Polyhouses/UPDATE_SCHEDULE_LOCALLY",
  ADD_SCHEDULE: "Polyhouses/ADD_SCHEDULE",
  ADD_SCHEDULE_FINISHED: "Polyhouses/ADD_SCHEDULE_FINISHED",
  DELETE_SCHEDULE: "Polyhouses/DELETE_SCHEDULE",
  DELETE_SCHEDULE_FINISHED: "Polyhouses/DELETE_SCHEDULE_FINISHED",
  SET_SENSORS: "Polyhouses/SET_SENSORS",
  SET_COMPONENTS: "Polyhouses/SET_COMPONENTS",

  fetchPolyhouses(isRefresh = false) {
    return createAction(this.REQUEST_POLYHOUSES, isRefresh);
  },

  requestLifeCycleForPolyhouse(isRefresh: boolean | string = false) {
    return createAction(this.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE, isRefresh);
  },

  requestGraphData(sensors: Sensor[], duration: string) {
    return createAction(this.REQUEST_GRAPH_DATA, { sensors, duration });
  },

  setSelectedPolyhouse(polyhouse: Polyhouse | null) {
    return createAction(this.SET_SELECTED_POLYHOUSE, polyhouse);
  },

  setSelectedSensor(sensor: null | string) {
    return createAction(this.SET_SELECTED_SENSOR, sensor);
  },

  requestSensorData(polyhouseId: string) {
    return createAction(this.REQUEST_SENSOR_DATA_FOR_POLYHOUSE, polyhouseId);
  },

  requestComponentData(polyhouseId: string) {
    return createAction(this.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE, polyhouseId);
  },

  requestNurserySensorData(nurseryId: string) {
    return createAction(this.REQUEST_SENSOR_DATA_FOR_NURSERY, nurseryId);
  },

  requestNurseryComponentData(nurseryId: string) {
    return createAction(this.REQUEST_COMPONENT_DATA_FOR_NURSERY, nurseryId);
  },

  requestBatchCount(polyhouseId: string) {
    return createAction(this.REQUEST_BATCH_COUNT, polyhouseId);
  },

  setGraphDataLocally(graphData: Graph) {
    return createAction(this.SET_GRAPH_DATA_LOCALLY, graphData);
  },

  setSelectedNursery(nursery: Nursery | null) {
    return createAction(this.SET_SELECTED_NURSERY, nursery);
  },

  setSelectedZone(zone: Zone | null) {
    return createAction(this.SET_SELECTED_ZONE, zone);
  },

  requestZoneSensorData(zoneId: string) {
    return createAction(this.REQUEST_SENSOR_DATA_FOR_ZONE, zoneId);
  },

  requestZoneComponentData(zoneId: string) {
    return createAction(this.REQUEST_COMPONENT_DATA_FOR_ZONE, zoneId);
  },

  updatePolyhouse(
    fieldName: string,
    polyhouseId: string,
    polyhouse: { [k: string]: string | number }
  ) {
    return createAction(
      this.UPDATE_POLYHOUSES,
      { polyhouseId, polyhouse },
      false,
      {
        scope: fieldName,
      }
    );
  },

  updateScheduleLocally(key: string, sensor: Sensor, uiLabel: string) {
    return createAction(this.UPDATE_SCHEDULE_LOCALLY, { key, sensor, uiLabel });
  },

  deleteSchedule(
    sensorId: string,
    parameterId: string,
    scheduleId: string | number
  ) {
    return createAction(this.DELETE_SCHEDULE, {
      sensorId,
      parameterId,
      scheduleId,
    });
  },

  updateSchedule(
    sensorName: string,
    fieldName: string,
    sensorId: string,
    parameterId: string,
    payload: { [k: string]: Schedule }
  ) {
    return createAction(
      this.UPADTE_SCHEDULE,
      { sensorId, parameterId, payload, sensorName },
      false,
      {
        scope: fieldName,
      }
    );
  },

  addSchedule(
    sensorId: string,
    parameterId: string,
    payload: { [k: string]: Schedule }
  ) {
    return createAction(this.ADD_SCHEDULE, { sensorId, parameterId, payload });
  },

  updateNursery(
    fieldName: string,
    polyhouseId: string,
    nurseryId: string,
    nursery: { [k: string]: string | number }
  ) {
    return createAction(
      this.UPDATE_NURSERY,
      { polyhouseId, nurseryId, nursery },
      false,
      {
        scope: fieldName,
      }
    );
  },

  updateZone(
    fieldName: string,
    polyhouseId: string,
    zoneId: string,
    zone: { [k: string]: string | number | object }
  ) {
    return createAction(
      this.UPDATE_ZONE,
      { polyhouseId, zoneId, zone },
      false,
      {
        scope: fieldName,
      }
    );
  },

  updatePolyhouseLocally(
    polyhouse: Polyhouse,
    polyhouses: normalizeData | null
  ) {
    return createAction(this.UPDATE_POLYHOUSE_LOCALLY, {
      polyhouse,
      polyhouses,
    });
  },

  requestPolyhouse(polyhouseId: string) {
    return createAction(this.REQUEST_POLYHOUSE, polyhouseId);
  },

  requestZone(polyhouseId: string, zoneId: string) {
    return createAction(this.REQUEST_ZONE, { polyhouseId, zoneId });
  },

  requestNursery(polyhouseId: string, nurseryId: string) {
    return createAction(this.REQUEST_NURSERY, { polyhouseId, nurseryId });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSensorData(data: any) {
    return createAction(this.UPDATE_SENSOR_DATA, data);
  },

  deletePolyhouse(polyhouseId: string) {
    return createAction(this.DELETE_POLYHOUSE, polyhouseId);
  },

  addZone(zone: Zone) {
    return createAction(this.ADD_ZONE, zone);
  },

  deleteZone(zoneId: string) {
    return createAction(this.DELETE_ZONE, zoneId);
  },

  addNursery(nursery: Nursery) {
    return createAction(this.ADD_NURSERY, nursery);
  },

  deleteNursery(nurseryId: string) {
    return createAction(this.DELETE_NURSERY, nurseryId);
  },

  addSensor(sensor: Sensor, sensorArea: string) {
    return createAction(this.ADD_SENSOR, sensor, false, {
      sensorArea,
    });
  },

  deleteSensor(sensorId: string, sensorArea: string) {
    return createAction(this.DELETE_SENSOR, sensorId, false, {
      sensorArea,
    });
  },
  setSensors(sensors: Sensor[]) {
    return createAction(this.SET_SENSORS, sensors);
  },
  setComponents(components: Sensor[]) {
    return createAction(this.SET_SENSORS, components);
  },
  addSensorData(payload: {
    data: AddSensorData;
    deviceId?: string;
    sensorId: string;
  }) {
    return createAction(this.ADD_SENSOR_DATA, payload);
  },
  addLifeCycle(payload: SaveLifeCyclePayload) {
    return createAction(this.ADD_LIFECYCLE, payload);
  },

  updateLifeCycle: ({
    payload,
    workflowInstancesId,
    isRedirect,
    polyhouseId,
  }: {
    payload: SaveLifeCyclePayload;
    workflowInstancesId: string | undefined;
    polyhouseId: string | undefined;
    isRedirect?: boolean;
  }) => {
    return createAction(PolyhouseActions.UPDATE_LIFECYCLE, {
      payload,
      workflowInstancesId,
      isRedirect,
      polyhouseId,
    });
  },

  updateLifeCycleLocally(LifeCycle: Lifecycle[]) {
    return createAction(
      this.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED,
      LifeCycle
    );
  },

  startLifeCycle({
    payload,
    polyhouseId,
    workflowInstancesId,
  }: {
    payload: StartLifeCyclePayload;
    workflowInstancesId: string | undefined;
    polyhouseId: string | undefined;
  }) {
    return createAction(this.START_LIFECYCLE, {
      payload,
      polyhouseId,
      workflowInstancesId,
    });
  },

  lifeCycleCompleted({
    polyhouseId,
    workflowInstancesId,
    handleModalClose,
  }: {
    workflowInstancesId: string | undefined;
    polyhouseId: string | undefined;
    handleModalClose: () => void;
  }) {
    return createAction(this.LIFECYCLE_COMPLETED, {
      polyhouseId,
      workflowInstancesId,
      handleModalClose,
    });
  },

  moveCropStepInLifeCycle({
    polyhouseId,
    workflowInstancesId,
    stepId,
    handleModalClose,
    payload,
  }: {
    payload: MoveCropsInLifeCyclePayload;
    workflowInstancesId: string | undefined;
    polyhouseId: string | undefined;
    stepId: string;
    handleModalClose: () => void;
  }) {
    return createAction(this.MOVE_CROPS_IN_LIFECYCLE, {
      polyhouseId,
      workflowInstancesId,
      handleModalClose,
      stepId,
      payload,
    });
  },

  harvestCropsInLifeCycle({
    polyhouseId,
    workflowInstancesId,
    stepId,
    handleModalClose,
    payload,
  }: {
    payload: HarvestCropsInLifeCyclePayload;
    workflowInstancesId: string | undefined;
    polyhouseId: string | undefined;
    stepId: string;
    handleModalClose: () => void;
  }) {
    return createAction(this.HARVEST_CROPS_IN_LIFECYCLE, {
      polyhouseId,
      workflowInstancesId,
      handleModalClose,
      stepId,
      payload,
    });
  },

  deleteLifeCycle({
    workflowInstancesId,
  }: {
    workflowInstancesId: string | undefined;
  }) {
    return createAction(this.DELETE_LIFECYCLE, {
      workflowInstancesId,
    });
  },
};

export default PolyhouseActions;
