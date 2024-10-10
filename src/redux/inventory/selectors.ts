import { Inventory, Product } from "@/pages/inventory/types";
import { RootState } from "../store";
import { SubCategoryModel } from "./models/getModels/subCategoryModel";
import {
  inventoryDenormalizeSchema,
  subCategoryDenormalizeSchema,
} from "./schema";

class InventorySelectors {
  public static selectInventories(state: RootState) {
    return inventoryDenormalizeSchema(state?.inventories?.inventories);
  }

  public static selectFilteredInventories(state: RootState) {
    let inventories = [...InventorySelectors.selectInventories(state)];
    const filters = state?.inventories?.filters;

    if (filters.search) {
      inventories = inventories.filter((inventory: Inventory) =>
        inventory.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      const subCategory = InventorySelectors.selectSubCategoryById(
        state,
        filters.category
      );
      const products =
        subCategory?.products.map((product: Product) => product.id) || [];
      inventories = inventories.filter((inventory: Inventory) =>
        products.includes(inventory.productId)
      );
    }
    if (filters.product) {
      inventories = inventories.filter(
        (inventory: Inventory) => inventory.productId === filters.product
      );
    }
    return inventories;
  }

  public static selectNormalizedInventories(state: RootState) {
    return state?.inventories?.inventories;
  }

  public static selectSubCategories(state: RootState) {
    return subCategoryDenormalizeSchema(state?.inventories?.subCategories);
  }

  public static selectSubCategoryById(state: RootState, id: string) {
    return state?.inventories?.subCategories?.entities?.subCategories[id];
  }

  public static selectSelectedInventory(state: RootState) {
    return state?.inventories?.selectedInventory;
  }

  public static selectInventoryById(state: RootState, id: string) {
    return state?.inventories?.inventories?.entities?.inventories[id];
  }

  static SelectInventoryOptions(state: RootState) {
    const inventories = InventorySelectors.selectInventories(state);
    const subCategory = InventorySelectors.selectSubCategories(state)?.find(
      (category: SubCategoryModel) => category.name === "Seeds"
    );

    if (!subCategory || !subCategory.products) return [];

    const productIds = subCategory.products.map(
      (product: Product) => product.id
    );

    return inventories
      .filter((inventory: Inventory) =>
        productIds.includes(inventory.productId)
      )
      .map((inventory: Inventory) => ({
        label: inventory.name,
        value: inventory.inventoryId,
        ...inventory,
      }));
  }
}

export default InventorySelectors;
