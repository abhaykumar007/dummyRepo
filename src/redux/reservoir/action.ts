import { Reservoir } from "@/pages/reservoirs/types";
import { createAction } from "@/utilities/actionUtility";
import { Reservoir as ReservoirType } from "@/pages/farm/types";
import { normalizeData } from "@/types/normalize";

const ReservoirActions = {
  REQUEST_RESERVOIR: "RESERVOIR/REQUEST_RESERVOIR",
  REQUEST_RESERVOIR_FINISHED: "RESERVOIR/REQUEST_RESERVOIR_FINISHED",
  SET_SELECTED_RESERVOIR: "RESERVOIR/SET_SELECTED_RESERVOIR",
  ADD_RESERVOIR: "RESERVOIR/ADD_RESERVOIR",
  ADD_RESERVOIR_FINISHED: "RESERVOIR/ADD_RESERVOIR_FINISHED",
  DELETE_RESERVOIR: "RESERVOIR/DELETE_RESERVOIR",
  DELETE_RESERVOIR_FINISHED: "RESERVOIR/DELETE_RESERVOIR_FINISHED",
  UPDATE_RESERVOIR: "RESERVOIR/UPDATE_RESERVOIR",
  UPDATE_RESERVOIR_FINISHED: "RESERVOIR/UPDATE_RESERVOIR_FINISHED",
  UPDATE_RESERVOIR_LOCALLY: "RESERVOIR/UPDATE_RESERVOIR_LOCALLY",

  fetchReservoir() {
    return createAction(this.REQUEST_RESERVOIR);
  },

  setSelectedReservoir(reservoir: Reservoir | null) {
    return createAction(this.SET_SELECTED_RESERVOIR, reservoir);
  },

  addReservoir(reservoir: ReservoirType) {
    return createAction(this.ADD_RESERVOIR, reservoir);
  },

  deleteReservoir() {
    return createAction(this.DELETE_RESERVOIR);
  },

  updateReservoir(
    fieldName: string,
    reservoirId: string,
    updatedReservoirValue: object
  ) {
    return createAction(
      this.UPDATE_RESERVOIR,
      { reservoirId, reservoir: updatedReservoirValue },
      false,
      {
        scope: fieldName,
      }
    );
  },

  updateReservoirLocally(
    selectedReservoir: Reservoir | null,
    reservoirs: normalizeData
  ) {
    return createAction(this.UPDATE_RESERVOIR_LOCALLY, {
      selectedReservoir,
      reservoirs,
    });
  },
};

export default ReservoirActions;
