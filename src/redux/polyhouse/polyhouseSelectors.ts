import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { polyhouseDenormalizeSchema } from "./Schema";
import { normalizeData } from "@/types/normalize";
import { Lifecycle, Polyhouse } from "@/pages/polyhouse/types";
import { Nursery, Zone } from "@/pages/farm/types";
import {
  makeSelectErrorModel,
  makeSelectFieldErrors,
} from "../error/errorSelector";

export default class PolyhouseSelectors {
  static SelectPolyhouseList = (state: RootState): normalizeData =>
    state?.polyhouses?.polyhouses;

  static SelectDenormalizePolyhouse = createSelector(
    (state) => state?.polyhouses?.polyhouses,
    (normalizedPolyhouses) =>
      polyhouseDenormalizeSchema(normalizedPolyhouses) || []
  );

  static SelectSelectedPolyhouse = (state: RootState) =>
    state?.polyhouses?.selectedPolyhouse;

  static SelectSelectedNursery = (state: RootState) =>
    state?.polyhouses?.selectedNursery;
  static SelectSensors = (state: RootState) => state?.polyhouses?.sensors;
  static SelectComponents = (state: RootState) => state?.polyhouses?.components;
  static SelectSelectedZone = (state: RootState) =>
    state?.polyhouses?.selectedZone;

  static SelectSensorData = (state: RootState) => state?.polyhouses?.sensorData;

  static SelectSensorNurseryData = (state: RootState) =>
    state?.polyhouses?.nurserySensorData;

  static SelectNurseryComponentData = (state: RootState) =>
    state?.polyhouses?.nurseryComponentData;

  static SelectSensorZoneData = (state: RootState) =>
    state?.polyhouses?.zoneSensorData;

  static SelectZoneComponentData = (state: RootState) =>
    state?.polyhouses?.zoneComponentData;

  static SelectComponentData = (state: RootState) =>
    state?.polyhouses?.componentData;

  static SelectBatchCount = (state: RootState) => state?.polyhouses?.batchCount;

  static SelectSensorName = (state: RootState) =>
    state?.polyhouses?.selectedSensorName;

  static SelectNormalGraph = (state: RootState) => state?.polyhouses?.graph;

  static SelectGraph = (state: RootState) => state?.polyhouses?.graph;

  static SelectLifeCycles = (state: RootState) =>
    state?.polyhouses?.lifeCycles || [];

  static SelectLifeCycleByInstanceId = (
    state: RootState,
    instanceId: string | undefined
  ) => {
    const { lifeCycles } = state?.polyhouses;

    const lifeCycle = lifeCycles
      ? lifeCycles.find(
          (lifeCycle: Lifecycle) => lifeCycle.workflowInstanceId === instanceId
        )
      : {};

    return lifeCycle;
  };

  static SelectZoneOptions = createSelector(
    this.SelectSelectedPolyhouse,
    (polyhouse: Polyhouse) => {
      let zoneList: any = [];

      if (polyhouse && polyhouse.zones) {
        zoneList = polyhouse.zones.map((zone: Zone) => {
          return {
            label: zone.name,
            value: zone.zoneId,
          };
        });
      }

      return zoneList;
    }
  );

  static SelectNurseryOptions = createSelector(
    this.SelectSelectedPolyhouse,
    (polyhouse: Polyhouse) => {
      let nurseryList: any = [];

      if (polyhouse && polyhouse.nurseries) {
        nurseryList = polyhouse.nurseries.map((nursery: Nursery) => {
          return {
            label: nursery.name,
            value: nursery.nurseryId,
          };
        });
      }

      return nurseryList;
    }
  );

  static SelectFieldErrors = createSelector(
    makeSelectErrorModel(),
    makeSelectFieldErrors(),
    (_, fieldErrors) => fieldErrors
  );

  static findSensorInComponentData = (componentData: any, sensorId: string) => {
    if (!componentData) return null;

    for (const key in componentData) {
      const components = componentData[key];
      const foundSensor = components.find(
        (component: any) => component.sensorId === sensorId
      );
      if (foundSensor) {
        return foundSensor;
      }
    }

    return null;
  };

  static SelectSensorById = (sensorId: string) =>
    createSelector(
      this.SelectNurseryComponentData,
      this.SelectZoneComponentData,
      this.SelectComponentData,
      (nurseryComponentData, zoneComponentData, componentData) => {
        const sensorFromNursery = this.findSensorInComponentData(
          nurseryComponentData,
          sensorId
        );
        if (sensorFromNursery)
          return { sensor: sensorFromNursery, source: "nurseryComponentData" };

        const sensorFromZone = this.findSensorInComponentData(
          zoneComponentData,
          sensorId
        );
        if (sensorFromZone)
          return { sensor: sensorFromZone, source: "zoneComponentData" };

        const sensorFromComponent = this.findSensorInComponentData(
          componentData,
          sensorId
        );
        if (sensorFromComponent)
          return { sensor: sensorFromComponent, source: "componentData" };
      }
    );
}
