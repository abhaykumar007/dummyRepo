import { BaseModel } from "sjs-base-model";

export default class UserModel extends BaseModel {
    userId = null;

    firstName = null;

    lastName = null;

    phone = null;

    roles = null;

    role = null;

    organisationId = null;

    createdBy = null

    updatedBy = null

    createdDate = 0

    updatedDate = 0

    constructor(data: Partial<UserModel>) {
        super();
        this.update(data);
    }
}