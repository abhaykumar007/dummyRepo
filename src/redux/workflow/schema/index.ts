import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";

const workflowList = new schema.Entity(
  "workflows",
  {},
  { idAttribute: "workflowId" }
);
const workflowListSchema = [workflowList];

export const workflowNormalizeSchema = (data: normalizeData) =>
  normalize(data, workflowListSchema);

export const workflowDenormalizeSchema = (data: normalizeData) => {
  if (!data) return null;

  const { result, entities } = data;
  if (result && entities)
    return denormalize(result, workflowListSchema, entities);
  return [];
};
