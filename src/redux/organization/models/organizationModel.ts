import { BaseModel } from "sjs-base-model";

export default class OrganizationModel extends BaseModel {
  id = null;

  organisationId = null;

  organisationName = null;

  partnerId = null;

  logo = null;

  createdBy = null;

  updatedBy = null;

  createdDate = null;

  updatedDate = null;

  constructor(data: Partial<OrganizationModel>) {
    super();
    this.update(data);
  }
}
