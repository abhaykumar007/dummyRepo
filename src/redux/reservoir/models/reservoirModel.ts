import { BaseModel } from "sjs-base-model";

class ReservoirModel extends BaseModel {
  reservoirId = null;

  name = null;

  reservoirCapacity = null;

  nutrientWaterReservoirCapacity = null;

  phReservoirCapacity = null;

  stockNutrientSolutionCapacity = null;

  createdBy = null;

  updatedBy = null;

  createdDate = null;

  updatedDate = null;

  constructor(data: Partial<ReservoirModel>) {
    super();
    this.update(data);
  }
}

export default ReservoirModel;
