import { BaseModel } from "sjs-base-model";

export class ProductModel extends BaseModel {
    id = null;
    subCategoryId = null;
    name = null;
    unit = null;
    properties = null;
    isAdminApproved = null;
    createdBy = null;
    updatedBy = null;
    createdDate = null;
    updatedDate = null;
  
    constructor(data: Partial<ProductModel>) {
      super();
      this.update(data);
    }
  }