import { createAction } from "@/utilities/actionUtility";
import {
  CreateInventory,
  Product,
  Inventory,
  PatchInventory,
} from "@/pages/inventory/types";
import { normalizeData } from "@/types/normalize";

const InventoryActions = {
  FETCH_INVENTORIES: "inventories/FETCH_INVENTORIES",
  FETCH_INVENTORIES_FINISHED: "inventories/FETCH_INVENTORIES_FINISHED",
  FETCH_SUBCATEGORIES: "inventories/FETCH_SUBCATEGORIES",
  FETCH_SUBCATEGORIES_FINISHED: "inventories/FETCH_SUBCATEGORIES_FINISHED",
  CREATE_INVENTORY: "inventories/CREATE_INVENTORY",
  CREATE_INVENTORY_FINISHED: "inventories/CREATE_INVENTORY_FINISHED",
  CREATE_PRODUCT: "inventories/CREATE_PRODUCT",
  CREATE_PRODUCT_FINISHED: "inventories/CREATE_PRODUCT_FINISHED",
  SELECT_INVENTORY: "inventories/SELECT_INVENTORY",
  SELECT_INVENTORY_FINISHED: "inventories/SELECT_INVENTORY_FINISHED",
  UNSELECT_INVENTORY: "inventories/UNSELECT_INVENTORY",
  UNSELECT_INVENTORY_FINISHED: "inventories/UNSELECT_INVENTORY_FINISHED",
  PATCH_INVENTORY: "inventories/PATCH_INVENTORY",
  PATCH_INVENTORY_FINISHED: "inventories/PATCH_INVENTORY_FINISHED",
  DELETE_INVENTORY: "inventories/DELETE_INVENTORY",
  DELETE_INVENTORY_FINISHED: "inventories/DELETE_INVENTORY_FINISHED",
  UPDATE_INVENTORIES_LOCALLY: "inventories/UPDATE_INVENTORIES_LOCALLY",
  SET_FILTER: "inventories/SET_FILTER",

  fetchInventories() {
    return createAction(this.FETCH_INVENTORIES);
  },

  fetchSubCategories() {
    return createAction(this.FETCH_SUBCATEGORIES);
  },

  createInventory(payload: CreateInventory) {
    return createAction(this.CREATE_INVENTORY, payload);
  },

  createProduct(payload: Product) {
    return createAction(this.CREATE_PRODUCT, payload);
  },

  selectInventory(payload: Inventory) {
    return createAction(this.SELECT_INVENTORY, payload);
  },

  unselectInventory() {
    return createAction(this.UNSELECT_INVENTORY);
  },

  patchInventory(payload: { id: string; data: PatchInventory }, scope: string) {
    return createAction(this.PATCH_INVENTORY, payload, false, {
      scope: scope,
    });
  },

  deleteInventory(payload: string) {
    return createAction(this.DELETE_INVENTORY, payload);
  },

  updateInventoriesLocally(payload: {
    selectedInventory: Inventory | null;
    inventories: normalizeData;
  }) {
    return createAction(this.UPDATE_INVENTORIES_LOCALLY, payload);
  },

  setFilter(filter: Record<string, string | null>) {
    return createAction(this.SET_FILTER, filter);
  },
};

export default InventoryActions;
