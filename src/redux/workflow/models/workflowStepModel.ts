import { BaseModel } from "sjs-base-model";

export default class WorkflowStepModel extends BaseModel {
  stepId = null;

  description = null;

  parentId = null;

  name = null;

  sequence = null;

  duration = null;

  constructor(data: Partial<WorkflowStepModel>) {
    super();
    this.update(data);
  }
}
