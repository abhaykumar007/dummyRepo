import { Inventory } from "@/pages/inventory/types";
import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";

const inventory = new schema.Entity("inventories", {}, { idAttribute: "inventoryId" });

const inventoryListSchema = [inventory];

const invertoryNormalizeSchema = (data: normalizeData | any) =>{
  if(!Array.isArray(data)) return {};
  return normalize(data, inventoryListSchema)};

export const inventoryDenormalizeSchema = (data: normalizeData) => {
  const { result, entities } = data;
  if (result && entities) return denormalize(result, inventoryListSchema, entities);
  return [];
};

export const addNormalizeInventory =(data :normalizeData, newInventory:Inventory)=>{
    const { result, entities } = data
    
    if (result && entities) {
      const resultArray = Array.isArray(result) ? result : [result];
      return {
        result: [newInventory.inventoryId , ...resultArray],
        entities: {inventories: {...entities.inventories,[newInventory.inventoryId]: newInventory}}
    }}

    return data
}

const subCategory = new schema.Entity("subCategories", {}, { idAttribute: "subCategoryId" });

const subCategoryListSchema = [subCategory];

export const subCategoryNormalizeSchema = (data: normalizeData) => normalize(data, subCategoryListSchema);

export const subCategoryDenormalizeSchema = (data: normalizeData) => {
  const { result, entities } = data;
  if (result && entities) return denormalize(result, subCategoryListSchema, entities);
  return [];
};

export const addNormalizeSubCategory =(data :normalizeData, newSubCategory:any)=>{
    const { result, entities } = data
    
    if (result && entities) {
      const resultArray = Array.isArray(result) ? result : [result];
      return {
        result: [newSubCategory.subCategoryId , ...resultArray],
        entities: {subCategories: {...entities.subCategories,[newSubCategory.subCategoryId]: newSubCategory}}
    }}

    return data
}

export default invertoryNormalizeSchema;