import { normalizeData } from "@/types/normalize";
import { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";
import { workflowDenormalizeSchema } from "./schema";
import {
  makeSelectErrorModel,
  makeSelectFieldErrors,
} from "../error/errorSelector";
import WorkflowModel from "./models/workflowModel";

class WorkflowSelectors {
  static SelectWorkflowList = (state: RootState): normalizeData =>
    state?.workflows?.workflows;

  static SelectDenormalizeWorkflow = createSelector(
    WorkflowSelectors.SelectWorkflowList,
    (normalizedWorkflows) => workflowDenormalizeSchema(normalizedWorkflows)
  );
  static SelectCreateUpdateWorkflowFieldErrors = createSelector(
    makeSelectErrorModel(),
    makeSelectFieldErrors(),
    (_, fieldErrors) => fieldErrors
  );

  static SelectWorkflowByWorkflowId = (
    state: RootState,
    workflowId: string | undefined
  ) =>
    workflowId
      ? state.workflows?.workflows?.entities?.workflows?.[workflowId]
      : null;

  static SelectSelectedWorkflow = (state: RootState) =>
    state.workflows?.selectedWorkflow;

  static SelectWorkflowOptions = createSelector(
    this.SelectDenormalizeWorkflow,
    (workflows: WorkflowModel[]) => {
      let workflowList: any = [];

      if (workflows.length > 0) {
        workflowList = workflows.map((workflow: WorkflowModel) => {
          return {
            label: workflow.name,
            value: workflow.workflowId,
          };
        });
      }

      return workflowList;
    }
  );
}

export default WorkflowSelectors;
