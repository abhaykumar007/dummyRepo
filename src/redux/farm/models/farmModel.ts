import { BaseModel } from "sjs-base-model";

class FarmModel extends BaseModel {
  farmId = null;

  id = null;

  organisationId = null;

  name = null;

  area = null;

  cultivableArea = null;

  location = null;

  polyhouses = null;

  reservoirs = null;

  nutrient = null;

  device = null;

  state = null;

  createdBy = null;

  updatedBy = null;

  createdDate = null;

  updatedDate = null;

  constructor(data: Partial<FarmModel>) {
    super();
    this.update(data);
  }
}

export default FarmModel;
