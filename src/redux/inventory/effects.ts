import api from "@/utilities/api";
import {
  delToModel,
  getToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import InventoryModel from "./models/getModels/inventoryModel";
import { SubCategoryModel } from "./models/getModels/subCategoryModel";
import FarmSelectors from "../farm/farmSelectors";
import { store } from "../store";

class InventoryEffects {
  static getInventories() {
    const selectedFarmId = FarmSelectors.SelectSelectedFarmId(store.getState());
    return getToModel(InventoryModel, `${api.INVENTORIES}/${selectedFarmId}`);
  }

  static getSubCategories() {
    return getToModel(SubCategoryModel, api.SUBCATEGORIES);
  }

  static createInventory(payload: InventoryModel) {
    return postToModel(InventoryModel, api.INVENTORIES, payload);
  }

  static createProduct(payload: InventoryModel) {
    return postToModel(InventoryModel, api.PRODUCTS, payload);
  }

  static patchInventory(payload: { id: string; data: InventoryModel }) {
    return putToModel(
      InventoryModel,
      api.INVENTORY.replace(":inventoryId", payload.id),
      payload.data
    );
  }

  static deleteInventory(id: string) {
    return delToModel(
      InventoryModel,
      api.INVENTORY.replace(":inventoryId", id)
    );
  }
}

export default InventoryEffects;
