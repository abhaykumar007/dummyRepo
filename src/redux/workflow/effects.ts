import api from "@/utilities/api";
import { getToModel, postToModel, putToModel } from "@/utilities/effectUtility";
import WorkflowModel from "./models/workflowModel";

export default class WorkflowEffects {
  static requestWorkflow() {
    return getToModel(WorkflowModel, api.WORKFLOW);
  }
  static createWorkflow(payload: WorkflowModel) {
    return postToModel(WorkflowModel, api.WORKFLOW, payload);
  }
  static updateWorkflow(payload: WorkflowModel, workflowId: string) {
    return putToModel(
      WorkflowModel,
      api.UPDATE_WORKFLOW.replace(":workflowId", workflowId),
      payload
    );
  }
}
