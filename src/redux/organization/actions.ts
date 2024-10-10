import { createAction } from "@/utilities/actionUtility";

const OrganizationActions = {
  REQUEST_ORGANIZATION: "organization/REQUEST_ORGANIZATION",
  REQUEST_ORGANIZATION_FINISHED: "organization/REQUEST_ORGANIZATION_FINISHED",
  SELECT_ORGANIZATION: "organization/SELECT_ORGANIZATION",
  GET_ORGANIZATION_FROM_STORAGE: "organization/GET_ORGANIZATION_FROM_STORAGE",

  requestOrganization: () =>
    createAction(OrganizationActions.REQUEST_ORGANIZATION),

  selectOrganization: (
    organizationId: string,
    isFromRefresh: boolean = false
  ) =>
    createAction(OrganizationActions.SELECT_ORGANIZATION, {
      organizationId,
      isFromRefresh,
    }),

  getOrganizationFromStorage() {
    return createAction(OrganizationActions.GET_ORGANIZATION_FROM_STORAGE);
  },
};
export default OrganizationActions;
