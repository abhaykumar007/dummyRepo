import { BaseModel } from "sjs-base-model";

class FarmMetricsModel extends BaseModel {
  totalPolyhouses = null;
  totalReservoirs = null;
  totalNurseries = null;
  totalZones = null;
  constructor(data: Partial<FarmMetricsModel>) {
    super();
    this.update(data);
  }
}

export default FarmMetricsModel;
