import BaseReducer from "@/utilities/baseReducer";
import OrganizationActions from "./actions";

export const initialState = {
  organisations: [],
  selectedOrganisationId: null,
};

export default BaseReducer(
  initialState,
  {
    [OrganizationActions.REQUEST_ORGANIZATION_FINISHED](state, action) {
      return { ...state, organisations: action.payload };
    },
    [OrganizationActions.SELECT_ORGANIZATION](state, action) {
      return {
        ...state,
        selectedOrganisationId: action.payload.organizationId,
      };
    },
  },
  false
);
