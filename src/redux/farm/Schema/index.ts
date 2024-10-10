import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";
import { Farm } from "@/pages/farm/types";

const farmList = new schema.Entity("farms", {}, { idAttribute: "farmId" });
const farmListSchema = [farmList];

export const farmNormalizeSchema = (data: normalizeData) =>
  normalize(data, farmListSchema);

export const addFarmNormalizedSchema = (
  data: normalizeData,
  newEntry: Farm
) => {
  if (!data) return normalize([newEntry], farmListSchema);
  const { result, entities } = data;
  if (result && entities) {
    const resultArray = Array.isArray(result) ? result : [result];
    return {
      result: [newEntry.farmId, ...resultArray],
      entities: { farms: { [newEntry.farmId]: newEntry, ...entities.farms } },
    };
  }
  return data;
};

export const farmDenormalizeSchema = (data: normalizeData) => {
  if (!data) return null;

  const { result, entities } = data;
  if (result && entities) return denormalize(result, farmListSchema, entities);
  return [];
};
