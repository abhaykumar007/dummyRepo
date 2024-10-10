import api from "@/utilities/api";
import { getToModel } from "@/utilities/effectUtility";
import OrganizationModel from "./models/organizationModel";

export default class OrganizationEffects {
  static requestOrganization() {
    return getToModel(OrganizationModel, api.ORGANIZATIONS);
  }
}
