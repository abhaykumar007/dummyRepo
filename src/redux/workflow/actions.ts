import { workflow, workflowPayload } from "@/pages/workflow/types";
import { normalizeData } from "@/types/normalize";
import { createAction } from "@/utilities/actionUtility";

const WorkflowActions = {
  REQUEST_WORKFLOW: "workflow/REQUEST_WORKFLOW",
  REQUEST_WORKFLOW_FINISHED: "workflow/REQUEST_WORKFLOW_FINISHED",
  CREATE_WORKFLOW: "workflow/CREATE_WORKFLOW",
  CREATE_WORKFLOW_FINISHED: "workflow/CREATE_WORKFLOW_FINISHED",
  UPDATE_WORKFLOW: "workflow/UPDATE_WORKFLOW",
  UPDATE_WORKFLOW_FINISHED: "workflow/UPDATE_WORKFLOW_FINISHED",
  SELECTED_WORKFLOW: "workflow/SELECTED_WORKFLOW",
  UPDATE_WORKFLOW_LOCALLY: "workflow/UPDATE_WORKFLOW_LOCALLY",

  requestWorkflow: () => createAction(WorkflowActions.REQUEST_WORKFLOW),
  selectWorkflow: (workflow: workflow | null) =>
    createAction(WorkflowActions.SELECTED_WORKFLOW, workflow),
  createWorkflow: ({ payload }: { payload: workflowPayload }) =>
    createAction(WorkflowActions.CREATE_WORKFLOW, {
      payload,
    }),
  updateWorkflow: ({
    payload,
    workflowId,
    isRedirect,
  }: {
    payload: workflowPayload;
    workflowId: string | undefined;
    isRedirect?: boolean;
  }) =>
    createAction(WorkflowActions.UPDATE_WORKFLOW, {
      payload,
      workflowId,
      isRedirect,
    }),

  updateWorkflowLocally(workflows: normalizeData) {
    return createAction(WorkflowActions.UPDATE_WORKFLOW_LOCALLY, workflows);
  },
};
export default WorkflowActions;
