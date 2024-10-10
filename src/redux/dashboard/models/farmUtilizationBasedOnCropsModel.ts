import { BaseModel } from "sjs-base-model";

class FarmUtilizationBasedOnCropsModel extends BaseModel {
  name = null;

  quantity = null;

  constructor(data: Partial<FarmUtilizationBasedOnCropsModel>) {
    super();
    this.update(data);
  }
}

export default FarmUtilizationBasedOnCropsModel;
