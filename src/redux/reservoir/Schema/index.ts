import { Reservoir } from "@/pages/reservoirs/types";
import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";

const reservoirList = new schema.Entity(
  "reservoirs",
  {},
  { idAttribute: "reservoirId" }
);
const reservoirListSchema = [reservoirList];

export const reservoirNormalizeSchema = (data: normalizeData) =>
  normalize(data, reservoirListSchema);

export const addReservoirNormalizedSchema = (
  data: normalizeData,
  newEntry: Reservoir
) => {
  if (!data) return normalize([newEntry], reservoirListSchema);
  const { result, entities } = data;
  if (result && entities) {
    const resultArray = Array.isArray(result) ? result : [result];
    return {
      result: [newEntry.reservoirId, ...resultArray],
      entities: {
        reservoirs: {
          [newEntry.reservoirId]: newEntry,
          ...entities.reservoirs,
        },
      },
    };
  }
  return data;
};

export const reservoirDenormalizeSchema = (data: normalizeData) => {
  if (!data) return null;

  const { result, entities } = data;
  if (result && entities)
    return denormalize(result, reservoirListSchema, entities);
  return [];
};
