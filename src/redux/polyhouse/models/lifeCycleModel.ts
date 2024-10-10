import { BaseModel } from "sjs-base-model";

class LifeCycleModel extends BaseModel {
  id = null;

  name = null;

  description = null;

  workflowInstanceId = null;

  inventoryId = null;

  organisationId = null;

  farmId = null;

  polyhouseId = null;

  batchPrefix = null;

  completedBy = null;

  startedBy = null;

  createdBy = null;

  updatedBy = null;

  qty = null;

  startedOn = null;

  createdDate = null;

  updatedDate = null;

  completedOn = null;

  workflowInstanceSteps = null;

  status = null;

  isCompleted = null;

  unit = null;

  batches = null;

  inventory = null;

  constructor(data: Partial<LifeCycleModel>) {
    super();
    this.update(data);
  }
}

export default LifeCycleModel;
