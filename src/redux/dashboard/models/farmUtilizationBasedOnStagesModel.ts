import { BaseModel } from "sjs-base-model";

class FarmUtilizationBasedOnStagesModel extends BaseModel {
  name = null;

  quantity = null;

  constructor(data: Partial<FarmUtilizationBasedOnStagesModel>) {
    super();
    this.update(data);
  }
}

export default FarmUtilizationBasedOnStagesModel;
