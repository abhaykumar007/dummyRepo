import { Polyhouse, Sensor } from "@/pages/polyhouse/types";
import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";

const polyhouseList = new schema.Entity(
  "polyhouses",
  {},
  { idAttribute: "polyhouseId" }
);
const polyhouseListSchema = [polyhouseList];

export const polyhouseNormalizeSchema = (data: normalizeData) =>
  normalize(data, polyhouseListSchema);

export const addPolyhouseNormalizedSchema = (
  data: normalizeData,
  newEntry: Polyhouse
) => {
  if (!data) return normalize([newEntry], polyhouseListSchema);
  const { result, entities } = data;
  if (result && entities) {
    const resultArray = Array.isArray(result) ? result : [result];
    return {
      result: [newEntry.polyhouseId, ...resultArray],
      entities: {
        polyhouses: {
          [newEntry.polyhouseId]: newEntry,
          ...entities.polyhouses,
        },
      },
    };
  }
  return data;
};

export const polyhouseDenormalizeSchema = (data: normalizeData) => {
  if (!data) return null;

  const { result, entities } = data;
  if (result && entities)
    return denormalize(result, polyhouseListSchema, entities);
  return [];
};

export const groupByUILabel = (sensorData: Sensor[]) => {
  const groupedData: any = {};

  sensorData.forEach((sensor: { parameters: any[] }) => {
    sensor.parameters.forEach((parameter) => {
      const { uiLabel } = parameter;

      if (!groupedData[uiLabel]) {
        groupedData[uiLabel] = [];
      }

      groupedData[uiLabel].push(sensor);
    });
  });

  return groupedData;
};
