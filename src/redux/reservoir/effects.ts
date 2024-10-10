import {
  delToModel,
  getToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import api from "@/utilities/api";
import FarmSelectors from "../farm/farmSelectors";
import { store } from "../store";
import ReservoirModel from "./models/reservoirModel";

export default class ReservoirEffects {
  static getReservoir() {
    return getToModel(
      ReservoirModel,
      api.RESERVOIRS.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      )
    );
  }

  static addReservoir(payload: ReservoirModel) {
    return postToModel(
      ReservoirModel,
      api.RESERVOIRS.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ),
      payload
    );
  }

  static updateReservoir(
    reservoirId: string,
    payload: { [k: string]: string | number }
  ) {
    return putToModel(
      ReservoirModel,
      api.RESERVOIR.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":reservoirId", reservoirId),
      payload
    );
  }

  static deleteReservoir(reservoirId: string) {
    return delToModel(
      ReservoirModel,
      api.RESERVOIR.replace(
        ":farmId",
        FarmSelectors.SelectSelectedFarmId(store.getState())
      ).replace(":reservoirId", reservoirId)
    );
  }
}
