import { RootState } from "../store";

class OrganizationSelectors {
  static SelectOrganization = (state: RootState) =>
    state.organizations.organisations;
  static SelectSelectedOrganizationId = (state: RootState) =>
    state.organizations.selectedOrganisationId;
}

export default OrganizationSelectors;
