import { all, call, cancel, put, select, takeEvery } from "redux-saga/effects";
import InventoryActions from "./actions";
import { SagaAction } from "@/types/redux";
import { runEffect } from "@/utilities/actionUtility";
import InventoryEffects from "./effects";
import { ProductModel } from "./models/createModels/productModel";
import { InventoryModel } from "./models/createModels/inventoryModel";
import { resultHasError } from "@/utilities/onError";
import { successToast } from "@/utilities/toast";
import { router } from "@/routes";
import InventorySelectors from "./selectors";
import { Inventory, Product } from "@/pages/inventory/types";
import ErrorModel from "@/models/error/errorModel";
import { normalizeData } from "@/types/normalize";
import { getTranslation } from "@/translation/i18n";

function* FETCH_INVENTORIES(action: SagaAction) {
  yield call(runEffect, action, InventoryEffects.getInventories);
}

function* FETCH_SUBCATEGORIES(action: SagaAction) {
  yield call(runEffect, action, InventoryEffects.getSubCategories);
}

function* CREATE_INVENTORY(action: SagaAction) {
  const inventory = new InventoryModel(action.payload);
  const result: Inventory | ErrorModel = yield call(
    runEffect,
    action,
    InventoryEffects.createInventory,
    inventory
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
  const inventoryResult = result as Inventory;
  successToast(
    `${inventoryResult.name} ${getTranslation("global.isCreatedSucessfully")}`
  );
  router.navigate("/inventory");
}

function* CREATE_PRODUCT(action: SagaAction) {
  const product = new ProductModel(action.payload);
  const result: Product | ErrorModel = yield call(
    runEffect,
    action,
    InventoryEffects.createProduct,
    product
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
  const productResult = result as Product;
  successToast(
    `${productResult.name} ${getTranslation("global.isRequestedSuccessfully")}`
  );
}

function* PATCH_INVENTORY(action: SagaAction) {
  const result: Inventory | ErrorModel = yield call(
    runEffect,
    action,
    InventoryEffects.patchInventory,
    action.payload
  );
  if (resultHasError(result as ErrorModel)) yield cancel();

  const inventories: normalizeData = yield select(
    InventorySelectors.selectNormalizedInventories
  );
  const updatedInventories = {
    ...inventories.entities.inventories,
    [action.payload?.id]: result,
  };

  const inventory = result as Inventory;
  yield put(
    InventoryActions.updateInventoriesLocally({
      selectedInventory: inventory,
      inventories: {
        result: inventories.result,
        entities: { inventories: updatedInventories },
      },
    })
  );
}

function* DELETE_INVENTORY(action: SagaAction) {
  const result: null | ErrorModel = yield call(
    runEffect,
    action,
    InventoryEffects.deleteInventory,
    action.payload
  );
  if (resultHasError(result as ErrorModel)) yield cancel();
  const inventoryResult: Inventory = yield select(
    InventorySelectors.selectInventoryById,
    action.payload
  );
  
  successToast(
    `${inventoryResult.name} ${getTranslation("global.isDeletedSuccessfully")}`
  );

  const inventories: normalizeData = yield select(
    InventorySelectors.selectNormalizedInventories
  );
  const resultIds: string[] = inventories.result as string[];
  const inventoryIds = resultIds.filter(
    (inventoryId: string) => inventoryId !== action.payload
  );

  const { [action.payload]: _, ...newInventories } =
    inventories?.entities?.inventories;
  yield put(
    InventoryActions.updateInventoriesLocally({
      selectedInventory: null,
      inventories: {
        result: inventoryIds,
        entities: { inventories: newInventories },
      },
    })
  );
  yield put(InventoryActions.unselectInventory());
}
export default function* inventorySaga() {
  yield all([
    takeEvery(InventoryActions.FETCH_INVENTORIES, FETCH_INVENTORIES),
    takeEvery(InventoryActions.FETCH_SUBCATEGORIES, FETCH_SUBCATEGORIES),
    takeEvery(InventoryActions.CREATE_INVENTORY, CREATE_INVENTORY),
    takeEvery(InventoryActions.CREATE_PRODUCT, CREATE_PRODUCT),
    takeEvery(InventoryActions.PATCH_INVENTORY, PATCH_INVENTORY),
    takeEvery(InventoryActions.DELETE_INVENTORY, DELETE_INVENTORY),
  ]);
}
