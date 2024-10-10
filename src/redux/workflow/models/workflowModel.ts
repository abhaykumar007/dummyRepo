import { BaseModel } from "sjs-base-model";
import WorkflowStepModel from "./workflowStepModel";

export default class WorkflowModel extends BaseModel {
  id = null;

  workflowId = null;

  description = null;

  partnerId = null;

  name = null;

  organisationId = null;

  isInbuilt = false;

  createdBy = null;

  updatedBy = null;

  createdDate = null;

  updatedDate = null;

  workflowSteps = [WorkflowStepModel];

  constructor(data: Partial<WorkflowModel>) {
    super();
    this.update(data);
  }
}
