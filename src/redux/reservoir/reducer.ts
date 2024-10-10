import BaseReducer from "@/utilities/baseReducer";
import ReservoirActions from "./action";
import {
  reservoirNormalizeSchema,
  addReservoirNormalizedSchema,
} from "./Schema";

const initialState = {
  reservoirs: null,
  selectedReservoir: null,
};

export default BaseReducer(initialState, {
  [ReservoirActions.REQUEST_RESERVOIR_FINISHED](state, action) {
    return {
      ...state,
      reservoirs: Array.isArray(action.payload)
        ? reservoirNormalizeSchema(action.payload)
        : null,
    };
  },
  [ReservoirActions.SET_SELECTED_RESERVOIR](state, action) {
    return {
      ...state,
      selectedReservoir: action.payload,
    };
  },

  [ReservoirActions.ADD_RESERVOIR_FINISHED](state, action) {
    return {
      ...state,
      reservoirs: addReservoirNormalizedSchema(
        state?.reservoirs,
        action.payload
      ),
      selectedReservoir: action.payload,
    };
  },

  [ReservoirActions.UPDATE_RESERVOIR_LOCALLY](state, action) {
    return {
      ...state,
      selectedReservoir: action.payload.selectedReservoir,
      reservoirs: action.payload.reservoirs,
    };
  },
});
