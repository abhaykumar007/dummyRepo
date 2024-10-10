import { BaseModel } from "sjs-base-model";

export default class UserModel extends BaseModel {

  firstName = null;

  lastName = null;

  phone = null;

  email = null;

  address = null;

  password = null;

  role = null;

  organisationName = null;
  
  roles = null;

  constructor(data: Partial<UserModel>) {
    super();
    this.update(data);
  }
}