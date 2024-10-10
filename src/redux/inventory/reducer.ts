import BaseReducer from "@/utilities/baseReducer";
import InventoryActions from "./actions";
import invertoryNormalizeSchema, { addNormalizeInventory, subCategoryNormalizeSchema } from "./schema";

const initialState = {
  inventories: {},
  selectedInventory: null,
  updatedInventory: {},
  subCategories: {},
  filters:{
    search:null,
    category:null,
    product:null,
  }
};

export default BaseReducer(initialState, {
  [InventoryActions.FETCH_INVENTORIES_FINISHED](state, action) {
    return {
      ...state,
      inventories: invertoryNormalizeSchema(action.payload),
    };
  },
  [InventoryActions.CREATE_INVENTORY_FINISHED](state, action) {
    return {
      ...state,
      inventories: addNormalizeInventory(state.inventories, action.payload),
    };
  },
  [InventoryActions.SELECT_INVENTORY](state, action) {
      return {
          ...state,
          selectedInventory: action.payload,
      };
  },
  [InventoryActions.UNSELECT_INVENTORY](state) {
      return {
          ...state,
          selectedInventory: null,
      };
  },
  [InventoryActions.UPDATE_INVENTORIES_LOCALLY](state, action) {
      return {
          ...state,
          selectedInventory: action.payload.selectedInventory,
          inventories: action.payload.inventories,
      };
  },

  [InventoryActions.FETCH_SUBCATEGORIES_FINISHED](state, action) {
    return {
      ...state,
      subCategories: subCategoryNormalizeSchema(action.payload),
    };
  },
  [InventoryActions.SET_FILTER](state, action) {
    return {
      ...state,
      filters: {...state.filters, ...action.payload},
    };
  },
  
});
