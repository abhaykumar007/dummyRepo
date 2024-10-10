import BaseReducer from "@/utilities/baseReducer";
import WorkflowActions from "./actions";
import { workflowNormalizeSchema } from "./schema";

export const initialState = {
  workflows: {},
  selectedWorkflow: null,
};

export default BaseReducer(
  initialState,
  {
    [WorkflowActions.REQUEST_WORKFLOW_FINISHED](state, action) {
      return {
        ...state,
        workflows:
          Array.isArray(action.payload) && action.payload.length > 0
            ? workflowNormalizeSchema(action.payload)
            : {},
      };
    },
    [WorkflowActions.SELECTED_WORKFLOW](state, action) {
      return { ...state, selectedWorkflow: action.payload };
    },
    [WorkflowActions.UPDATE_WORKFLOW_LOCALLY](state, action) {
      console.log(action.payload);
      return { ...state, workflows: action.payload };
    },
  },
  false
);
